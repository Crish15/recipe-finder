mod health;
mod db;
mod recipes;
mod ingredients;

use actix_web::{web, App, HttpServer};
use db::pool::init_db;
use recipes::handlers::{save_recipe, search_recipe};
use ingredients::handlers::add_ingredients;
use health::handlers::health;
use dotenv;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let pool = init_db().await;
    let host = env::var("BACKEND_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("BACKEND_PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(8080);
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/health", web::get().to(health))
            .route("/ingredients", web::post().to(add_ingredients))
            .route("/recipes/search", web::post().to(search_recipe))
            .route("/recipes/save", web::post().to(save_recipe))
    })
    .bind((host.as_str(), port))?
    .run()
    .await
}
