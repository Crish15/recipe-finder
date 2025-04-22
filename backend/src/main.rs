mod health;
mod db;
mod recipes;
mod ingredients;

use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use db::pool::init_db;
use recipes::handlers::{save_recipe, search_recipe};
use ingredients::handlers::add_ingredients;
use health::handlers::health;
use dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let pool = init_db().await;
    HttpServer::new(move || {
        let cors = Cors::permissive(); // Permissivo per sviluppo, restringi in produzione!
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(pool.clone()))
            .route("/health", web::get().to(health))
            .route("/ingredients", web::post().to(add_ingredients))
            .route("/recipes/search", web::post().to(search_recipe))
            .route("/recipes/save", web::post().to(save_recipe))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
