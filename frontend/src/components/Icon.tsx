import React from 'react'

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'spinner'
  | 'plus'
  | 'star'
  | 'home'
  | 'recipes'
  | 'ingredients'
  | 'user'
  | 'logo'
  | 'logout'

interface IconProps {
  name: IconName
  className?: string
  size?: number
}

const icons: Record<IconName, React.ReactNode> = {
  'arrow-left': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'arrow-right': (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  spinner: (
    <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  plus: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  star: <span>⭐</span>,
  home: <span>🏠</span>,
  recipes: <span>🍳</span>,
  ingredients: <span>🥚</span>,
  user: <span>👤</span>,
  logo: <img src="/vite.svg" alt="Logo" className="w-8 h-8" />,
  logout: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M16 17v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const Icon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => {
  const icon = icons[name]
  if (!icon) return null
  // Se SVG, aggiungi dimensioni e className
  if (
    React.isValidElement(icon) &&
    typeof icon.type === 'string' &&
    icon.type === 'svg'
  ) {
    return React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
      width: size,
      height: size,
      className: className
    })
  }
  // Emoji o altro
  return <span className={className} style={{ fontSize: size }}>{icon}</span>
}

export default Icon
