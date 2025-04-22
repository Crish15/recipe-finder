use sqlx::sqlite::SqlitePool;

pub async fn init_db() -> SqlitePool {
    let db_url = "sqlite:recipe.db";
    SqlitePool::connect(db_url)
        .await
        .expect("Impossibile connettersi al DB")
}
