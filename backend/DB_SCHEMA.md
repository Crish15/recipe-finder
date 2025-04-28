# Database Schema – Recipe Finder

The project uses a PostgreSQL database. Below are the main tables and their fields.

## users
- `id`: SERIAL PRIMARY KEY
- `username`: TEXT, unique
- `password_hash`: TEXT
- `password_salt`: TEXT
- `api_key`: TEXT (Spoonacular API key)
- `profile_image_path`: TEXT (path to uploaded profile image)

## ingredients
- `id`: SERIAL PRIMARY KEY
- `name`: TEXT, unique

## recipes
- `id`: SERIAL PRIMARY KEY
- `name`: TEXT
- `data_json`: TEXT (JSON data for the recipe)

## recipe_ingredients` (optional, for future extensions)
- `recipe_id`: INTEGER, references `recipes(id)`
- `ingredient_id`: INTEGER, references `ingredients(id)`
