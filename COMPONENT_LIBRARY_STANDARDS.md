# Component Library Standards
## Health Plan Products & Benefits Platform

**Date:** November 15, 2025  
**Version:** 1.0  
**Based on:** Shadcn/ui + CAPS Enterprise Design System

---

## Overview

This document defines the standards for all UI components in the platform. All components follow Shadcn/ui patterns with CAPS design system enhancements.

---

## 1. Buttons

### Variants

**Primary (Default)**
```tsx
<Button>Create Product</Button>
```
- **Color:** Brand Orange (#FF9834)
- **Use:** Primary actions, main CTAs
- **Examples:** Create, Save, Submit, Publish

**Secondary (Outline)**
```tsx
<Button variant="outline">Cancel</Button>
```
- **Color:** Gray border, transparent background
- **Use:** Secondary actions, cancel buttons
- **Examples:** Cancel, View Details, Learn More

**Destructive**
```tsx
<Button variant="destructive">Delete</Button>
```
- **Color:** Red (#EF4444)
- **Use:** Destructive actions
- **Examples:** Delete, Remove, Revoke

**Ghost**
```tsx
<Button variant="ghost">Close</Button>
```
- **Color:** Transparent, hover gray
- **Use:** Tertiary actions, close buttons
- **Examples:** Close, Dismiss, Skip

### Sizes

```tsx
<Button size="sm">Small</Button>     // Compact UI
<Button size="default">Default</Button>  // Standard
<Button size="lg">Large</Button>     // Prominent CTAs
```

### With Icons

```tsx
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Create New
</Button>
```

**Standards:**
- Icon size: `h-4 w-4` (16px)
- Icon spacing: `mr-2` (8px gap)
- Icon position: Left of text (default)

### Loading State

```tsx
<Button disabled={loading}>
  {loading ? 'Creating...' : 'Create'}
</Button>
```

**Standards:**
- Disable button during async operations
- Change text to indicate progress
- Optional: Add spinner icon

---

## 2. Cards

### Basic Card

```tsx
<Card>
  <CardContent className="p-6">
    Content goes here
  </CardContent>
</Card>
```

**Standards:**
- **Padding:** Always `p-6` (1.5rem / 24px)
- **Border:** 1px solid gray-200
- **Radius:** 0.5rem (8px)
- **Background:** White (light mode), gray-800 (dark mode)

### Card with Header

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Card with Colored Border

```tsx
<Card className="border-l-4 border-l-blue-500">
  <CardContent className="p-6">
    Info content
  </CardContent>
</Card>
```

**Border Colors:**
- Blue (`border-l-blue-500`): Informational
- Orange (`border-l-orange-500`): Action required
- Green (`border-l-green-500`): Success/completed
- Red (`border-l-red-500`): Error/warning
- Purple (`border-l-purple-500`): Special/featured

### Stat Card

```tsx
<Card className="border-l-4 border-l-blue-500">
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Label</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
        <p className="mt-1 text-xs text-gray-500">Description</p>
      </div>
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
  </CardContent>
</Card>
```

**Standards:**
- Label: `text-sm font-medium text-gray-600`
- Value: `text-3xl font-bold text-gray-900`
- Description: `text-xs text-gray-500`
- Icon: `h-6 w-6` with color matching border

---

## 3. Badges

### Basic Badge

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Custom Colored Badges

```tsx
<Badge className="bg-blue-100 text-blue-700">Active</Badge>
<Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
<Badge className="bg-green-100 text-green-700">Success</Badge>
<Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
<Badge className="bg-red-100 text-red-700">Error</Badge>
```

**Color Palette:**
| Status | Background | Text | Use Case |
|--------|-----------|------|----------|
| Blue | `bg-blue-100` | `text-blue-700` | Info, Active |
| Green | `bg-green-100` | `text-green-700` | Success, Approved |
| Yellow | `bg-yellow-100` | `text-yellow-700` | Warning, Pending |
| Red | `bg-red-100` | `text-red-700` | Error, Rejected |
| Gray | `bg-gray-100` | `text-gray-700` | Inactive, Disabled |
| Purple | `bg-purple-100` | `text-purple-700` | Featured, Special |

### Custom Badge Components

For repeated badge patterns, create custom components:

```tsx
// src/components/ui/status-badge.tsx
export function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };
  
  return (
    <Badge className={colors[status] || colors.inactive}>
      {status}
    </Badge>
  );
}
```

---

## 4. Forms & Inputs

### Text Input

```tsx
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input 
    id="name" 
    placeholder="Enter name..." 
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
</div>
```

**Standards:**
- Always use `<Label>` with `htmlFor` attribute
- Use `space-y-2` (8px) between label and input
- Provide helpful placeholders
- Use controlled components (value + onChange)

### Select Dropdown

```tsx
<div className="space-y-2">
  <Label htmlFor="type">Type</Label>
  <Select value={type} onValueChange={setType}>
    <SelectTrigger>
      <SelectValue placeholder="Select type..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Textarea

```tsx
<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea 
    id="description"
    placeholder="Enter description..."
    rows={3}
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
</div>
```

### Slider

```tsx
<div className="space-y-2">
  <Label>Priority: {priority[0]}</Label>
  <Slider 
    value={priority}
    onValueChange={setPriority}
    min={0}
    max={100}
    step={5}
  />
  <p className="text-xs text-gray-500">Helper text</p>
</div>
```

### Checkbox

```tsx
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="agree"
    checked={checked}
    onChange={(e) => setChecked(e.target.checked)}
    className="h-4 w-4 rounded border-gray-300"
  />
  <Label htmlFor="agree" className="cursor-pointer">
    I agree to terms
  </Label>
</div>
```

### Form Layout

```tsx
<form className="space-y-6">
  {/* Group related fields */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Basic Information</h3>
    <div className="space-y-2">
      <Label>Field 1</Label>
      <Input />
    </div>
    <div className="space-y-2">
      <Label>Field 2</Label>
      <Input />
    </div>
  </div>

  {/* Another group */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Advanced Options</h3>
    {/* fields */}
  </div>

  {/* Form actions */}
  <div className="flex items-center justify-end gap-3">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</form>
```

**Standards:**
- Form spacing: `space-y-6` (1.5rem / 24px)
- Field group spacing: `space-y-4` (1rem / 16px)
- Label-input spacing: `space-y-2` (0.5rem / 8px)
- Button gap: `gap-3` (0.75rem / 12px)

---

## 5. Modals/Dialogs

### Basic Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Optional description text
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6 py-4">
      {/* Dialog content */}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Standards:**
- Max width: `max-w-2xl` (672px) for standard dialogs
- Max width: `max-w-4xl` (896px) for wide dialogs
- Content padding: `py-4` (vertical), inherits horizontal from DialogContent
- Content spacing: `space-y-6`
- Footer button order: Cancel (left), Confirm (right)
- Footer button gap: `gap-3`

### Scrollable Dialog

```tsx
<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
  {/* content */}
</DialogContent>
```

**Standards:**
- Max height: `max-h-[90vh]` (90% of viewport)
- Overflow: `overflow-y-auto`
- Use for long forms or content

---

## 6. Tables

### Basic Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.col1}</TableCell>
        <TableCell>{item.col2}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">View</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Sortable Table

```tsx
<TableHead 
  className="cursor-pointer hover:bg-gray-50"
  onClick={() => handleSort('column')}
>
  <div className="flex items-center gap-2">
    Column Name
    {sortBy === 'column' && (
      sortOrder === 'asc' ? 
        <ChevronUp className="h-4 w-4" /> : 
        <ChevronDown className="h-4 w-4" />
    )}
  </div>
</TableHead>
```

**Standards:**
- Sortable headers: cursor-pointer, hover state
- Sort icons: `h-4 w-4`
- Icon gap: `gap-2`

### Empty State

```tsx
<TableBody>
  {data.length === 0 ? (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        <div className="text-gray-500">
          <p className="font-medium">No results found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    {/* data rows */}
  )}
</TableBody>
```

---

## 7. Loading States

### Spinner

```tsx
<div className="flex h-64 items-center justify-center">
  <div className="text-center">
    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    <p className="text-sm text-gray-500">Loading...</p>
  </div>
</div>
```

### Skeleton Loader (Future)

```tsx
<div className="space-y-4">
  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
</div>
```

---

## 8. Toast Notifications

### Usage

```tsx
import { useToast } from '@/hooks/useToast';

const { toast } = useToast();

// Success
toast.success('Title', 'Optional description');

// Error
toast.error('Title', 'Optional description');

// Warning
toast.warning('Title', 'Optional description');

// Info
toast.info('Title', 'Optional description');
```

**Standards:**
- Auto-dismiss: 5 seconds (default)
- Position: Top-right
- Max width: 384px (w-96)
- Stack multiple toasts vertically

---

## 9. Confirmation Dialogs

### Usage

```tsx
import { useConfirm } from '@/hooks/useConfirm';

const { confirm, ConfirmDialog } = useConfirm();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Delete Item?',
    description: 'This action cannot be undone.',
    variant: 'danger',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  });
  
  if (confirmed) {
    // Proceed with deletion
  }
};

// In JSX
return (
  <>
    <Button onClick={handleDelete}>Delete</Button>
    <ConfirmDialog />
  </>
);
```

**Variants:**
- `danger`: Red confirm button (destructive actions)
- `warning`: Yellow confirm button (caution)
- `info`: Blue confirm button (informational)

---

## 10. Search & Filters

### Search Bar

```tsx
<div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
  <Input
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-10"
  />
</div>
```

**Standards:**
- Icon: `Search` from lucide-react
- Icon position: Absolute left, vertically centered
- Icon size: `h-4 w-4`
- Icon color: `text-gray-400`
- Input padding: `pl-10` (40px) to accommodate icon

### Filter Panel

```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search..." className="pl-10" />
      </div>

      {/* Filters */}
      <Select>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
        </SelectContent>
      </Select>

      {/* Actions */}
      <Button variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 11. Pagination

### Basic Pagination

```tsx
<div className="flex items-center justify-between">
  <p className="text-sm text-gray-600">
    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} results
  </p>
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
    >
      Previous
    </Button>
    <span className="text-sm">
      Page {page} of {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
    >
      Next
    </Button>
  </div>
</div>
```

---

## 12. Accessibility Standards

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus states must be visible

### ARIA Labels
```tsx
// Icon-only buttons
<Button aria-label="Delete item">
  <Trash2 className="h-4 w-4" />
</Button>

// Form fields
<Label htmlFor="email">Email</Label>
<Input id="email" aria-describedby="email-help" />
<p id="email-help" className="text-xs text-gray-500">
  We'll never share your email
</p>
```

### Color Contrast
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (18px+): Minimum 3:1
- Medical information: 7:1 (WCAG AAA)

---

## 13. Responsive Design

### Mobile-First Approach

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>
```

**Breakpoints:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

### Hide/Show at Breakpoints

```tsx
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

---

## 14. Component Checklist

Before creating a new component, ensure:

- [ ] Follows Shadcn/ui patterns
- [ ] Uses design tokens from `src/styles/tokens.ts`
- [ ] Has proper TypeScript types
- [ ] Includes accessibility attributes
- [ ] Has loading states
- [ ] Has error states
- [ ] Has empty states
- [ ] Is responsive
- [ ] Has proper spacing (p-6 for cards!)
- [ ] Uses consistent colors
- [ ] Has hover/focus states
- [ ] Is keyboard accessible

---

**Document Version:** 1.0  
**Last Updated:** November 15, 2025  
**Status:** Complete

