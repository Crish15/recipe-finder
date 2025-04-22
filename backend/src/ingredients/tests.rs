use super::handlers::*;
use serde_json;
use actix_web::{test, web, App};
use sqlx::SqlitePool;

#[actix_web::test]
async fn test_ingredients_input_deserialize() {
    let json = r#"["egg", "milk"]"#;
    let parsed: super::models::IngredientsInput = serde_json::from_str(json).unwrap();
    assert_eq!(parsed.0, vec!["egg", "milk"]);
}

#[actix_web::test]
async fn test_add_ingredients_handler() {
    // Usa un database in-memory per i test
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
    sqlx::query("CREATE TABLE ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)")
        .execute(&pool)
        .await
        .unwrap();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/ingredients", web::post().to(add_ingredients))
    ).await;
    let payload = serde_json::json!(["egg", "milk"]);
    let req = test::TestRequest::post()
        .uri("/ingredients")
        .set_json(&payload)
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}
