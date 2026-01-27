import React from 'react';
import { cn } from '../../lib/utils'; // Corrected path to ../../lib/utils

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
  const variants = {
    primary: 'bg-primary text-secondary hover:bg-primary-hover',
    secondary: 'bg-secondary text-primary hover:bg-secondary/90',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
