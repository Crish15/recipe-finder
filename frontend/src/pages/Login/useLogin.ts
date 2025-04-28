import { useState } from 'react'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error('Credenziali non valide')
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user_id', data.user_id)
      if (data.username) {
        localStorage.setItem('username', data.username)
      }
      return { token: data.token, userId: data.user_id, username: data.username }
    } catch (err: any) {
      setError(err.message || 'Errore di login')
      return null
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, password: string, passwordRepeat: string, onLoginSuccess?: (token: string, userId: string) => void) => {
    setRegisterLoading(true)
    setRegisterError(null)
    if (password !== passwordRepeat) {
      setRegisterError('Le password non coincidono')
      setRegisterLoading(false)
      return
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error('Registrazione fallita')
      // Dopo la registrazione, effettua login automatico
      const loginResult = await login(username, password)
      if (loginResult && onLoginSuccess) onLoginSuccess(loginResult.token, String(loginResult.userId))
    } catch (err: any) {
      setRegisterError(err.message || 'Errore di registrazione')
    } finally {
      setRegisterLoading(false)
    }
  }

  return { login, loading, error, register, registerLoading, registerError }
}
