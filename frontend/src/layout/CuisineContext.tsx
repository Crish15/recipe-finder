import { createContext } from 'react'

export const CuisineContext = createContext<{
  cuisine: string
  setCuisine: (c: string) => void
}>({ cuisine: '', setCuisine: () => {} })
