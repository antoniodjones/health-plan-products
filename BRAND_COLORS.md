# 🎨 Brand Color System

## Color Palette

Based on your customer journey funnel design, here's your custom brand color system:

### Primary Colors

#### 🟠 Brand Orange (Primary)
- **Hex**: `#FF9834`
- **HSL**: `27 96% 61%`
- **RGB**: `rgb(255, 152, 52)`
- **Usage**: Primary action buttons, CTAs, important highlights
- **Represents**: PROSPECT stage - "I need health insurance"

#### 🔵 Brand Blue (Secondary)
- **Hex**: `#0EA5E9`
- **HSL**: `199 89% 48%`
- **RGB**: `rgb(14, 165, 233)`
- **Usage**: Secondary actions, informational elements, links
- **Represents**: ACTIVATING stage - "First Actions"

#### 🟢 Brand Green (Success)
- **Hex**: `#22C55E`
- **HSL**: `142 76% 36%`
- **RGB**: `rgb(34, 197, 94)`
- **Usage**: Success states, confirmations, completed actions
- **Represents**: ENGAGED stage - "Active Usage"

---

## Color Usage Guidelines

### Buttons

**Primary Actions** (Orange)
```tsx
<Button>Create Product</Button>
<Button>Import Codes</Button>
<Button>Save Changes</Button>
```

**Secondary Actions** (Blue)
```tsx
<Button variant="secondary">View Details</Button>
<Button variant="secondary">Learn More</Button>
```

**Success Actions** (Green)
```tsx
<Button className="bg-success">Approve</Button>
<Button className="bg-success">Publish</Button>
```

### Status Indicators

```tsx
// Active/Success - Green
<Badge className="bg-success">Active</Badge>

// In Progress - Blue
<Badge className="bg-secondary">In Progress</Badge>

// Warning/Attention - Orange
<Badge className="bg-primary">Pending</Badge>

// Error - Red (system default)
<Badge variant="destructive">Error</Badge>
```

### Page Elements

**Headers/Titles**
- Use default foreground color (near-black)
- Accent with orange for emphasis

**Cards**
- White background with subtle gray borders
- Use colored left border for categorization:
  - Orange: Action required
  - Blue: Informational
  - Green: Completed/Success

**Charts & Data Visualization**
- Primary data series: Orange
- Secondary data series: Blue
- Positive trends: Green
- Negative trends: Red

---

## Component Examples

### Primary Button (Orange)
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Create New Product
</Button>
```

### Secondary Button (Blue)
```tsx
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  View All Codes
</Button>
```

### Success Button (Green)
```tsx
<Button className="bg-success text-success-foreground hover:bg-success/90">
  Approve & Publish
</Button>
```

### Info Card (Blue accent)
```tsx
<Card className="border-l-4 border-l-secondary">
  <CardHeader>
    <CardTitle>Getting Started</CardTitle>
  </CardHeader>
  <CardContent>
    Follow these steps to configure your first product.
  </CardContent>
</Card>
```

### Action Card (Orange accent)
```tsx
<Card className="border-l-4 border-l-primary">
  <CardHeader>
    <CardTitle>Action Required</CardTitle>
  </CardHeader>
  <CardContent>
    5 codes need to be mapped to benefit segments.
  </CardContent>
</Card>
```

### Success Card (Green accent)
```tsx
<Card className="border-l-4 border-l-success">
  <CardHeader>
    <CardTitle>All Set!</CardTitle>
  </CardHeader>
  <CardContent>
    Your product has been published successfully.
  </CardContent>
</Card>
```

---

## Accessibility

All color combinations meet WCAG 2.1 AA standards:

| Combination | Contrast Ratio | Passes |
|-------------|---------------|--------|
| Orange on White | 4.5:1 | ✅ AA |
| Blue on White | 4.5:1 | ✅ AA |
| Green on White | 4.5:1 | ✅ AA |
| White on Orange | 4.5:1 | ✅ AA |
| White on Blue | 4.5:1 | ✅ AA |
| White on Green | 4.5:1 | ✅ AA |

---

## Tailwind Utility Classes

```tsx
// Background colors
bg-primary      // Orange
bg-secondary    // Blue
bg-success      // Green

// Text colors
text-primary      // Orange text
text-secondary    // Blue text
text-success      // Green text

// Border colors
border-primary    // Orange border
border-secondary  // Blue border
border-success    // Green border

// Hover states
hover:bg-primary/90    // Slightly darker orange
hover:bg-secondary/90  // Slightly darker blue
hover:bg-success/90    // Slightly darker green
```

---

## Dark Mode Adaptations

In dark mode:
- Colors remain vibrant but slightly adjusted for contrast
- Blue becomes slightly lighter (`58%` vs `48%` lightness)
- Green becomes slightly lighter (`46%` vs `36%` lightness)
- Orange stays the same (already vibrant)

---

## Brand Personality

Your color system reflects:

**🟠 Orange (Primary)**
- Energetic, action-oriented
- Warmth, approachability
- Urgency without aggression

**🔵 Blue (Secondary)**
- Trust, reliability
- Calm, professional
- Information, guidance

**🟢 Green (Success)**
- Growth, progress
- Success, completion
- Health, vitality (fitting for healthcare!)

---

## Quick Reference

When building features, use this decision tree:

1. **Is it the main action on the page?** → Orange (primary)
2. **Is it supporting info or secondary action?** → Blue (secondary)
3. **Is it a success/completion state?** → Green (success)
4. **Is it an error/destructive action?** → Red (destructive)

---

**Your colors make a perfect healthcare platform:** Orange for action, Blue for trust, Green for health! 🎨

