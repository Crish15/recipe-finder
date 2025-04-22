use super::handlers::*;
use serde_json;
use actix_web::{test, web, App};
use sqlx::SqlitePool;

#[actix_web::test]
async fn test_recipe_input_deserialize() {
    let json = r#"{"name":"Pasta","data_json":{"foo":123}}"#;
    let parsed: super::models::RecipeInput = serde_json::from_str(json).unwrap();
    assert_eq!(parsed.name, "Pasta");
    assert_eq!(parsed.data_json["foo"], 123);
}

#[actix_web::test]
async fn test_recipe_serialize() {
    let recipe = super::models::Recipe {
        id: Some("1".to_string()),
        name: "Cake".to_string(),
        data_json: serde_json::json!({"bar": true}),
    };
    let s = serde_json::to_string(&recipe).unwrap();
    assert!(s.contains("Cake"));
    assert!(s.contains("bar"));
}

#[actix_web::test]
async fn test_save_recipe_handler() {
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
    sqlx::query("CREATE TABLE recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, data_json TEXT NOT NULL)")
        .execute(&pool)
        .await
        .unwrap();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/recipes/save", web::post().to(save_recipe))
    ).await;
    let payload = serde_json::json!({"name": "Cake", "data_json": {"bar": true}});
    let req = test::TestRequest::post()
        .uri("/recipes/save")
        .set_json(&payload)
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}

#[actix_web::test]
async fn test_search_recipe_handler() {
    let app = test::init_service(
        App::new().route("/recipes/search", web::post().to(search_recipe))
    ).await;
    let payload = serde_json::json!(["chicken"]);
    let req = test::TestRequest::post()
        .uri("/recipes/search")
        .set_json(&payload)
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    // Puoi aggiungere altre asserzioni sul body se vuoi
}
