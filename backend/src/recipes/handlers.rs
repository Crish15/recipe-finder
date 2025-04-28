use actix_web::{web, HttpResponse, Responder};
use sqlx::postgres::PgPool;
use crate::recipes::models::RecipeInput;
use crate::ingredients::models::ComplexRecipeSearchInput;
use crate::users::jwt::{Claims, extract_user_id_from_jwt};
use actix_web::HttpRequest;
use actix_web::web::Path;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use std::env;

pub async fn save_recipe(
    pool: web::Data<PgPool>,
    body: web::Json<RecipeInput>,
) -> impl Responder {
    let res = sqlx::query("INSERT INTO recipes (name, data_json) VALUES ($1, $2)")
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
    pool: web::Data<PgPool>,
    body: web::Json<ComplexRecipeSearchInput>,
    req: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id_from_jwt(&req) {
        Ok(id) => id,
        Err(msg) => return HttpResponse::Unauthorized().body(msg),
    };
    let row = sqlx::query!("SELECT api_key FROM users WHERE id = $1", user_id)
        .fetch_one(pool.get_ref())
        .await;
    let api_key = match row {
        Ok(r) => r.api_key.unwrap_or_default(),
        Err(_) => return HttpResponse::Unauthorized().body("API key mancante"),
    };
    let ingredients = body.ingredients.join(",");
    let cuisine_param = body.cuisine.as_ref().map(|c| format!("&cuisine={}", c)).unwrap_or_default();
    let fill_ingredients = body.fill_ingredients.unwrap_or(false);
    let add_info = body.add_recipe_information.unwrap_or(false);
    let add_instr = body.add_recipe_instructions.unwrap_or(false);
    let instructions_required = body.instructions_required.unwrap_or(false);
    let url = format!(
        "https://api.spoonacular.com/recipes/complexSearch?includeIngredients={}&number=10{}&addRecipeInformation={}&addRecipeInstructions={}&fillIngredients={}&instructionsRequired={}&apiKey={}",
        ingredients, cuisine_param, add_info, add_instr, fill_ingredients, instructions_required, api_key
    );
    let resp = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => {
            return HttpResponse::InternalServerError().body("External API call error");
        },
    };
    let json: serde_json::Value = match resp.json().await {
        Ok(j) => j,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error parsing API response");
        },
    };
    HttpResponse::Ok().json(json)
}

// Endpoint per ottenere i dettagli di una ricetta per ID
pub async fn get_recipe_details(
    pool: web::Data<PgPool>,
    path: Path<i32>,
    req: HttpRequest,
) -> impl Responder {
    let user_id = match extract_user_id_from_jwt(&req) {
        Ok(id) => id,
        Err(msg) => return HttpResponse::Unauthorized().body(msg),
    };
    let row = sqlx::query!("SELECT api_key FROM users WHERE id = $1", user_id)
        .fetch_one(pool.get_ref())
        .await;
    let api_key = match row {
        Ok(r) => r.api_key.unwrap_or_default(),
        Err(_) => return HttpResponse::Unauthorized().body("API key mancante"),
    };
    let recipe_id = path.into_inner();
    let url = format!(
        "https://api.spoonacular.com/recipes/{}/information?includeNutrition=false&apiKey={}",
        recipe_id, api_key
    );
    let resp = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => {
            return HttpResponse::InternalServerError().body("External API call error");
        },
    };
    let json: serde_json::Value = match resp.json().await {
        Ok(j) => j,
        Err(_) => {
            return HttpResponse::InternalServerError().body("Error parsing API response");
        },
    };
    HttpResponse::Ok().json(json)
}
