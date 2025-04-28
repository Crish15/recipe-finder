use actix_web::{web, HttpResponse, Responder, HttpRequest};
use sqlx::postgres::PgPool;
use crate::users::models::{RegisterInput, LoginInput, ApiKeyInput, User};
use crate::users::jwt::create_jwt;
use std::env;
use argon2::{Argon2, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{SaltString, PasswordHash};
use rand::{distributions::Alphanumeric, Rng};
use actix_multipart::Multipart;
use futures_util::StreamExt as _;
use std::io::Write;
use std::fs;

fn generate_salt() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(32)
        .map(char::from)
        .collect()
}

fn hash_with_salt(value: &str, salt: &str) -> String {
    let argon2 = Argon2::default();
    let salt = SaltString::encode_b64(salt.as_bytes()).unwrap();
    argon2.hash_password(value.as_bytes(), &salt).unwrap().to_string()
}

fn verify_with_salt(value: &str, hash: &str) -> bool {
    let parsed_hash = PasswordHash::new(hash).unwrap();
    Argon2::default().verify_password(value.as_bytes(), &parsed_hash).is_ok()
}

pub async fn register(
    pool: web::Data<PgPool>,
    input: web::Json<RegisterInput>,
) -> impl Responder {
    let salt = generate_salt();
    let password_hash = hash_with_salt(&input.password, &salt);
    let res = sqlx::query(
        "INSERT INTO users (username, password_hash, password_salt) VALUES ($1, $2, $3)"
    )
    .bind(&input.username)
    .bind(&password_hash)
    .bind(&salt)
    .execute(pool.get_ref())
    .await;
    match res {
        Ok(_) => HttpResponse::Ok().body("User registered"),
        Err(e) => HttpResponse::BadRequest().body(format!("Registration error: {}", e)),
    }
}

pub async fn login(
    pool: web::Data<PgPool>,
    input: web::Json<LoginInput>,
) -> impl Responder {
    println!("LOGIN DEBUG: input username: {}", &input.username);
    println!("LOGIN DEBUG: input password: {}", &input.password);
    let user: Option<User> = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE username = $1"
    )
    .bind(&input.username)
    .fetch_optional(pool.get_ref())
    .await
    .ok()
    .flatten();
    println!("LOGIN DEBUG: user from db: {:?}", &user);
    if let Some(user) = user {
        let password_ok = verify_with_salt(&input.password, &user.password_hash);
        println!("LOGIN DEBUG: username={}, password={}, hash={}, password_ok={}", &input.username, &input.password, &user.password_hash, password_ok);
        if password_ok {
            let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "dev_secret".to_string());
            match create_jwt(user.id, &secret) {
                Ok(token) => return HttpResponse::Ok().json(serde_json::json!({
                    "token": token,
                    "user_id": user.id,
                    "username": user.username
                })),
                Err(_) => return HttpResponse::InternalServerError().body("JWT error"),
            }
        }
    }
    HttpResponse::Unauthorized().body("Invalid credentials")
}

pub async fn save_api_key(
    pool: web::Data<PgPool>,
    user_id: web::Path<i32>,
    input: web::Json<ApiKeyInput>,
) -> impl Responder {
    let res = sqlx::query(
        "UPDATE users SET api_key = $1 WHERE id = $2"
    )
    .bind(&input.api_key)
    .bind(*user_id)
    .execute(pool.get_ref())
    .await;
    match res {
        Ok(_) => HttpResponse::Ok().body("API key salvata"),
        Err(e) => HttpResponse::BadRequest().body(format!("API key error: {}", e)),
    }
}

pub async fn get_api_key(
    pool: web::Data<PgPool>,
    user_id: web::Path<i32>,
) -> impl Responder {
    let row = sqlx::query!("SELECT api_key FROM users WHERE id = $1", *user_id)
        .fetch_one(pool.get_ref())
        .await;
    match row {
        Ok(r) => HttpResponse::Ok().json(r.api_key),
        Err(_) => HttpResponse::NotFound().body("User not found"),
    }
}

pub async fn upload_profile_image(
    pool: web::Data<PgPool>,
    user_id: web::Path<i32>,
    mut payload: Multipart,
) -> impl Responder {
    let upload_dir = "uploads";
    fs::create_dir_all(upload_dir).ok();
    let mut file_path = None;
    while let Some(item) = payload.next().await {
        let mut field = match item {
            Ok(f) => f,
            Err(_) => return HttpResponse::BadRequest().body("Errore nel payload"),
        };
        let content_disposition = field.content_disposition();
        let filename = content_disposition
            .get_filename()
            .map(|f| f.to_string())
            .unwrap_or_else(|| format!("user_{}_profile.jpg", user_id));
        let filepath = format!("{}/{}", upload_dir, sanitize_filename::sanitize(&filename));
        let mut f = match fs::File::create(&filepath) {
            Ok(file) => file,
            Err(_) => return HttpResponse::InternalServerError().body("Errore salvataggio file"),
        };
        while let Some(chunk) = field.next().await {
            let data = match chunk {
                Ok(d) => d,
                Err(_) => return HttpResponse::InternalServerError().body("Errore lettura chunk"),
            };
            if f.write_all(&data).is_err() {
                return HttpResponse::InternalServerError().body("Errore scrittura file");
            }
        }
        file_path = Some(filepath.clone());
        // aggiorna il db
        let _ = sqlx::query("UPDATE users SET profile_image_path = $1 WHERE id = $2")
            .bind(&filepath)
            .bind(*user_id)
            .execute(pool.get_ref())
            .await;
    }
    if let Some(path) = file_path {
        HttpResponse::Ok().body(path)
    } else {
        HttpResponse::BadRequest().body("Nessun file caricato")
    }
}

pub async fn get_profile_image(
    pool: web::Data<PgPool>,
    user_id: web::Path<i32>,
    req: HttpRequest,
) -> impl Responder {
    let row = sqlx::query!("SELECT profile_image_path FROM users WHERE id = $1", *user_id)
        .fetch_one(pool.get_ref())
        .await;
    match row {
        Ok(r) => {
            if let Some(path) = r.profile_image_path {
                match actix_files::NamedFile::open_async(path).await {
                    Ok(file) => file.into_response(&req),
                    Err(_) => HttpResponse::NotFound().body("Immagine non trovata"),
                }
            } else {
                HttpResponse::NotFound().body("Nessuna immagine associata")
            }
        }
        Err(_) => HttpResponse::NotFound().body("Utente non trovato"),
    }
}
