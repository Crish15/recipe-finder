import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'default'
  rounded?: boolean
  className?: string
}

const colorClasses: Record<string, string> = {
  primary: 'bg-primary/10 text-primary border-primary/30',
  secondary: 'bg-secondary/10 text-secondary border-secondary/30',
  accent: 'bg-accent/10 text-accent border-accent/30',
  success: 'bg-success/10 text-success border-success/30',
  default: 'bg-neutral-100 text-neutral-700 border-neutral-300',
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  rounded = true,
  className = '',
  ...props
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 text-sm font-medium border ${rounded ? 'rounded-full' : 'rounded-md'} ${colorClasses[color]} ${className}`}
    {...props}
  >
    {children}
  </span>
)

export default Badge
