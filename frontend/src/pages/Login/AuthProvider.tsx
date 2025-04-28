import React, { useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user_id')
    if (t && u) {
      setToken(t)
      setUserId(u)
    }
  }, [])

  const setAuth = (token: string, userId: string) => {
    setToken(token)
    setUserId(userId)
    localStorage.setItem('token', token)
    localStorage.setItem('user_id', userId)
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
  }

  return (
    <AuthContext.Provider value={{ token, userId, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
