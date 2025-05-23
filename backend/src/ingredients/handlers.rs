use actix_web::{web, HttpResponse, Responder};
use sqlx::postgres::PgPool;
use crate::ingredients::models::IngredientsInput;
use serde_json::json;

pub async fn add_ingredients(
    pool: web::Data<PgPool>,
    body: web::Json<IngredientsInput>,
) -> impl Responder {
    let mut inserted = vec![];
    let mut failed = vec![];
    for name in &body.0.0 {
        let res = sqlx::query("INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO NOTHING")
            .bind(name)
            .execute(pool.get_ref())
            .await;
        match res {
            Ok(_) => inserted.push(name.clone()),
            Err(_) => failed.push(name.clone()),
        }
    }
    HttpResponse::Ok().json(json!({"inserted": inserted, "failed": failed}))
}
