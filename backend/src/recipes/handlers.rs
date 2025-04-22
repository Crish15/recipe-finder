use actix_web::{web, HttpResponse, Responder};
use sqlx::SqlitePool;
use crate::recipes::models::RecipeInput;
use crate::ingredients::models::IngredientsInput;
use std::env;

pub async fn save_recipe(
    pool: web::Data<SqlitePool>,
    body: web::Json<RecipeInput>,
) -> impl Responder {
    let res = sqlx::query("INSERT INTO recipes (name, data_json) VALUES (?, ?)")
        .bind(&body.name)
        .bind(body.data_json.to_string())
        .execute(pool.get_ref())
        .await;
    match res {
        Ok(_) => HttpResponse::Ok().body("Recipe saved"),
        Err(e) => HttpResponse::InternalServerError().body(format!("Save error: {}", e)),
    }
}

pub async fn search_recipe(
    body: web::Json<IngredientsInput>,
) -> impl Responder {
    let ingredients = body.0.0.join(",");
    let api_key = env::var("SPOONACULAR_API_KEY").unwrap_or_else(|_| "YOUR_API_KEY_HERE".to_string());
    let url = format!(
        "https://api.spoonacular.com/recipes/findByIngredients?ingredients={}&number=10&apiKey={}",
        ingredients, api_key
    );
    let resp = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => return HttpResponse::InternalServerError().body("External API call error"),
    };
    let json: serde_json::Value = match resp.json().await {
        Ok(j) => j,
        Err(_) => return HttpResponse::InternalServerError().body("Error parsing API response"),
    };
    HttpResponse::Ok().json(json)
}
