import React from 'react'
import { Recipe } from '../Recipes'

interface Ingredient {
  id: number
  name: string
  image: string
}

interface RecipeCardProps {
  recipe: Recipe
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
  <>
    <img src={recipe.image} alt={recipe.title} className="w-32 h-32 object-cover rounded-lg mb-2" />
    <div className="font-semibold text-center text-neutral-900 mb-2">{recipe.title}</div>
    {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {recipe.missedIngredients.map((ing: Ingredient) => (
          <div key={ing.id} className="flex flex-col items-center text-xs text-neutral-500">
            <img
              src={ing.image}
              alt={ing.name}
              className="w-6 h-6 rounded-full border border-neutral-200 mb-1"
            />
            <span>{ing.name}</span>
          </div>
        ))}
      </div>
    )}
  </>
)

export default RecipeCard
