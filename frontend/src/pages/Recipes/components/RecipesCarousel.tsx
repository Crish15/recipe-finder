import React from 'react'
import createCarousel, { CarouselRef } from '../../../components/Carousel'
import RecipeCard from './RecipeCard'
import { Recipe } from '../Recipes'

const Carousel = createCarousel<Recipe>()

interface RecipesCarouselProps {
  recipes: Recipe[]
  hasMore: boolean
  loadMore: () => void
  loadingMore: boolean
  totalResults: number | null
  onRecipeClick?: (recipe: Recipe) => void
}

const RecipesCarousel = React.forwardRef<CarouselRef, RecipesCarouselProps>(
  function RecipesCarousel({ recipes, hasMore, loadMore, loadingMore, totalResults, onRecipeClick }, ref) {
    // Leggi l'indice attuale tramite ref
    const [currentIndex, setCurrentIndex] = React.useState(0)
    React.useEffect(() => {
      if (
        ref &&
        typeof ref !== 'function' &&
        ref?.current &&
        typeof ref.current.currentIndex === 'number'
      ) {
        setCurrentIndex(ref.current.currentIndex)
      }
    }, [recipes, ref])
    return (
      <Carousel
        ref={ref}
        items={recipes}
        renderItem={(recipe) => (
          <div onClick={() => onRecipeClick && onRecipeClick(recipe)} className="cursor-pointer">
            <RecipeCard recipe={recipe} />
          </div>
        )}
        onLoadMore={hasMore ? loadMore : undefined}
        loadingMore={loadingMore}
        onIndexChange={setCurrentIndex}
        bottomLeftSlot={
          recipes.length > 0 ? (
            <span className="text-xs text-neutral-500 bg-white/80 rounded px-3 py-1 border border-primary/10 shadow">
              {currentIndex + 1} di {recipes.length}
              {totalResults ? ` (su ${totalResults} ricette)` : ' Ricette'}
            </span>
          ) : null
        }
      />
    )
  }
)

export default RecipesCarousel
