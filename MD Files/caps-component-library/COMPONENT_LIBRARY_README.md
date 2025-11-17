# CAPS Component Library

## 🎯 Overview

This is the foundation of the CAPS Design System component library. Three core components have been built following your design specifications:

- **Button** - Primary, secondary, ghost, text, and icon variants
- **Input** - Form inputs with validation, labels, and adornments  
- **Card** - Content containers with headers, footers, and metric displays

All components use your design tokens and follow the CAPS design principles.

## 📁 File Structure

```
src/
├── styles/
│   └── tokens.css                    # Design tokens (colors, spacing, typography)
├── components/
│   └── ui/
│       ├── Button/
│       │   ├── Button.tsx            # Button component
│       │   └── Button.css            # Button styles
│       ├── Input/
│       │   ├── Input.tsx             # Input component
│       │   └── Input.css             # Input styles
│       ├── Card/
│       │   ├── Card.tsx              # Card + CardMetric components
│       │   └── Card.css              # Card styles
│       └── index.ts                  # Component exports
└── pages/
    ├── ComponentDemo.tsx             # Demo page showcasing components
    └── ComponentDemo.css             # Demo page styles
```

## 🚀 Quick Start

### 1. Import Components

```typescript
import { Button, Input, Card, CardMetric } from './components/ui';
```

### 2. Use Components

```tsx
// Button
<Button variant="primary" onClick={handleClick}>
  Create Product
</Button>

// Input
<Input
  label="Product Name"
  value={productName}
  onChange={setProductName}
  required
/>

// Card
<Card header="Product Details">
  <p>Content goes here</p>
</Card>

// Metric Card
<Card variant="metric" elevated>
  <CardMetric
    value="12,345"
    label="Total Members"
    trend="+12%"
    icon={<UsersIcon />}
  />
</Card>
```

## 📘 Component API Reference

### Button Component

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'ghost' \| 'text' \| 'icon'` | `'primary'` | Visual style variant |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| disabled | `boolean` | `false` | Disabled state |
| loading | `boolean` | `false` | Loading state with spinner |
| fullWidth | `boolean` | `false` | Take full width of container |
| icon | `ReactNode` | - | Icon to display |
| iconPosition | `'left' \| 'right'` | `'left'` | Icon position |
| onClick | `(event) => void` | - | Click handler |
| ariaLabel | `string` | - | Accessible label (required for icon-only) |

**Examples:**

```tsx
// Primary action
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// With icon
<Button variant="primary" icon={<PlusIcon />}>
  Add Product
</Button>

// Loading state
<Button variant="primary" loading={isSaving}>
  Saving...
</Button>

// Icon only
<Button variant="icon" ariaLabel="Delete">
  <TrashIcon />
</Button>

// Disabled
<Button variant="primary" disabled>
  Cannot Click
</Button>
```

### Input Component

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | **Required.** Input label |
| value | `string` | - | **Required.** Current value |
| onChange | `(value: string) => void` | - | **Required.** Change handler |
| type | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | Input type |
| placeholder | `string` | - | Placeholder text |
| helperText | `string` | - | Helper text below input |
| errorText | `string` | - | Error message (shows error state) |
| successText | `string` | - | Success message (shows success state) |
| disabled | `boolean` | `false` | Disabled state |
| required | `boolean` | `false` | Required field indicator |
| maxLength | `number` | - | Maximum character length |
| showCharacterCount | `boolean` | `false` | Show character counter |
| startAdornment | `ReactNode` | - | Icon/element at start |
| endAdornment | `ReactNode` | - | Icon/element at end |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Input size |

**Examples:**

```tsx
// Basic input
<Input
  label="Product Name"
  value={productName}
  onChange={setProductName}
  placeholder="Enter product name"
/>

// Required with helper text
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  required
  helperText="We'll never share your email"
/>

// With validation
<Input
  label="Username"
  value={username}
  onChange={setUsername}
  errorText={errors.username}
  helperText="3-20 characters"
/>

// With character limit
<Input
  label="Description"
  value={description}
  onChange={setDescription}
  maxLength={100}
  showCharacterCount
/>

// With icon
<Input
  label="Search"
  value={searchTerm}
  onChange={setSearchTerm}
  startAdornment={<SearchIcon />}
/>
```

### Card Component

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'elevated' \| 'outlined' \| 'metric'` | `'default'` | Card style variant |
| header | `ReactNode` | - | Header content |
| footer | `ReactNode` | - | Footer content |
| children | `ReactNode` | - | **Required.** Main content |
| hoverable | `boolean` | `false` | Apply hover effect |
| onClick | `() => void` | - | Click handler (makes card clickable) |
| padding | `'compact' \| 'normal' \| 'spacious'` | `'normal'` | Padding size |
| elevated | `boolean` | `false` | Apply shadow |

**Examples:**

```tsx
// Basic card
<Card>
  <h3>Title</h3>
  <p>Content goes here</p>
</Card>

// With header and footer
<Card
  header="Product Settings"
  footer={
    <>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Save</Button>
    </>
  }
>
  <p>Settings content...</p>
</Card>

// Elevated card
<Card variant="elevated" hoverable>
  <h3>Hover me</h3>
  <p>This card has a shadow and hover effect</p>
</Card>

// Clickable card
<Card onClick={() => navigate('/product/123')}>
  <h3>Product Name</h3>
  <p>Click to view details</p>
</Card>
```

### CardMetric Component

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string \| number` | - | **Required.** Main metric value |
| label | `string` | - | **Required.** Metric label |
| trend | `string` | - | Trend indicator (e.g., "+12%") |
| trendDirection | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Trend direction (auto-detected from +/- if not set) |
| icon | `ReactNode` | - | Icon to display |
| helperText | `string` | - | Additional context text |

**Examples:**

```tsx
// Metric with upward trend
<Card variant="metric" elevated>
  <CardMetric
    icon={<UsersIcon />}
    value="12,345"
    label="Active Members"
    trend="+12.5%"
    helperText="vs. last month"
  />
</Card>

// Metric with downward trend
<Card variant="metric">
  <CardMetric
    value="8.2%"
    label="Churn Rate"
    trend="-2.1%"
    trendDirection="down"
  />
</Card>

// Simple metric
<Card variant="metric">
  <CardMetric
    value="$2.4M"
    label="Monthly Revenue"
  />
</Card>
```

## 🎨 Design Tokens

All components use design tokens from `tokens.css`. You can reference these in your custom components:

### Colors
```css
var(--color-primary)           /* #00BCD4 - Cyan */
var(--color-accent)            /* #E91E63 - Magenta */
var(--color-success)           /* #4CAF50 - Green */
var(--color-error)             /* #F44336 - Red */
var(--color-warning)           /* #FF9800 - Orange */
```

### Spacing (8px grid)
```css
var(--space-1)  /* 8px */
var(--space-2)  /* 16px */
var(--space-3)  /* 24px */
var(--space-4)  /* 32px */
```

### Typography
```css
var(--font-size-body-1)        /* 16px */
var(--font-size-body-2)        /* 14px */
var(--font-weight-medium)      /* 500 */
var(--font-weight-semibold)    /* 600 */
```

### Border Radius
```css
var(--radius-sm)   /* 4px */
var(--radius-md)   /* 6px */
var(--radius-lg)   /* 8px */
```

## ✅ Component Checklist

### Completed ✓
- [x] Design tokens system
- [x] Button component (all variants + states)
- [x] Input component (all states + validation)
- [x] Card component (all variants)
- [x] CardMetric component
- [x] Component export index
- [x] Demo page

### Next Steps (Per Your Roadmap)
- [ ] Badge component (status indicators)
- [ ] Alert component (notifications)
- [ ] Modal component (dialogs)
- [ ] Table component (data display)
- [ ] Layout components (AppShell, Sidebar, Header)

## 🧪 Testing Your Components

### View the Demo Page

1. Import and render `ComponentDemo.tsx` in your app
2. You'll see all components in various states
3. Interact with buttons, inputs, and cards

### Manual Testing Checklist

**Button:**
- [ ] All variants render correctly
- [ ] Hover states work
- [ ] Click handlers fire
- [ ] Loading state shows spinner
- [ ] Disabled state prevents interaction
- [ ] Focus ring visible on keyboard navigation

**Input:**
- [ ] Label displays above input
- [ ] Placeholder shows when empty
- [ ] onChange handler fires
- [ ] Error state shows red border
- [ ] Success state shows green border
- [ ] Character counter updates
- [ ] Disabled state prevents typing
- [ ] Required asterisk shows

**Card:**
- [ ] All variants render correctly
- [ ] Header and footer display
- [ ] Hover effect works on hoverable cards
- [ ] onClick fires for clickable cards
- [ ] Metric displays with icon and trend

## 💡 Best Practices

### 1. Always Use Design Tokens
```tsx
// ❌ Don't do this
<div style={{ color: '#00BCD4', padding: '16px' }}>

// ✅ Do this
<div style={{ color: 'var(--color-primary)', padding: 'var(--space-2)' }}>
```

### 2. Use Semantic Variants
```tsx
// ❌ Don't do this
<Button variant="primary">Cancel</Button>

// ✅ Do this
<Button variant="ghost">Cancel</Button>
<Button variant="primary">Save</Button>
```

### 3. Provide Accessible Labels
```tsx
// ❌ Don't do this
<Button variant="icon">
  <TrashIcon />
</Button>

// ✅ Do this
<Button variant="icon" ariaLabel="Delete product">
  <TrashIcon />
</Button>
```

### 4. Show Validation Feedback
```tsx
// ❌ Don't do this
<Input label="Email" value={email} onChange={setEmail} />

// ✅ Do this
<Input
  label="Email"
  value={email}
  onChange={setEmail}
  errorText={emailError}
  successText={emailError ? undefined : "Looks good!"}
/>
```

## 🔧 Customization

### Extending Components

If you need custom styling:

```tsx
// Add custom class
<Button className="my-custom-button" variant="primary">
  Click me
</Button>

// In your CSS
.my-custom-button {
  /* Your custom styles */
  min-width: 200px;
}
```

### Creating New Components

Follow the same pattern:
1. Create TypeScript interface with props
2. Build React component with proper typing
3. Create CSS file using design tokens
4. Export from `index.ts`
5. Add to demo page

## 📝 Next Session: What to Build

Based on your handoff document, here are recommended next steps:

### Option 1: Complete Component Library (Recommended)
Build the remaining core components:
- Badge (status indicators)
- Alert (success/error messages)
- Modal (dialogs and confirmations)
- Table (data tables with sorting/filtering)

### Option 2: Build Layout Components
Create the app structure:
- AppShell (header + sidebar + main content)
- Sidebar navigation
- PageHeader (breadcrumbs + title + actions)

### Option 3: Build First Feature
Use these components to build:
- Product List Page (table + filters + actions)
- Product Detail Page (cards + forms)

## 🎯 Success Criteria

You've successfully completed this phase if:
- ✅ All three components render without errors
- ✅ Components match design specifications exactly
- ✅ All interactive states work (hover, focus, disabled)
- ✅ Components are fully typed with TypeScript
- ✅ Design tokens are used consistently
- ✅ Demo page displays all variants

## 🚀 You're Ready!

You now have a solid foundation for your CAPS platform UI. These components follow your design system and are production-ready. You can:

1. **Copy/paste** these components into your Next.js app
2. **Type all code manually** (as you prefer) to internalize the patterns
3. **Build new components** following the same structure
4. **Create real pages** using these building blocks

Good luck building CAPS! 🎉
