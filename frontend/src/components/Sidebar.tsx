import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import Icon from './Icon'
import { Link, useLocation } from 'react-router-dom'

const icons = [
  { to: '/', icon: <Icon name="home" />, label: 'Home' },
  { to: '/recipes', icon: <Icon name="recipes" />, label: 'Recipes' },
  { to: '/ingredients', icon: <Icon name="ingredients" />, label: 'Ingredients' },
  { to: '/saved-recipes', icon: <Icon name="star" />, label: 'Saved' }
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { token, userId } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    if (token && userId) {
      fetch(`/api/users/${userId}/profile-image`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.blob() : null)
        .then(blob => {
          if (blob) {
            setProfileImage(URL.createObjectURL(blob))
          } else {
            setProfileImage(null)
          }
        })
        .catch(() => setProfileImage(null))
    } else {
      setProfileImage(null)
    }
  }, [token, userId])

  return (
    <nav
      className="flex sm:flex-col items-center justify-between h-20 w-full sm:w-20 sm:h-full bg-white/95 rounded-3xl shadow-xl border border-neutral-200 z-20 py-6 px-2"
    >
      {/* Logo sempre visibile */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md">
          <Icon name="logo" />
        </div>
      </div>
      {/* Pulsanti navigazione centrali (verticali su desktop) */}
      <div className="flex sm:flex-col items-center gap-4 flex-1 justify-center mt-6 mb-6">
        {icons.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow border border-primary/40 bg-primary/10 text-2xl transition
              ${pathname === to ? 'ring-2 ring-primary bg-primary/80 text-white' : 'hover:bg-primary/20 hover:text-primary'}`}
            title={label}
          >
            {icon}
          </Link>
        ))}
      </div>
      {/* Avatar */}
      <div className="flex flex-col items-center">
        {token ? (
          <Link to="/profile">
            <div className={`w-12 h-12 rounded-full bg-neutral-200 flex items-center cursor-pointer justify-center shadow-md relative group overflow-hidden ${pathname === '/profile' ? 'ring-2 ring-primary bg-primary/80' : ''}`}>
              {profileImage ? (
                <img src={profileImage} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <Icon name="user" size={32} className={pathname === '/profile' ? 'text-white' : ''} />
              )}
            </div>
          </Link>
        ) : (
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center shadow-md">
            <Icon name="user" size={32} />
          </div>
        )}
      </div>
    </nav>
  )
}
