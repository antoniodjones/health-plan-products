/**
 * CAPS Design System - Input Component
 * 
 * A form input component with label, validation states, helper text,
 * and optional adornments (icons, buttons, etc.).
 * 
 * @example
 * <Input
 *   label="Product Name"
 *   value={productName}
 *   onChange={(value) => setProductName(value)}
 *   required
 *   maxLength={100}
 *   helperText="Enter a unique name for this product"
 * />
 */

import React, { useState } from 'react';
import './Input.css';

export interface InputProps {
  /**
   * Input label (displayed above field)
   */
  label: string;
  
  /**
   * Current input value
   */
  value: string;
  
  /**
   * Change handler - receives new value
   */
  onChange: (value: string) => void;
  
  /**
   * Input type
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Helper text displayed below input (informational)
   */
  helperText?: string;
  
  /**
   * Error message (displays in error state)
   */
  errorText?: string;
  
  /**
   * Success message (displays in success state)
   */
  successText?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Required field indicator
   */
  required?: boolean;
  
  /**
   * Maximum character length
   */
  maxLength?: number;
  
  /**
   * Show character count (requires maxLength)
   */
  showCharacterCount?: boolean;
  
  /**
   * Icon or element at start of input
   */
  startAdornment?: React.ReactNode;
  
  /**
   * Icon or element at end of input
   */
  endAdornment?: React.ReactNode;
  
  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Input name attribute
   */
  name?: string;
  
  /**
   * Input ID (auto-generated if not provided)
   */
  id?: string;
  
  /**
   * Blur handler
   */
  onBlur?: () => void;
  
  /**
   * Focus handler
   */
  onFocus?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  helperText,
  errorText,
  successText,
  disabled = false,
  required = false,
  maxLength,
  showCharacterCount = false,
  startAdornment,
  endAdornment,
  size = 'medium',
  className = '',
  name,
  id,
  onBlur,
  onFocus,
}) => {
  // Generate ID if not provided
  const [inputId] = useState(
    id || `caps-input-${Math.random().toString(36).substr(2, 9)}`
  );
  
  // Track focus state for styling
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine current state
  const hasError = Boolean(errorText);
  const hasSuccess = Boolean(successText);
  const showCount = showCharacterCount && maxLength;
  
  // Build CSS classes
  const containerClasses = [
    'caps-input-container',
    className,
  ].filter(Boolean).join(' ');
  
  const inputWrapperClasses = [
    'caps-input-wrapper',
    `caps-input-wrapper--${size}`,
    isFocused && 'caps-input-wrapper--focused',
    hasError && 'caps-input-wrapper--error',
    hasSuccess && 'caps-input-wrapper--success',
    disabled && 'caps-input-wrapper--disabled',
    startAdornment && 'caps-input-wrapper--with-start',
    endAdornment && 'caps-input-wrapper--with-end',
  ].filter(Boolean).join(' ');
  
  // Handle change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Enforce maxLength if set
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    onChange(newValue);
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  // Character count
  const characterCount = value.length;
  const characterCountText = maxLength
    ? `${characterCount}/${maxLength}`
    : `${characterCount}`;
  
  // Helper text to display (error > success > helper)
  const displayHelperText = errorText || successText || helperText;
  const helperTextId = displayHelperText ? `${inputId}-helper` : undefined;
  
  return (
    <div className={containerClasses}>
      {/* Label */}
      <label htmlFor={inputId} className="caps-input-label">
        {label}
        {required && <span className="caps-input-label__required" aria-label="required">*</span>}
      </label>
      
      {/* Input Wrapper */}
      <div className={inputWrapperClasses}>
        {/* Start Adornment */}
        {startAdornment && (
          <span className="caps-input-adornment caps-input-adornment--start">
            {startAdornment}
          </span>
        )}
        
        {/* Input Element */}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={helperTextId}
          className="caps-input-field"
        />
        
        {/* End Adornment */}
        {endAdornment && (
          <span className="caps-input-adornment caps-input-adornment--end">
            {endAdornment}
          </span>
        )}
      </div>
      
      {/* Helper Text and Character Count Row */}
      <div className="caps-input-footer">
        {/* Helper Text */}
        {displayHelperText && (
          <span
            id={helperTextId}
            className={`caps-input-helper ${
              hasError
                ? 'caps-input-helper--error'
                : hasSuccess
                ? 'caps-input-helper--success'
                : ''
            }`}
          >
            {displayHelperText}
          </span>
        )}
        
        {/* Character Count */}
        {showCount && (
          <span className="caps-input-count" aria-live="polite">
            {characterCountText}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
