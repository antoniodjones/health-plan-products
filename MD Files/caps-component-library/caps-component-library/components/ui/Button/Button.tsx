/**
 * CAPS Design System - Button Component
 * 
 * A versatile button component supporting multiple variants, sizes, and states.
 * Follows CAPS design principles with proper accessibility and interaction feedback.
 * 
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Create Product
 * </Button>
 */

import React from 'react';
import './Button.css';

export interface ButtonProps {
  /**
   * Visual style variant
   * - primary: Main call-to-action (cyan background)
   * - secondary: Secondary actions (outlined)
   * - ghost: Tertiary actions (no border, minimal)
   * - text: Text-only button
   * - icon: Icon-only button (circular)
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'icon';
  
  /**
   * Button size
   * - small: 32px height
   * - medium: 40px height (default)
   * - large: 48px height
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Disabled state - prevents interaction and shows disabled styling
   */
  disabled?: boolean;
  
  /**
   * Loading state - shows spinner and prevents interaction
   */
  loading?: boolean;
  
  /**
   * Makes button take full width of container
   */
  fullWidth?: boolean;
  
  /**
   * Icon to display (pass React element)
   */
  icon?: React.ReactNode;
  
  /**
   * Icon position relative to text
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Button content (text)
   */
  children?: React.ReactNode;
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * HTML button type
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * Accessible label (required for icon-only buttons)
   */
  ariaLabel?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  onClick,
  type = 'button',
  ariaLabel,
  className = '',
}) => {
  // Build CSS classes
  const classes = [
    'caps-button',
    `caps-button--${variant}`,
    `caps-button--${size}`,
    fullWidth && 'caps-button--full-width',
    loading && 'caps-button--loading',
    disabled && 'caps-button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle click
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <span className="caps-button__spinner" aria-hidden="true">
      <svg className="caps-button__spinner-icon" viewBox="0 0 24 24">
        <circle
          className="caps-button__spinner-circle"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          strokeWidth="3"
        />
      </svg>
    </span>
  );

  // Icon-only button needs aria-label
  const isIconOnly = variant === 'icon' || (icon && !children);
  const buttonAriaLabel = isIconOnly ? ariaLabel : undefined;

  if (isIconOnly && !ariaLabel) {
    console.warn('Button: aria-label is required for icon-only buttons');
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={buttonAriaLabel}
      aria-busy={loading}
    >
      {loading && <LoadingSpinner />}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="caps-button__icon caps-button__icon--left">
          {icon}
        </span>
      )}
      
      {!loading && children && (
        <span className="caps-button__text">{children}</span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="caps-button__icon caps-button__icon--right">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
