/**
 * CAPS Design System - Card Component
 * 
 * A versatile card container for grouping related content.
 * Supports headers, footers, actions, and various layouts.
 * 
 * @example
 * // Basic card
 * <Card>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * @example
 * // Card with header and footer
 * <Card
 *   header="Product Details"
 *   footer={<Button>Edit Product</Button>}
 * >
 *   <p>Product information...</p>
 * </Card>
 * 
 * @example
 * // Metric card
 * <Card variant="metric" elevated>
 *   <CardMetric value="1,234" label="Total Members" trend="+12%" />
 * </Card>
 */

import React from 'react';
import './Card.css';

export interface CardProps {
  /**
   * Card variant
   * - default: Standard card with border
   * - elevated: Card with shadow
   * - outlined: Card with border only (no background)
   * - metric: Specialized card for displaying metrics
   */
  variant?: 'default' | 'elevated' | 'outlined' | 'metric';
  
  /**
   * Header content (string or React node)
   */
  header?: React.ReactNode;
  
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Main card content
   */
  children: React.ReactNode;
  
  /**
   * Apply hover effect (useful for clickable cards)
   */
  hoverable?: boolean;
  
  /**
   * Make entire card clickable
   */
  onClick?: () => void;
  
  /**
   * Additional padding
   * - compact: Reduced padding
   * - normal: Default padding
   * - spacious: Increased padding
   */
  padding?: 'compact' | 'normal' | 'spacious';
  
  /**
   * Apply elevated shadow (only for default variant)
   */
  elevated?: boolean;
  
  /**
   * Additional CSS class
   */
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  header,
  footer,
  children,
  hoverable = false,
  onClick,
  padding = 'normal',
  elevated = false,
  className = '',
}) => {
  // Build CSS classes
  const classes = [
    'caps-card',
    `caps-card--${variant}`,
    `caps-card--padding-${padding}`,
    elevated && 'caps-card--elevated',
    (hoverable || onClick) && 'caps-card--hoverable',
    onClick && 'caps-card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine if we should use semantic elements
  const Component = onClick ? 'button' : 'div';
  const componentProps = onClick
    ? {
        onClick,
        type: 'button' as const,
        role: 'button',
      }
    : {};

  return (
    <Component className={classes} {...componentProps}>
      {/* Header */}
      {header && (
        <div className="caps-card__header">
          {typeof header === 'string' ? (
            <h3 className="caps-card__title">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      {/* Body */}
      <div className="caps-card__body">{children}</div>

      {/* Footer */}
      {footer && <div className="caps-card__footer">{footer}</div>}
    </Component>
  );
};

/* ============================================
   CARD METRIC SUB-COMPONENT
   Specialized component for displaying metrics
   ============================================ */

export interface CardMetricProps {
  /**
   * Main metric value
   */
  value: string | number;
  
  /**
   * Metric label/description
   */
  label: string;
  
  /**
   * Trend indicator (e.g., "+12%", "-5%")
   */
  trend?: string;
  
  /**
   * Trend direction for styling
   */
  trendDirection?: 'up' | 'down' | 'neutral';
  
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Additional helper text
   */
  helperText?: string;
}

export const CardMetric: React.FC<CardMetricProps> = ({
  value,
  label,
  trend,
  trendDirection = 'neutral',
  icon,
  helperText,
}) => {
  // Auto-detect trend direction if not provided
  let detectedDirection = trendDirection;
  if (trend && trendDirection === 'neutral') {
    if (trend.startsWith('+')) {
      detectedDirection = 'up';
    } else if (trend.startsWith('-')) {
      detectedDirection = 'down';
    }
  }

  return (
    <div className="caps-card-metric">
      {icon && <div className="caps-card-metric__icon">{icon}</div>}
      
      <div className="caps-card-metric__content">
        <div className="caps-card-metric__value">{value}</div>
        
        <div className="caps-card-metric__label-row">
          <span className="caps-card-metric__label">{label}</span>
          
          {trend && (
            <span
              className={`caps-card-metric__trend caps-card-metric__trend--${detectedDirection}`}
            >
              {trend}
            </span>
          )}
        </div>
        
        {helperText && (
          <div className="caps-card-metric__helper">{helperText}</div>
        )}
      </div>
    </div>
  );
};

export default Card;
