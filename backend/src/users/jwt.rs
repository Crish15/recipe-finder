use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32, // user id
    pub exp: usize,
}

pub fn create_jwt(user_id: i32, secret: &str) -> Result<String, jsonwebtoken::errors::Error> {
    use jsonwebtoken::{encode, Header, EncodingKey};
    use std::time::{SystemTime, UNIX_EPOCH};
    let expiration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as usize
        + 60 * 60 * 24 * 7; // 7 giorni
    let claims = Claims { sub: user_id, exp: expiration };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
}

pub async fn jwt_validator(
    req: actix_web::dev::ServiceRequest,
    credentials: actix_web_httpauth::extractors::bearer::BearerAuth,
) -> Result<actix_web::dev::ServiceRequest, (actix_web::Error, actix_web::dev::ServiceRequest)> {
    use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
    use std::env;
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "dev_secret".to_string());
    let token = credentials.token();
    let validation = Validation::new(Algorithm::HS256);
    let decoding_key = DecodingKey::from_secret(secret.as_bytes());
    match decode::<crate::users::jwt::Claims>(token, &decoding_key, &validation) {
        Ok(_) => Ok(req),
        Err(_) => Err((actix_web::error::ErrorUnauthorized("Invalid token"), req)),
    }
}

use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use actix_web::HttpRequest;

pub fn extract_user_id_from_jwt(req: &HttpRequest) -> Result<i32, String> {
    let header = req.headers().get("Authorization");
    let token = match header.and_then(|h| h.to_str().ok()) {
        Some(h) if h.starts_with("Bearer ") => h.trim_start_matches("Bearer ").to_string(),
        _ => return Err("Token mancante".to_string()),
    };
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev_secret".to_string());
    let validation = Validation::new(Algorithm::HS256);
    let decoding_key = DecodingKey::from_secret(secret.as_bytes());
    match decode::<Claims>(&token, &decoding_key, &validation) {
        Ok(token_data) => Ok(token_data.claims.sub),
        Err(_) => Err("Token non valido".to_string()),
    }
}
