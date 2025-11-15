# Products & Benefits Platform - Cursor AI Coding Rules

## Project Context
This is an AI-native Products & Benefits Platform for healthcare payers. The platform enables health insurance companies to design, rate, validate, and publish health insurance products through three modalities: AI-Driven (conversational), Visual Builder (drag-drop), and Guided Wizard (step-by-step).

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Material-UI
- **Database**: PostgreSQL (via Prisma ORM)
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **AI/ML**: Google Gemini Pro / OpenAI GPT-4
- **Deployment**: GCP (Cloud Run, Cloud SQL, Cloud Storage)

## Code Organization

### Directory Structure
```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Auth group routes
│   ├── (dashboard)/         # Dashboard group routes
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── forms/               # Form components
│   ├── layouts/             # Layout components
│   └── features/            # Feature-specific components
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client
│   ├── ai/                 # AI agent utilities
│   └── utils.ts            # General utilities
├── types/                   # TypeScript types
├── hooks/                   # Custom React hooks
└── services/                # Business logic & API clients
```

## TypeScript Standards

### Type Safety
- **Always use explicit types** - Avoid `any`, use `unknown` when type is truly unknown
- **Use interfaces for objects**, types for unions/intersections
- **Define types in dedicated files** in `src/types/`
- **Use Zod schemas** for runtime validation
- **Leverage Prisma-generated types** for database entities

### Naming Conventions
- **Files**: `kebab-case.ts` (e.g., `product-catalog.ts`)
- **Components**: `PascalCase.tsx` (e.g., `ProductList.tsx`)
- **Functions**: `camelCase` (e.g., `createProduct`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces**: `PascalCase` (e.g., `Product`, `CreateProductInput`)
- **Enums**: `PascalCase` with `UPPER_SNAKE_CASE` values

### Example Type Definitions
```typescript
// Good
interface Product {
  id: string
  name: string
  status: ProductStatus
}

type CreateProductInput = Omit<Product, 'id'>

// Bad
interface product {  // Should be PascalCase
  id: any           // Avoid any
  name: string
}
```

## React Component Standards

### Component Structure
```typescript
'use client' // If using client-side features

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

interface ProductListProps {
  organizationId: string
  onSelectProduct?: (product: Product) => void
}

export function ProductList({ organizationId, onSelectProduct }: ProductListProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', organizationId],
    queryFn: () => fetchProducts(organizationId),
  })

  if (isLoading) return <LoadingSpinner />
  
  return (
    <div className="space-y-4">
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onSelectProduct} />
      ))}
    </div>
  )
}
```

### Component Rules
- **Export by name**, not default (aids in refactoring)
- **Props in interfaces** with descriptive names
- **Use function declarations** for components (not arrow functions)
- **Extract complex logic** into custom hooks
- **Keep components focused** - single responsibility
- **Use Tailwind** for styling, MUI for complex components

## API Route Standards

### Route Structure
```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  lineOfBusiness: z.enum(['COMMERCIAL', 'MEDICARE_ADVANTAGE', 'MEDICAID']),
  // ... more fields
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = CreateProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...validated,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### API Rules
- **Always validate input** with Zod schemas
- **Use proper HTTP status codes** (200, 201, 400, 401, 404, 500)
- **Return consistent error format** `{ error: string, errors?: ZodError[] }`
- **Check authentication** for protected routes
- **Log errors** for debugging
- **Use try-catch** for error handling

## Database Standards (Prisma)

### Querying Patterns
```typescript
// Good - Explicit includes, select only needed fields
const product = await prisma.product.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    status: true,
    plans: {
      select: {
        id: true,
        name: true,
      },
    },
  },
})

// Bad - Returns everything, potential performance issue
const product = await prisma.product.findUnique({
  where: { id },
  include: {
    plans: true,
    auditLogs: true,  // Could be thousands of records
  },
})
```

### Database Rules
- **Use transactions** for multi-step operations
- **Add indexes** for frequently queried fields
- **Use `select`** to limit returned fields
- **Avoid N+1 queries** - use `include` strategically
- **Use enums** from schema (avoid hardcoded strings)
- **Soft delete** when appropriate (isActive flag)

## Form Handling

### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lineOfBusiness: z.enum(['COMMERCIAL', 'MEDICARE_ADVANTAGE', 'MEDICAID']),
  effectiveDate: z.date(),
})

type ProductFormData = z.infer<typeof ProductSchema>

export function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  })

  const onSubmit = async (data: ProductFormData) => {
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* ... more fields */}
    </form>
  )
}
```

## State Management

### Zustand for Global State
```typescript
// src/store/product-store.ts
import { create } from 'zustand'

interface ProductStore {
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  filters: ProductFilters
  setFilters: (filters: ProductFilters) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  filters: {},
  setFilters: (filters) => set({ filters }),
}))
```

### React Query for Server State
```typescript
// src/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

## AI Agent Integration

### AI Service Pattern
```typescript
// src/services/ai/product-agent.ts
import { Gemini } from '@google/generative-ai'

interface ProductCreationRequest {
  prompt: string
  context?: Record<string, any>
}

export async function createProductWithAI(request: ProductCreationRequest) {
  const model = new Gemini({ apiKey: process.env.GOOGLE_AI_API_KEY })
  
  const systemPrompt = `You are a healthcare product design expert. 
  Create a product based on user requirements following these rules:
  - Always include Essential Health Benefits (EHB)
  - Validate actuarial value calculations
  - Ensure state mandate compliance
  `
  
  const response = await model.generateContent({
    contents: [
      { role: 'system', text: systemPrompt },
      { role: 'user', text: request.prompt },
    ],
  })
  
  return parseAIResponse(response)
}
```

## Error Handling

### Client-Side Error Boundaries
```typescript
// src/components/error-boundary.tsx
'use client'

import { useEffect } from 'react'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Testing Standards

### Unit Tests (Jest)
```typescript
// src/lib/__tests__/utils.test.ts
import { calculatePremium } from '../utils'

describe('calculatePremium', () => {
  it('should calculate premium with age factor', () => {
    const result = calculatePremium({ baseRate: 100, age: 45, ageFactor: 1.5 })
    expect(result).toBe(150)
  })

  it('should throw error for invalid age', () => {
    expect(() => calculatePremium({ baseRate: 100, age: -1 })).toThrow()
  })
})
```

## Performance Optimization

### Key Strategies
1. **Use React Server Components** by default
2. **Add 'use client'** only when needed (state, effects, browser APIs)
3. **Implement pagination** for large data sets
4. **Use React Query caching** effectively
5. **Lazy load** components with `next/dynamic`
6. **Optimize images** with `next/image`
7. **Index database queries** appropriately

## Security Rules

1. **Never commit secrets** - use environment variables
2. **Validate all user input** - use Zod schemas
3. **Sanitize data** before database insertion
4. **Use CSRF protection** (Next.js built-in)
5. **Implement rate limiting** on API routes
6. **Use HTTPS** in production
7. **Implement proper authentication** with NextAuth

## Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Example
```
feat(product-catalog): add product search with filters

- Implement search by name, LOB, status
- Add filter UI with MUI components
- Integrate with React Query for caching

Closes #123
```

## Code Review Checklist

Before submitting code, ensure:
- [ ] TypeScript types are explicit
- [ ] Zod validation for all forms/API inputs
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Authentication checked (if needed)
- [ ] No console.log statements (use proper logging)
- [ ] Components are properly typed
- [ ] Database queries are optimized
- [ ] Tests added (if applicable)
- [ ] Code follows naming conventions

## Additional Guidelines

### Comments
- **Write self-documenting code** - prefer clear naming over comments
- **Add comments** for complex business logic
- **Use JSDoc** for public APIs and utility functions
```typescript
/**
 * Calculates the monthly premium for a health insurance product
 * @param baseRate - The base PMPM rate
 * @param age - Member age (18-100)
 * @param tobaccoUser - Whether member uses tobacco
 * @returns Calculated premium amount
 */
export function calculatePremium(
  baseRate: number,
  age: number,
  tobaccoUser: boolean
): number {
  // Implementation
}
```

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

### Documentation
- Update README when adding major features
- Document API endpoints
- Keep this rules.md file updated
- Add inline documentation for complex logic

---

**Remember**: This platform handles sensitive healthcare data. Always prioritize security, privacy, and data integrity in your code.

