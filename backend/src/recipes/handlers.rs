use actix_web::{web, HttpResponse, Responder};
use sqlx::SqlitePool;
use crate::recipes::models::RecipeInput;
use crate::ingredients::models::{IngredientsInput, ComplexRecipeSearchInput};
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
    body: web::Json<ComplexRecipeSearchInput>,
    req: actix_web::HttpRequest,
) -> impl Responder {
    let ingredients = body.ingredients.join(",");
    let cuisine_param = body.cuisine.as_ref().map(|c| format!("&cuisine={}", c)).unwrap_or_default();
    let fill_ingredients = body.fill_ingredients.unwrap_or(false);
    let add_info = body.add_recipe_information.unwrap_or(false);
    let add_instr = body.add_recipe_instructions.unwrap_or(false);
    let instructions_required = body.instructions_required.unwrap_or(false);
    let api_key = env::var("SPOONACULAR_API_KEY").unwrap_or_else(|_| "YOUR_API_KEY_HERE".to_string());
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
