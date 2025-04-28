import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useLogin } from './useLogin'

interface LoginPageProps {
  onLoginSuccess?: (token: string, userId: string) => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const { login, loading, error, register, registerLoading, registerError } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(username, password)
    if (result && onLoginSuccess) onLoginSuccess(result.token, String(result.userId))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(username, password, passwordRepeat, onLoginSuccess)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
      <form
        onSubmit={showRegister ? handleRegister : handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          {showRegister ? 'Registrazione' : 'Login'}
        </h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {showRegister && (
          <Input
            type="password"
            placeholder="Ripeti password"
            value={passwordRepeat}
            onChange={e => setPasswordRepeat(e.target.value)}
            required
          />
        )}
        {error && !showRegister && <div className="text-red-500 text-sm text-center">{error}</div>}
        {registerError && showRegister && <div className="text-red-500 text-sm text-center">{registerError}</div>}
        <Button
          type="submit"
          className="mt-2"
          variant="primary"
          disabled={loading || registerLoading}
        >
          {showRegister
            ? registerLoading
              ? 'Registrazione in corso...'
              : 'Registrati'
            : loading
            ? 'Accesso in corso...'
            : 'Accedi'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="mt-2"
          onClick={() => setShowRegister((v) => !v)}
          disabled={loading || registerLoading}
        >
          {showRegister ? 'Torna al login' : 'Registrati'}
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
