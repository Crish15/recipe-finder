import { useState } from 'react'
import { Recipe } from '../Recipes'

export function useRecipeSearch(ingredients: string[], cuisine: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalResults, setTotalResults] = useState<number | null>(null)

  const search = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (ingredients.length === 0) return
    setLoading(true)
    setError(null)
    setRecipes([])
    setPage(1)
    setHasMore(true)
    try {
      const res = await fetch(`/recipes/search?page=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          cuisine: cuisine || undefined,
          add_recipe_information: false,
          add_recipe_instructions: false,
          instructions_required: false,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setRecipes(data.results || [])
      setHasMore((data.results?.length || 0) === 10)
      setTotalResults(data.totalResults ?? null)
    } catch (err) {
      setError('Failed to fetch recipes.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!hasMore || loadingMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`/recipes/search?page=${nextPage}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          cuisine: cuisine || undefined,
          add_recipe_information: false,
          add_recipe_instructions: false,
          instructions_required: false,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setRecipes((prev) => [...prev, ...(data.results || [])])
      setPage(nextPage)
      setHasMore((data.results?.length || 0) === 10)
      setTotalResults(data.totalResults ?? totalResults)
    } catch (err) {
      setError('Failed to load more recipes.')
      console.error(err)
    } finally {
      setLoadingMore(false)
    }
  }

  return {
    recipes,
    loading,
    error,
    hasMore,
    totalResults,
    loadMore,
    loadingMore,
    search,
    setRecipes,
    setPage,
  }
}
