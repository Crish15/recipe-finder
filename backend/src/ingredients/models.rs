use serde::Deserialize;

#[derive(Deserialize)]
pub struct ComplexRecipeSearchInput {
    pub ingredients: Vec<String>,
    pub cuisine: Option<String>,
    pub fill_ingredients: Option<bool>,
    pub add_recipe_information: Option<bool>,
    pub add_recipe_instructions: Option<bool>,
    pub instructions_required: Option<bool>,
}

#[derive(Deserialize)]
pub struct IngredientsInput(pub Vec<String>);
