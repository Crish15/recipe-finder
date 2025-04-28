import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'

const ProfilePage: React.FC = () => {
  const { token, userId, logout } = useAuth()
  const [apiKey, setApiKey] = useState('')
  const [apiKeyStatus, setApiKeyStatus] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imageStatus, setImageStatus] = useState<string | null>(null)

  useEffect(() => {
    if (token && userId) {
      fetch(`/api/users/${userId}/api-key`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setApiKey(data || '')
        })
        .catch(() => {})
    }
  }, [token, userId])

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !userId) return setApiKeyStatus('Non autenticato')
    try {
      const res = await fetch(`/api/users/${userId}/api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ api_key: apiKey })
      })
      if (!res.ok) throw new Error('Errore salvataggio API key')
      setApiKeyStatus('API key salvata!')
    } catch (err) {
      setApiKeyStatus('Errore nel salvataggio')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) return setImageStatus('Nessun file selezionato')
    if (!token || !userId) return setImageStatus('Non autenticato')
    const formData = new FormData()
    formData.append('image', image)
    try {
      const res = await fetch(`/api/users/${userId}/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      if (!res.ok) throw new Error('Errore upload immagine')
      setImageStatus('Immagine caricata!')
    } catch (err) {
      setImageStatus('Errore nel caricamento')
    }
  }

  return (
    <Card className="w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <form onSubmit={handleImageUpload} className="mb-6 flex w-full gap-8 items-end">
        <div className='w-full'>
            <label className="block mb-2 font-semibold">Upload profile image</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
        </div>
        <Button type="submit" variant="primary" className='h-auto'>Upload</Button>
        {imageStatus && <div className="mt-2 text-sm">{imageStatus}</div>}
      </form>
      <form onSubmit={handleApiKeySubmit}  className="mb-6 flex w-full gap-8 items-end">
        <div className='flex-1'>
            <label className="block mb-2 font-semibold">API Key</label>
            <Input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full"
            placeholder="Enter your API key"
            />
        </div>
        <Button type="submit" variant="success" className="h-auto w-auto">Save API key</Button>
        {apiKeyStatus && <div className="mt-2 text-sm">{apiKeyStatus}</div>}
      </form>

      <Button
        onClick={logout}
        className="mt-6 w-full"
        variant="danger"
      >Logout</Button>
    </Card>
  )
}

export default ProfilePage
