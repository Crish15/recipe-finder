# Recipe Finder – Frontend

This is the frontend application for Recipe Finder, built with **React**, **TypeScript**, and **Vite**, styled using **Tailwind CSS**.

## Main Features

- Search for recipes by ingredients using the Spoonacular API
- Horizontal carousel for browsing recipes
- Click a recipe to view detailed information in a card below the carousel
- Cuisine filters and responsive layout
- Sidebar navigation and decorative patterns
- User authentication and profile management (API key, profile image)

## Project Structure

- `src/components/`: Reusable UI components (Button, Input, Carousel, etc.)
- `src/layout/`: Layout and global contexts (e.g., `CuisineContext`)
- `src/pages/`: Main app pages (Home, Recipes, Ingredients, Profile, etc.)

## Quick Start

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the frontend:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Notes
- The frontend expects the backend to be running at `http://localhost:8080`.
- The logo features a fork and spoon crossed on a plate.
- For the backend, see the `../backend` folder.
