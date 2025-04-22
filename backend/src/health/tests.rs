use actix_web::{test, App};
use super::handlers::health;

#[actix_web::test]
async fn test_health_handler() {
    let app = test::init_service(
        App::new().route("/health", actix_web::web::get().to(health))
    ).await;
    let req = test::TestRequest::get().uri("/health").to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}
