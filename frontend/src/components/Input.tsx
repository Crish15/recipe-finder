import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`rounded-xl border border-neutral-300 px-4 py-2 text-lg bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${className}`}
      {...props}
    />
  )
)

export default Input
