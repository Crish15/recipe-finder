use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct Recipe {
    pub id: Option<String>,
    pub name: String,
    pub data_json: Value,
}

#[derive(Deserialize)]
pub struct RecipeInput {
    pub name: String,
    pub data_json: Value,
}
