use serde::Deserialize;

#[derive(Deserialize)]
pub struct IngredientsInput(pub Vec<String>);
