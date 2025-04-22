import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'default' | 'glass';
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary/80 hover:bg-primary text-white',
  secondary: 'bg-secondary/80 hover:bg-secondary text-white',
  accent: 'bg-accent/80 hover:bg-accent text-neutral-900',
  success: 'bg-success/80 hover:bg-success text-white',
  glass: 'bg-white/80 hover:bg-white/90 border border-primary/30 text-primary shadow backdrop-blur-md',
  default: 'bg-white/40 hover:bg-white/60 text-neutral-900',
};

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => (
  <button
    className={`font-semibold rounded-xl transition cursor-pointer px-6 py-2 ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
