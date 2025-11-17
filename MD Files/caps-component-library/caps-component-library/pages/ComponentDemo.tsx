/**
 * CAPS Design System - Component Demo Page
 * 
 * This page demonstrates all UI components in various states.
 * Use this to test components and ensure they match design specifications.
 */

import React, { useState } from 'react';
import { Button, Input, Card, CardMetric } from '../components/ui';
import '../styles/tokens.css';
import './ComponentDemo.css';

// Simple icon components for demo
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export const ComponentDemo: React.FC = () => {
  // State for interactive demos
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1 className="demo-title">CAPS Design System</h1>
        <p className="demo-subtitle">Component Library Showcase</p>
      </div>

      {/* ============================================
          BUTTONS SECTION
          ============================================ */}
      <section className="demo-section">
        <h2 className="demo-section-title">Buttons</h2>
        
        {/* Primary Buttons */}
        <div className="demo-group">
          <h3 className="demo-group-title">Primary Buttons</h3>
          <div className="demo-row">
            <Button variant="primary" size="small">
              Small Primary
            </Button>
            <Button variant="primary" size="medium">
              Medium Primary
            </Button>
            <Button variant="primary" size="large">
              Large Primary
            </Button>
          </div>
        </div>

        {/* Secondary Buttons */}
        <div className="demo-group">
          <h3 className="demo-group-title">Secondary Buttons</h3>
          <div className="demo-row">
            <Button variant="secondary" size="small">
              Small Secondary
            </Button>
            <Button variant="secondary" size="medium">
              Medium Secondary
            </Button>
            <Button variant="secondary" size="large">
              Large Secondary
            </Button>
          </div>
        </div>

        {/* Ghost and Text Buttons */}
        <div className="demo-group">
          <h3 className="demo-group-title">Ghost & Text Buttons</h3>
          <div className="demo-row">
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="text">Text Button</Button>
          </div>
        </div>

        {/* Buttons with Icons */}
        <div className="demo-group">
          <h3 className="demo-group-title">Buttons with Icons</h3>
          <div className="demo-row">
            <Button variant="primary" icon={<PlusIcon />} iconPosition="left">
              Add Product
            </Button>
            <Button variant="secondary" icon={<SearchIcon />} iconPosition="left">
              Search
            </Button>
            <Button variant="icon" ariaLabel="Add item">
              <PlusIcon />
            </Button>
            <Button variant="icon" ariaLabel="Search">
              <SearchIcon />
            </Button>
          </div>
        </div>

        {/* Button States */}
        <div className="demo-group">
          <h3 className="demo-group-title">Button States</h3>
          <div className="demo-row">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="primary" loading={isLoading} onClick={handleLoadingDemo}>
              {isLoading ? 'Loading...' : 'Click to Load'}
            </Button>
          </div>
        </div>

        {/* Full Width */}
        <div className="demo-group">
          <h3 className="demo-group-title">Full Width Button</h3>
          <Button variant="primary" fullWidth>
            Full Width Button
          </Button>
        </div>
      </section>

      {/* ============================================
          INPUTS SECTION
          ============================================ */}
      <section className="demo-section">
        <h2 className="demo-section-title">Inputs</h2>

        {/* Basic Inputs */}
        <div className="demo-group">
          <h3 className="demo-group-title">Basic Inputs</h3>
          <div className="demo-column">
            <Input
              label="Product Name"
              value={inputValue}
              onChange={setInputValue}
              placeholder="Enter product name"
              helperText="This will be displayed to members"
            />
            
            <Input
              label="Email Address"
              type="email"
              value={emailValue}
              onChange={setEmailValue}
              placeholder="user@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={passwordValue}
              onChange={setPasswordValue}
              placeholder="Enter password"
              helperText="Must be at least 8 characters"
              required
            />
          </div>
        </div>

        {/* Input Sizes */}
        <div className="demo-group">
          <h3 className="demo-group-title">Input Sizes</h3>
          <div className="demo-column">
            <Input
              label="Small Input"
              value=""
              onChange={() => {}}
              size="small"
              placeholder="Small size"
            />
            <Input
              label="Medium Input (Default)"
              value=""
              onChange={() => {}}
              size="medium"
              placeholder="Medium size"
            />
            <Input
              label="Large Input"
              value=""
              onChange={() => {}}
              size="large"
              placeholder="Large size"
            />
          </div>
        </div>

        {/* Input States */}
        <div className="demo-group">
          <h3 className="demo-group-title">Input States</h3>
          <div className="demo-column">
            <Input
              label="Success State"
              value="Valid input"
              onChange={() => {}}
              successText="This looks good!"
            />
            
            <Input
              label="Error State"
              value="Invalid"
              onChange={() => {}}
              errorText="This field is required"
            />
            
            <Input
              label="Disabled Input"
              value="Cannot edit"
              onChange={() => {}}
              disabled
            />
          </div>
        </div>

        {/* Input with Adornments */}
        <div className="demo-group">
          <h3 className="demo-group-title">Input with Adornments</h3>
          <div className="demo-column">
            <Input
              label="Search Products"
              value=""
              onChange={() => {}}
              placeholder="Type to search..."
              startAdornment={<SearchIcon />}
            />
          </div>
        </div>

        {/* Character Count */}
        <div className="demo-group">
          <h3 className="demo-group-title">Character Limit</h3>
          <div className="demo-column">
            <Input
              label="Product Description"
              value={inputValue}
              onChange={setInputValue}
              placeholder="Enter description"
              maxLength={100}
              showCharacterCount
              helperText="Keep it concise"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          CARDS SECTION
          ============================================ */}
      <section className="demo-section">
        <h2 className="demo-section-title">Cards</h2>

        {/* Basic Cards */}
        <div className="demo-group">
          <h3 className="demo-group-title">Card Variants</h3>
          <div className="demo-grid">
            <Card variant="default">
              <h4>Default Card</h4>
              <p>This is a default card with border and background.</p>
            </Card>

            <Card variant="elevated">
              <h4>Elevated Card</h4>
              <p>This card has a shadow but no border.</p>
            </Card>

            <Card variant="outlined">
              <h4>Outlined Card</h4>
              <p>This card has a border but transparent background.</p>
            </Card>
          </div>
        </div>

        {/* Card with Header and Footer */}
        <div className="demo-group">
          <h3 className="demo-group-title">Card with Header & Footer</h3>
          <Card
            header="Product Details"
            footer={
              <>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </>
            }
          >
            <p><strong>Product ID:</strong> PROD-001</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Created:</strong> November 15, 2025</p>
          </Card>
        </div>

        {/* Metric Cards */}
        <div className="demo-group">
          <h3 className="demo-group-title">Metric Cards</h3>
          <div className="demo-grid">
            <Card variant="metric" elevated>
              <CardMetric
                icon={<UsersIcon />}
                value="12,345"
                label="Total Members"
                trend="+12.5%"
                trendDirection="up"
                helperText="vs. last month"
              />
            </Card>

            <Card variant="metric" elevated>
              <CardMetric
                icon={<DollarIcon />}
                value="$2.4M"
                label="Monthly Revenue"
                trend="+8.3%"
                trendDirection="up"
                helperText="vs. last month"
              />
            </Card>

            <Card variant="metric" elevated>
              <CardMetric
                value="96.2%"
                label="Member Satisfaction"
                trend="-1.2%"
                trendDirection="down"
                helperText="vs. last quarter"
              />
            </Card>
          </div>
        </div>

        {/* Hoverable Card */}
        <div className="demo-group">
          <h3 className="demo-group-title">Interactive Cards</h3>
          <div className="demo-grid">
            <Card variant="default" hoverable>
              <h4>Hoverable Card</h4>
              <p>Hover over this card to see the effect.</p>
            </Card>

            <Card
              variant="default"
              onClick={() => alert('Card clicked!')}
            >
              <h4>Clickable Card</h4>
              <p>Click this card to trigger an action.</p>
            </Card>
          </div>
        </div>

        {/* Padding Variants */}
        <div className="demo-group">
          <h3 className="demo-group-title">Padding Variants</h3>
          <div className="demo-grid">
            <Card padding="compact">
              <h4>Compact Padding</h4>
              <p>Less space inside the card.</p>
            </Card>

            <Card padding="normal">
              <h4>Normal Padding</h4>
              <p>Default spacing.</p>
            </Card>

            <Card padding="spacious">
              <h4>Spacious Padding</h4>
              <p>More space inside the card.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Design Tokens Reference */}
      <section className="demo-section">
        <h2 className="demo-section-title">Design Tokens</h2>
        <Card>
          <h3>Color Palette</h3>
          <div className="color-grid">
            <div className="color-swatch" style={{ backgroundColor: '#00BCD4' }}>
              <span className="color-label">Primary (Cyan)</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#E91E63' }}>
              <span className="color-label">Accent (Magenta)</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#4CAF50' }}>
              <span className="color-label">Success (Green)</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#F44336' }}>
              <span className="color-label">Error (Red)</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#FF9800' }}>
              <span className="color-label">Warning (Orange)</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default ComponentDemo;
