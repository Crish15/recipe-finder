import React, { useState, useContext, useRef } from 'react'
import Card from '../../components/Card'
import './recipes-carousel.css'
import SectionTitle from '../../components/SectionTitle'
import { CuisineContext } from '../../context/CuisineContext'
import RecipesSearch from './components/RecipesSearch'
import RecipesCarousel from './components/RecipesCarousel'
import { useRecipeSearch } from './hooks/useRecipeSearch'
import { CarouselRef } from '../../components/Carousel'
import RecipeCard from './components/RecipeCard'
import { useAuth } from '../../context/AuthContext'

const RecipeDetailsCard: React.FC<{ details: any; onClose: () => void }> = ({ details, onClose }) => (
  <div className="mt-8 p-6 rounded-xl border bg-white shadow-lg max-w-2xl mx-auto relative">
    <button onClick={onClose} className="absolute top-2 right-2 text-xl text-neutral-400 hover:text-red-500">&times;</button>
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <img src={details.image} alt={details.title} className="w-40 h-40 object-cover rounded-lg" />
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">{details.title}</h2>
        <div className="mb-2 text-neutral-600">Ready in {details.readyInMinutes} min · Servings: {details.servings}</div>
        <div className="mb-2"><span className="font-semibold">Summary:</span> <span dangerouslySetInnerHTML={{ __html: details.summary }} /></div>
        {details.extendedIngredients && (
          <div className="mb-2">
            <span className="font-semibold">Ingredients:</span>
            <ul className="list-disc ml-6">
              {details.extendedIngredients.map((ing: any) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
          </div>
        )}
        {details.instructions && (
          <div className="mb-2">
            <span className="font-semibold">Instructions:</span>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: details.instructions }} />
          </div>
        )}
      </div>
    </div>
  </div>
)

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

  const { token } = useAuth()
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  // Gestione click su una ricetta del carosello
  const handleRecipeClick = async (recipe: Recipe) => {
    setDetailsLoading(true)
    setDetailsError(null)
    setSelectedRecipe(null)
    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Errore caricamento dettagli ricetta')
      const data = await res.json()
      setSelectedRecipe(data)
    } catch (err) {
      setDetailsError('Errore nel caricamento dei dettagli')
    } finally {
      setDetailsLoading(false)
    }
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
          onRecipeClick={handleRecipeClick}
        />
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center text-neutral-400 mt-8">
            No recipes found. Try searching for an ingredient!
          </div>
        )}
        {error && <div className="text-center text-red-500 mt-8">{error}</div>}
        {detailsLoading && <div className="text-center text-primary mt-8">Loading recipe details...</div>}
        {detailsError && <div className="text-center text-red-500 mt-8">{detailsError}</div>}
        {selectedRecipe && (
          <RecipeDetailsCard details={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </div>
    </Card>
  )
}

export default Recipes
