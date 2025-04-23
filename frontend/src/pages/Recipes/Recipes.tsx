import React, { useState, useContext, useRef } from 'react'
import Card from '../../components/Card'
import './recipes-carousel.css'
import SectionTitle from '../../components/SectionTitle'
import { CuisineContext } from '../../layout/CuisineContext'
import RecipesSearch from './components/RecipesSearch'
import RecipesCarousel from './components/RecipesCarousel'
import { useRecipeSearch } from './hooks/useRecipeSearch'
import { CarouselRef } from '../../components/Carousel'

export interface Ingredient {
  aisle: string
  amount: number
  id: number
  image: string
  meta: string[]
  name: string
  original: string
  originalName: string
  unit: string
  unitLong: string
  unitShort: string
  extendedName?: string
}

export interface Recipe {
  id: number
  image: string
  imageType: string
  likes: number
  missedIngredientCount: number
  missedIngredients: Ingredient[]
  title: string
  unusedIngredients: Ingredient[]
  usedIngredientCount: number
  usedIngredients: Ingredient[]
  analyzedInstructions?: { steps: { number: number; step: string }[] }[]
}

const Recipes: React.FC = () => {
  const [ingredientInput, setIngredientInput] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const { cuisine } = useContext(CuisineContext)
  const carouselRef = useRef<CarouselRef>(null)

  const { recipes, loading, error, hasMore, totalResults, loadMore, loadingMore, search } =
    useRecipeSearch(ingredients, cuisine || undefined)

  // Funzione per gestire la ricerca e il reset del carosello
  const handleSearchAndReset = (e: React.FormEvent) => {
    if (carouselRef.current && typeof carouselRef.current.resetIndex === 'function') {
      carouselRef.current.resetIndex()
    }
    search(e)
  }

  return (
    <Card className="flex flex-col md:flex-row gap-8 items-start w-full">
      <div className="flex-1 min-w-0">
        <SectionTitle>Find a Recipe by Ingredient</SectionTitle>
        <RecipesSearch
          ingredientInput={ingredientInput}
          setIngredientInput={setIngredientInput}
          ingredients={ingredients}
          setIngredients={setIngredients}
          onSearch={handleSearchAndReset}
          loading={loading}
        />
      </div>
      <div className="hidden md:block h-full w-px bg-neutral-200 mx-2" />
      <div className="flex-1 min-w-0">
        <RecipesCarousel
          ref={carouselRef}
          recipes={recipes}
          hasMore={hasMore}
          loadMore={loadMore}
          loadingMore={loadingMore}
          totalResults={totalResults}
        />
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center text-neutral-400 mt-8">
            No recipes found. Try searching for an ingredient!
          </div>
        )}
        {error && <div className="text-center text-red-500 mt-8">{error}</div>}
      </div>
    </Card>
  )
}

export default Recipes
