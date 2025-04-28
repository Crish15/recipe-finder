import { createContext, useContext } from 'react'

interface AuthContextType {
  token: string | null
  userId: string | null
  setAuth: (token: string, userId: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider')
  return ctx
}
