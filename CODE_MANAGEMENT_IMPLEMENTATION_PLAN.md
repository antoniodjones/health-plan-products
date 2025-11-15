# 📋 Code Management System - Implementation Plan

## 🎯 Executive Summary

**Approach**: Manual-first, AI-last  
**Design System**: Apple-inspired (shadcn/ui)  
**Architecture**: Clean Code + Clean Architecture + Domain Driven Design  
**Timeline**: 8 weeks (Epic 1 complete foundation)

Based on your documentation:
- `Code_Management_System_Product_Requirements_EPICs (1).md`
- `CODE_MANAGEMENT_USER_STORIES.md`
- `DESIGN_DECISIONS.md`

---

## 🏗️ Implementation Strategy

### Phase Approach

```
Week 1-2: CODE LIBRARY FOUNDATION (Epic 1 - Part 1)
  ↓ Manual CRUD, search, browse
  
Week 3-4: CODE IMPORT SYSTEM (Epic 1 - Part 2)
  ↓ CSV import wizard, validation
  
Week 5-6: CODE MAPPINGS (Epic 2 - Part 1)
  ↓ Map codes to benefit segments
  
Week 7-8: VALIDATION & UI POLISH (Epic 3 & 4)
  ↓ Testing, analytics, refinement
```

**AI Role**: Passive learning (logs all actions for future automation)

---

## 📐 Architecture Alignment

### Database Schema (Already Exists)

Your Prisma schema already has:
```prisma
model CodeSet {
  id              String      @id @default(uuid())
  code            String
  codeType        CodeType
  description     String
  longDescription String?
  category        String?
  isActive        Boolean     @default(true)
  effectiveDate   DateTime
  terminationDate DateTime?
  version         String      @default("1.0")
  // ... relationships to mappings
}

model CodeMapping {
  id                String      @id @default(uuid())
  codeSetId         String
  benefitSegmentId  String
  copay             Float?
  coinsurance       Float?
  deductibleApplies Boolean     @default(true)
  // ... cost-sharing rules
}

model BenefitSegment {
  id                  String      @id @default(uuid())
  name                String
  category            BenefitCategory
  description         String?
  // ... benefit category definitions
}
```

✅ **Perfect alignment with Epic requirements!**

---

## 🎨 Design System: Apple-Inspired

### Visual Standards

**Colors**:
- Primary: `#007AFF` (Apple Blue)
- Success: `#34C759` (Apple Green)
- Warning: `#FF9500` (Apple Orange)
- Error: `#FF3B30` (Apple Red)

**Spacing**:
- Page padding: `p-6` (24px)
- Card padding: `p-6`
- Element spacing: `space-y-6` (24px between major sections)
- Tight spacing: `space-y-2` (8px between related items)

**Typography**:
- Page title: `text-3xl font-semibold` (30px)
- Section title: `text-xl font-semibold` (20px)
- Body: `text-base` (16px)
- Caption: `text-sm text-muted-foreground` (14px)

**Components** (shadcn/ui):
- Tables: Clean, minimal borders
- Buttons: Rounded (`rounded-lg`), subtle shadows
- Cards: Frosted glass effect optional
- Inputs: Minimal, clear focus states

---

## 🚀 Week 1-2: Code Library Foundation

### Goal
Build manual CRUD operations for browsing and managing codes.

### User Stories to Implement

#### Story 1.1: View Standard Medical Codes (3 points)
**JIRA**: PBP-001

**Files to Create**:
```
src/app/(dashboard)/codes/page.tsx
src/app/api/codes/route.ts
src/components/features/codes/code-list.tsx
src/components/features/codes/code-filters.tsx
src/types/code.ts
src/services/code-service.ts
```

**Implementation**:

1. **Code List Page** (`src/app/(dashboard)/codes/page.tsx`)
   ```typescript
   // Server Component - fetches initial data
   - Display statistics: Total, Active, Inactive, By Type
   - Searchable table with shadcn/ui Table component
   - Filters: Code Type, Status, Date Range
   - Pagination (50 per page)
   - Sort by: Code Value, Type, Status, Date
   ```

2. **API Route** (`src/app/api/codes/route.ts`)
   ```typescript
   GET /api/codes
   Query params:
   - page: number (default 1)
   - limit: number (default 50)
   - search: string (searches code + description)
   - codeType: enum (CPT, HCPCS, ICD_10_CM, etc.)
   - isActive: boolean
   - effectiveDate: date range
   
   Response:
   {
     data: CodeSet[],
     pagination: { page, limit, total, totalPages },
     statistics: { total, active, inactive, byType }
   }
   ```

3. **Design**: Apple-inspired
   - Clean white cards on light gray background
   - Apple blue action buttons
   - Subtle hover states
   - Generous spacing (24px between sections)

**Cursor AI Prompt**:
```
Create src/app/(dashboard)/codes/page.tsx with:

Design (Apple-inspired):
- Clean, minimal dashboard with statistics cards
- Apple blue (#007AFF) for primary actions
- Statistics: Total Codes, Active, Inactive, Code Types
- shadcn/ui Table component for code list
- Filters: Code Type dropdown, Status toggle, Search input
- Pagination component (50 per page)

Functionality:
- Server component fetching from Prisma CodeSet model
- Display columns: Code, Type, Description, Status, Effective Date
- Click row → view code details
- "Import Codes" button (top-right)
- Search box (debounced, searches code + description)
- Filter dropdowns with Apple-styled select components

Technical:
- Use @prisma/client CodeSet model
- TypeScript with proper types
- Error boundaries
- Loading states with skeleton
- Follow @.cursor/rules.md (no hardcoding, clean code)
- Apple-inspired spacing: p-6, space-y-6
```

#### Story 1.2: Search Codes (included above)
#### Story 1.3: View Code Details (5 points)
**JIRA**: PBP-002

**Files to Create**:
```
src/components/features/codes/code-detail-dialog.tsx
src/app/api/codes/[id]/route.ts
```

**Implementation**:
- shadcn/ui Dialog component
- Shows: Code, Type, Description, Status, Dates, Version
- Shows: Mappings (which benefit segments use this code)
- Shows: Products/Plans using this code
- Actions: Edit, Map to Benefit, View History

---

## 🚀 Week 3-4: Code Import System

### Goal
Build CSV import wizard with validation.

### User Stories to Implement

#### Story 2.1: Bulk Import Codes via CSV (8 points)
**JIRA**: PBP-003

**Files to Create**:
```
src/app/(dashboard)/codes/import/page.tsx
src/components/features/codes/import-wizard.tsx
src/components/features/codes/import-steps/
  - step-1-upload.tsx
  - step-2-mapping.tsx
  - step-3-validation.tsx
  - step-4-results.tsx
src/app/api/codes/import/route.ts
src/lib/import-validator.ts
```

**4-Step Wizard**:

**Step 1: File Upload**
- Drag-and-drop zone (react-dropzone)
- Accept: .csv, .xlsx
- File preview (first 10 rows)
- Max size: 10MB
- Auto-detect columns

**Step 2: Column Mapping**
- Show detected columns from CSV
- Map to schema fields:
  - CSV "Code" → codeValue
  - CSV "Type" → codeType
  - CSV "Description" → description
  - CSV "Status" → isActive
- Smart suggestions based on header names
- Manual override available

**Step 3: Validation**
- Real-time validation:
  - Required fields present
  - Code format valid (per code type)
  - No duplicate codes
  - Dates valid
- Show errors with row numbers
- Option to download error report
- Option to fix and re-upload or skip errors

**Step 4: Import Results**
- Progress bar during import
- Success summary:
  - Total imported: X
  - Skipped (duplicates): Y
  - Errors: Z
- Link to view imported codes
- Option to import more

**Design Principle**: No hardcoding
- ❌ Don't hardcode column names
- ✅ Dynamically detect CSV headers
- ✅ Store column mapping preferences per user

**Cursor AI Prompt**:
```
Create src/components/features/codes/import-wizard.tsx with:

Design (Apple-inspired):
- 4-step wizard with progress indicator
- Step 1: Drag-drop file upload (react-dropzone)
- Step 2: Column mapping interface
- Step 3: Validation results table
- Step 4: Import summary with stats
- Apple blue progress indicators
- Clean, spacious cards (p-6)

Functionality:
- No hardcoded column mappings (dynamic detection)
- Parse CSV/Excel with papaparse
- Validate against CodeSet Prisma model
- Show real-time validation errors
- Batch import to database
- Track progress with loading states

Technical:
- TypeScript with CodeSet types
- Zod validation schemas
- Error handling for file parsing
- Transaction support for bulk insert
- Follow clean code principles
- No magic numbers, named constants
```

---

## 🚀 Week 5-6: Code-to-Benefit Mapping

### Goal
Map billing codes to benefit segments with cost-sharing rules.

### User Stories to Implement

#### Story 3.1: Create Code-to-Benefit Mapping (8 points)
**JIRA**: PBP-004

**Files to Create**:
```
src/app/(dashboard)/codes/mappings/page.tsx
src/components/features/codes/mapping-dialog.tsx
src/app/api/codes/[id]/mappings/route.ts
src/app/api/benefit-segments/route.ts
```

**Mapping Interface**:

**Left Panel: Code Selection**
- Search and select codes
- Filter by type
- Multi-select support
- Shows: Code, Type, Description

**Right Panel: Benefit Configuration**
- Select Benefit Segment (dropdown)
  - Primary Care Visit
  - Specialist Visit
  - Emergency Room
  - Hospital Inpatient
  - etc.
- Configure Cost-Sharing:
  - Copay: $X (input field)
  - Coinsurance: X% (input field)
  - Deductible Applies: Yes/No (toggle)
  - OOP Applies: Yes/No (toggle)
- Additional Rules:
  - Prior Auth Required (checkbox)
  - Referral Required (checkbox)
  - Quantity Limit (input)
  - Age Restrictions (range)

**Validation**:
- Copay must be ≥ $0
- Coinsurance must be 0-100%
- Cannot map same code to multiple segments (conflict detection)
- Effective dates must be logical

**Design**: Apple-inspired
- Split view (50/50)
- Clear visual hierarchy
- Apple blue for "Save Mapping" button
- Inline validation with gentle error messages
- Confirmation dialog before save

**Cursor AI Prompt**:
```
Create src/components/features/codes/mapping-dialog.tsx with:

Design (Apple-inspired):
- Full-screen dialog with two-panel layout
- Left: Code selection with search/filter
- Right: Benefit segment + cost-sharing config
- Apple blue "Save Mapping" button
- Clean form inputs with proper labels
- Inline validation with helpful messages

Functionality:
- Search CodeSet table (left panel)
- Select BenefitSegment dropdown (right panel)
- Configure copay, coinsurance, deductible, OOP
- Validate business rules (copay ≥ 0, coinsurance 0-100%)
- Create CodeMapping record in database
- Show success toast notification

Technical:
- React Hook Form + Zod validation
- Use Prisma models: CodeSet, BenefitSegment, CodeMapping
- No hardcoded benefit segments (fetch from DB)
- Error handling with try-catch
- Follow clean code: small functions, single responsibility
```

---

## 🚀 Week 7-8: Validation & Analytics

### Goal
Add quality checks and analytics dashboard.

### User Stories to Implement

#### Story 4.1: Mapping Validation (5 points)
**JIRA**: PBP-005

**Validation Rules** (from DESIGN_DECISIONS.md):
- All codes should be mapped (goal: 90% coverage)
- No duplicate mappings (same code, different segments)
- All required fields complete
- Business rules valid (copay > 0, etc.)
- Compliance checks (preventive care $0, etc.)

**Implementation**:
```
src/app/(dashboard)/codes/validate/page.tsx
src/app/api/codes/validate/route.ts
src/lib/validation-rules.ts
```

**Validation Dashboard**:
- Coverage metrics: X% codes mapped
- Error summary: Y issues found
- Error details table: Code, Issue, Severity, Fix
- Bulk fix actions
- Export validation report

#### Story 4.2: Analytics Dashboard (3 points)
**JIRA**: PBP-006

**Implementation**:
```
src/app/(dashboard)/codes/analytics/page.tsx
src/app/api/codes/analytics/route.ts
```

**Charts** (using Recharts):
1. Code Distribution (Pie Chart)
   - CPT: X%
   - ICD-10: Y%
   - NDC: Z%

2. Mapping Coverage (Bar Chart)
   - Mapped: X codes
   - Unmapped: Y codes

3. Quality Score (Gauge)
   - Overall quality: 85/100
   - Based on: coverage, accuracy, completeness

4. Recent Activity (Timeline)
   - Last 30 days of imports/updates

**Design**: Apple-inspired
- Clean cards with charts
- Apple colors for data viz
- Generous spacing
- Actionable insights

---

## 📋 Implementation Checklist

### Week 1-2: Code Library ✅
- [ ] Code List page with Apple-inspired design
- [ ] Statistics dashboard (Total, Active, Inactive)
- [ ] Search and filter functionality
- [ ] Pagination (50 per page)
- [ ] Code detail dialog
- [ ] API routes (GET, POST, PUT, DELETE)
- [ ] TypeScript types
- [ ] Error handling
- [ ] Loading states

### Week 3-4: Import System ✅
- [ ] Import wizard (4 steps)
- [ ] File upload with drag-drop
- [ ] Column mapping (dynamic, no hardcoding)
- [ ] Validation engine
- [ ] Error reporting
- [ ] Batch import to database
- [ ] Progress tracking
- [ ] Import results summary

### Week 5-6: Code Mappings ✅
- [ ] Mapping interface (split view)
- [ ] Benefit segment selection
- [ ] Cost-sharing configuration
- [ ] Business rule validation
- [ ] Conflict detection
- [ ] Mapping CRUD operations
- [ ] API endpoints for mappings
- [ ] Mapping preview

### Week 7-8: Validation & Analytics ✅
- [ ] Validation dashboard
- [ ] Coverage metrics
- [ ] Error detection and reporting
- [ ] Analytics dashboard
- [ ] Charts (Pie, Bar, Gauge)
- [ ] Quality scorecard
- [ ] Export capabilities

---

## 🎯 Design Principles to Follow

From `DESIGN_DECISIONS.md`:

### 1. No Hardcoding
❌ **Bad**: Hardcoded list of code types
```typescript
const codeTypes = ['CPT', 'ICD-10', 'NDC']
```

✅ **Good**: Dynamic from database or enum
```typescript
const codeTypes = Object.values(CodeType) // from Prisma enum
```

### 2. Clean Code Principles
- **Meaningful names**: `validateCodeMapping()` not `validate()`
- **Small functions**: 5-20 lines each
- **Single responsibility**: Each component does one thing
- **No magic numbers**: Use named constants
  ```typescript
  const CODES_PER_PAGE = 50
  const MAX_FILE_SIZE_MB = 10
  ```

### 3. Separation of Concerns
```
UI Layer (React Components)
  ↓ calls
Service Layer (Business Logic)
  ↓ calls
Data Layer (Prisma ORM)
```

Example:
```typescript
// ✅ Good: Separation
// UI Component
export function CodeList() {
  const { data } = useQuery({
    queryKey: ['codes'],
    queryFn: codeService.listCodes // Service layer
  })
}

// Service Layer
export const codeService = {
  listCodes: async (filters: CodeFilters) => {
    return await prisma.codeSet.findMany({...}) // Data layer
  }
}
```

### 4. Error Handling
- Always try-catch API calls
- Show user-friendly error messages
- Log errors for debugging
- Fail fast with clear messages

### 5. Accessibility
- All colors meet WCAG contrast requirements
- Focus states clearly visible
- Keyboard navigation works
- Screen reader friendly

---

## 🔗 Integration Points

### Upstream Dependencies
- **CMS Data**: Future API integration for automated imports
- **Prisma Schema**: Already exists, ready to use

### Downstream Dependencies
- **Product Catalog**: Will consume code mappings
- **Benefits Engine**: Will use mappings for adjudication
- **Rating Engine**: May use code groupings for pricing

---

## 📊 Success Metrics

### Week 2 (Code Library)
- ✅ Can view 250K+ codes
- ✅ Search returns results in <200ms
- ✅ 95% of users can find codes without help

### Week 4 (Import System)
- ✅ Can import 10K codes in <5 minutes
- ✅ 99% validation accuracy
- ✅ Clear error messages for all validation failures

### Week 6 (Mappings)
- ✅ Can create mappings in <1 minute
- ✅ 100% conflict detection accuracy
- ✅ All business rules enforced

### Week 8 (Validation & Analytics)
- ✅ Validation runs in <30 seconds
- ✅ Analytics update in real-time
- ✅ 90%+ mapping coverage achieved

---

## 🚀 Getting Started (Week 1)

### Day 1: Code List Page

**Ask Cursor AI**:
```
Create src/app/(dashboard)/codes/page.tsx with:

Design (Apple-inspired):
- Page title: "Code Management" (text-3xl font-semibold)
- Statistics cards (4 cards in grid):
  - Total Codes (count from DB)
  - Active Codes (where isActive = true)
  - Inactive Codes (where isActive = false)
  - Code Types (distinct count of codeType)
- Main content: shadcn/ui Table component
- Filters section:
  - Search input (debounced, searches code + description)
  - Code Type select (from CodeType enum)
  - Status toggle (Active/All)
- Pagination: 50 per page
- "Import Codes" button (Apple blue, top-right)

Functionality:
- Server Component fetching from Prisma CodeSet model
- Table columns: Code Value, Type, Description, Status, Effective Date
- Click row → open code detail dialog
- Real-time search with URL params
- Responsive design (mobile-friendly)

Technical:
- Use Prisma CodeSet model (@prisma/client)
- TypeScript with proper types
- Error boundary for error handling
- Loading skeleton for initial load
- Follow clean code principles from @.cursor/rules.md
- No hardcoded values (use constants)
- Generous Apple-inspired spacing (p-6, space-y-6)

API endpoint: GET /api/codes also needs to be created
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── codes/
│   │       ├── page.tsx                    # Main code list
│   │       ├── import/
│   │       │   └── page.tsx                # Import wizard
│   │       ├── mappings/
│   │       │   └── page.tsx                # Mapping overview
│   │       ├── analytics/
│   │       │   └── page.tsx                # Analytics dashboard
│   │       └── validate/
│   │           └── page.tsx                # Validation dashboard
│   └── api/
│       ├── codes/
│       │   ├── route.ts                    # GET (list), POST (create)
│       │   ├── [id]/
│       │   │   ├── route.ts                # GET, PUT, DELETE
│       │   │   └── mappings/
│       │   │       └── route.ts            # Mapping operations
│       │   ├── import/
│       │   │   └── route.ts                # POST (bulk import)
│       │   ├── validate/
│       │   │   └── route.ts                # GET (validation results)
│       │   └── analytics/
│       │       └── route.ts                # GET (analytics data)
│       └── benefit-segments/
│           └── route.ts                    # GET (list segments)
├── components/
│   ├── ui/                                 # shadcn/ui components
│   └── features/
│       └── codes/
│           ├── code-list.tsx
│           ├── code-filters.tsx
│           ├── code-detail-dialog.tsx
│           ├── code-mapping-dialog.tsx
│           ├── import-wizard.tsx
│           └── import-steps/
│               ├── step-1-upload.tsx
│               ├── step-2-mapping.tsx
│               ├── step-3-validation.tsx
│               └── step-4-results.tsx
├── lib/
│   ├── prisma.ts                           # Prisma client
│   ├── utils.ts                            # Utilities
│   ├── import-validator.ts                 # Import validation
│   └── validation-rules.ts                 # Business rules
├── services/
│   ├── code-service.ts                     # Code business logic
│   └── mapping-service.ts                  # Mapping business logic
└── types/
    ├── code.ts                             # Code-related types
    └── mapping.ts                          # Mapping-related types
```

---

## 🎯 Next Step

**Start with Week 1, Day 1**: Build the Code List page.

Once that's working, we'll move to Day 2 (Code Detail Dialog), then continue week by week until the Code Management System is complete.

**After Week 8**: We'll move to the Product List page (which will be simpler since it follows similar patterns).

---

**Ready to start?** Let me know when you want to begin Week 1, Day 1! 🚀

