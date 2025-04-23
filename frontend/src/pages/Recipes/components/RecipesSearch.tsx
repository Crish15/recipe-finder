import React from 'react'
import Typeahead from '../../../components/Typeahead'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'

const SUGGESTED_INGREDIENTS = [
  { name: 'chicken', emoji: '🍗' },
  { name: 'tomato', emoji: '🍅' },
  { name: 'cheese', emoji: '🧀' },
  { name: 'lettuce', emoji: '🥬' },
  { name: 'beef', emoji: '🥩' },
  { name: 'egg', emoji: '🥚' },
  { name: 'onion', emoji: '🧅' },
  { name: 'garlic', emoji: '🧄' },
  { name: 'potato', emoji: '🥔' },
  { name: 'carrot', emoji: '🥕' },
  { name: 'basil', emoji: '🌿' },
  { name: 'rice', emoji: '🍚' },
  { name: 'pasta', emoji: '🍝' },
  { name: 'salmon', emoji: '🐟' },
  { name: 'mushroom', emoji: '🍄' },
]

interface RecipesSearchProps {
  ingredientInput: string
  setIngredientInput: (v: string) => void
  ingredients: string[]
  setIngredients: (v: string[]) => void
  onSearch: (e: React.FormEvent) => void
  loading: boolean
}

const RecipesSearch: React.FC<RecipesSearchProps> = ({
  ingredientInput,
  setIngredientInput,
  ingredients,
  setIngredients,
  onSearch,
  loading,
}) => {
  const handleIngredientInputChange = (val: string) => setIngredientInput(val)
  const handleIngredientSelect = (item: (typeof SUGGESTED_INGREDIENTS)[number] | string) => {
    const name = typeof item === 'string' ? item : item.name
    if (name && !ingredients.includes(name)) {
      setIngredients([...ingredients, name])
      setIngredientInput('')
    }
  }
  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing))
  }
  return (
    <form onSubmit={onSearch} className="flex flex-col gap-4 w-full max-w-md">
      <Typeahead
        suggestions={SUGGESTED_INGREDIENTS}
        value={ingredientInput}
        onInputChange={handleIngredientInputChange}
        onSelect={handleIngredientSelect}
        getLabel={(s) => s.name}
        getIcon={(s) => s.emoji}
        placeholder="Add ingredient (e.g. chicken)"
        allowCustom
      />
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => {
            const suggested = SUGGESTED_INGREDIENTS.find((s) => s.name === ing)
            return (
              <Badge key={ing} color="primary" className="gap-2">
                {suggested && <span className="text-lg">{suggested.emoji}</span>}
                {ing}
                <button
                  type="button"
                  onClick={() => removeIngredient(ing)}
                  className="ml-1 text-primary hover:text-red-500"
                >
                  &times;
                </button>
              </Badge>
            )
          })}
        </div>
      )}
      <Button type="submit" variant="primary" disabled={ingredients.length === 0 || loading}>
        {loading ? 'Searching...' : 'Search Recipes'}
      </Button>
    </form>
  )
}

export default RecipesSearch
