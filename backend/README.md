# Recipe Finder – Backend

## Overview
The backend is built with **Rust** and **Actix Web**. It provides authentication, user management, recipe search, and integration with the Spoonacular API. Data is stored in PostgreSQL.

## Main Endpoints

- `POST /api/register` — Register a new user.
- `POST /api/login` — Authenticate a user and return a JWT.
- `POST /api/ingredients` — Add new ingredients.
- `POST /api/recipes/search` — Search for recipes by ingredients and cuisine (Spoonacular integration).
- `POST /api/recipes/save` — Save a recipe to the database.
- `GET /api/recipes/{id}` — Get detailed information about a recipe (from Spoonacular, requires authentication).
- `POST /api/users/{id}/api-key` — Save a user's Spoonacular API key.
- `GET /api/users/{id}/api-key` — Retrieve a user's Spoonacular API key.
- `POST /api/users/{id}/profile-image` — Upload a profile image.
- `GET /api/users/{id}/profile-image` — Retrieve a profile image.

## Authentication
Most endpoints require a Bearer JWT token. The token is validated and used to identify the user for personalized data and API key management.

## Running the Backend

1. Start the backend:
   ```sh
   cd backend
   cargo run
   ```
   The backend will be available at `http://localhost:8080`.

## Notes
- The backend expects a PostgreSQL database.
- For the database schema, see `schema.sql`.
- For the frontend, see the `../frontend` folder.
