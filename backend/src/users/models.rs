use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password_hash: String,
    pub password_salt: String,
    pub api_key: Option<String>,
    pub profile_image_path: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RegisterInput {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginInput {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct ApiKeyInput {
    pub api_key: String,
}
