use sqlx::postgres::PgPool;

pub async fn init_db() -> PgPool {
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgPool::connect(&db_url)
        .await
        .expect("Failed to connect to Postgres database")
}
