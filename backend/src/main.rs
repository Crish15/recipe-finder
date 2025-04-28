mod health;
mod db;
mod recipes;
mod ingredients;
mod users;

use actix_web::{web, App, HttpServer};
use db::pool::init_db;
use recipes::handlers::{save_recipe, search_recipe};
use ingredients::handlers::add_ingredients;
use health::handlers::health;
use users::handlers::{register, login, save_api_key, get_api_key, upload_profile_image, get_profile_image};
use actix_web_httpauth::middleware::HttpAuthentication;
use users::jwt::jwt_validator;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let pool = init_db().await;
    let host = env::var("BACKEND_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("BACKEND_PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(8080);
    HttpServer::new(move || {
        let auth = HttpAuthentication::bearer(jwt_validator);
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(actix_cors::Cors::permissive())
            .route("/health", web::get().to(health))
            .service(
                web::scope("/api")
                    .route("/register", web::post().to(register))
                    .route("/login", web::post().to(login))
                    .service(
                        web::scope("")
                            .wrap(auth)
                            .route("/ingredients", web::post().to(add_ingredients))
                            .route("/recipes/search", web::post().to(search_recipe))
                            .route("/recipes/save", web::post().to(save_recipe))
                            .route("/recipes/{id}", web::get().to(recipes::handlers::get_recipe_details))
                            .service(
                                web::scope("/users/{id}")
                                    .route("/api-key", web::post().to(save_api_key))
                                    .route("/api-key", web::get().to(get_api_key))
                                    .route("/profile-image", web::post().to(upload_profile_image))
                                    .route("/profile-image", web::get().to(get_profile_image))
                            )
                    )
            )
    })
    .bind((host.as_str(), port))?
    .run()
    .await
}

