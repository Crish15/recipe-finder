import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'default' | 'glass' | 'warning' | 'danger'
  rounded?: boolean
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary/80 hover:bg-primary text-white border border-primary',
  secondary: 'bg-secondary/80 hover:bg-secondary text-white border border-secondary',
  accent: 'bg-accent/80 hover:bg-accent text-neutral-900 border border-accent',
  success: 'bg-success/80 hover:bg-success text-white border border-success',
  glass:
    'bg-white/80 hover:bg-primary/10 border border-primary text-primary shadow backdrop-blur-md',
  default: 'bg-white/40 hover:bg-white/60 text-neutral-900 border border-neutral-400',
  warning:
    'bg-warning/80 hover:bg-warning border border-warning text-yellow-900 px-4 py-2 min-w-0 w-auto',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border border-red-700',
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  rounded = false,
  ...props
}) => {
  const isDisabled = props.disabled
  return (
    <button
      className={`font-semibold ${rounded ? 'rounded-full' : 'rounded-xl'} transition cursor-pointer px-6 py-2 ${variantClasses[variant]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
