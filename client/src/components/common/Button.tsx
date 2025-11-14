import type { ButtonProps as MuiButtonProps } from '@mui/material';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantConfig: Record<
  ButtonVariant,
  Pick<MuiButtonProps, 'color' | 'variant'>
> = {
  primary: { color: 'primary', variant: 'contained' },
  secondary: { color: 'primary', variant: 'outlined' },
  ghost: { color: 'inherit', variant: 'text' },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading, disabled, ...rest }, ref) => {
    const { color, variant: muiVariant } = variantConfig[variant];

    return (
      <MuiButton
        ref={ref}
        color={color}
        variant={muiVariant}
        disabled={disabled || isLoading}
        startIcon={
          isLoading ? <CircularProgress color="inherit" size={16} /> : undefined
        }
        {...rest}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;

