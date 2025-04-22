# Recipe Finder

Recipe Finder is a modern web application to find recipes based on available ingredients, inspired by Apple Human Interface Guidelines.

## Main Features
- Search recipes by ingredient using the Spoonacular API
- Horizontal carousel for recipe display with arrow navigation
- Visual feedback for missing ingredients in each recipe
- Responsive layout with sidebar, cuisine filters, and decorative pattern
- Backend in Rust (Actix Web), frontend in React + Tailwind CSS

## Project Structure
- `frontend/`: React app (Vite, TypeScript, Tailwind)
- `backend/`: Actix Web server (Rust) with Spoonacular integration

## Quick Start

### Prerequisites
- Node.js >= 18
- Rust + Cargo
- Spoonacular API key (https://spoonacular.com/food-api)

### Backend Setup
1. Copy `.env.example` to `.env` and add your Spoonacular key:
   ```
   SPOONACULAR_API_KEY=your_api_key
   ```
2. Start the backend:
   ```sh
   cd backend
   cargo run
   ```

### Frontend Setup
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```sh
   npm run dev
   ```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:8080` (backend).

## License
See [LICENSE](../LICENSE) for details.
