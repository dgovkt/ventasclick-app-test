import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'bordered';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
}) => {
  const baseClasses = 'rounded-xl p-6';

  const variantClasses = {
    default: 'bg-white shadow-lg',
    hover: 'bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer',
    bordered: 'bg-white border-2 border-gray-200 hover:border-primary transition-colors',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};
