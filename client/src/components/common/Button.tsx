import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
};

export const Button = ({
  children,
  variant = 'primary',
  className,
  isLoading,
  disabled,
  ...rest
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={clsx(
      'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2',
      variantClasses[variant],
      className,
    )}
    disabled={disabled || isLoading}
    {...rest}
  >
    {isLoading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    )}
    {children}
  </button>
);

export default Button;

