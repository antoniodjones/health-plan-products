# Refactor Analysis & Recovery Plan

## Problem Statement
The application has no data showing despite having 58 codes in the database. We've been making incremental fixes without addressing the root cause.

## Root Cause Analysis

### 1. **Schema Mismatch Between Frontend Types & Database**

**Database Schema (`CodeSet` model):**
```prisma
model CodeSet {
  code            String
  codeType        CodeType
  description     String
  isActive        Boolean        // ✅ Database field
  effectiveDate   DateTime
  terminationDate DateTime?      // ✅ Database field
  version         String
  sourceSystem    String?        // ✅ Database field
  // NO status, source, expirationDate, isCustom, customCodePrefix
}
```

**Frontend Types (`MedicalCode` interface):**
```typescript
export interface MedicalCode {
  status: CodeStatus;           // ❌ Doesn't exist in DB
  source: CodeSource;           // ❌ Doesn't exist in DB
  expirationDate?: Date | null; // ❌ Doesn't exist in DB
  isCustom: boolean;            // ❌ Doesn't exist in DB
  customCodePrefix?: string;    // ❌ Doesn't exist in DB
  // Also has: isActive, terminationDate, sourceSystem, version
}
```

**Result:** Frontend expects fields that don't exist, causing type mismatches everywhere.

---

### 2. **Validation Schema Mismatch**

**Current Validation (`src/lib/validations/code.ts`):**
- Still references `CodeStatus` and `CodeSource` enums
- Tries to validate fields that don't exist in database
- API routes fail validation before even querying database

---

### 3. **API Route Issues**

**`/api/codes/route.ts`:**
- Parses query params for fields that don't exist
- Validation fails silently
- Returns 400/500 errors instead of data

---

### 4. **Dev Server Not Running**

- Background process crashed
- No error visibility
- Browser showing stale/cached errors

---

## Refactor Strategy

### Phase 1: Align Types with Database Schema (1 hour)

**Goal:** Make frontend types match the actual Prisma schema exactly.

**Actions:**
1. **Simplify `MedicalCode` interface** - Remove all non-existent fields
2. **Update `CodeFilters` interface** - Use only database fields
3. **Fix `CodeStatistics` interface** - Match actual query results
4. **Remove unused enums** - `CodeStatus`, `CodeSource` if not in Prisma

**Files to Update:**
- `src/types/codes.ts` - Complete rewrite based on Prisma schema
- `src/lib/validations/code.ts` - Remove invalid field validations
- `src/lib/db/codes.ts` - Ensure queries only use real fields

---

### Phase 2: Simplify API Routes (30 min)

**Goal:** Remove all validation complexity, just query and return data.

**Actions:**
1. **Simplify `/api/codes/route.ts`** - Basic pagination only
2. **Simplify `/api/codes/statistics/route.ts`** - Direct Prisma queries
3. **Add proper error logging** - See what's actually failing

**Approach:**
```typescript
// Simple, working API
export async function GET(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize = 20;
    
    const [codes, total] = await Promise.all([
      prisma.codeSet.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { code: 'asc' }
      }),
      prisma.codeSet.count()
    ]);
    
    return NextResponse.json({
      codes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### Phase 3: Simplify Frontend Components (30 min)

**Goal:** Display data without complex filtering/sorting initially.

**Actions:**
1. **Simplify `/app/codes/page.tsx`** - Remove filters, just show list
2. **Fix statistics display** - Use actual returned fields
3. **Remove complex state management** - Basic fetch & display

---

### Phase 4: Test & Verify (15 min)

**Actions:**
1. **Restart dev server** - Fresh start
2. **Test API directly** - `curl http://localhost:3000/api/codes`
3. **Verify browser** - Check console for actual errors
4. **Confirm data displays** - See the 58 codes

---

### Phase 5: Re-add Features Incrementally (1-2 hours)

**Only after basic display works:**
1. Add search functionality
2. Add type filtering
3. Add sorting
4. Add pagination controls
5. Add statistics cards

---

## Implementation Priority

### IMMEDIATE (Do Now):
1. ✅ Stop dev server completely
2. ✅ Create simplified type definitions
3. ✅ Create minimal working API route
4. ✅ Create minimal working page component
5. ✅ Test end-to-end

### NEXT (After working):
6. Add search
7. Add filters
8. Add sorting
9. Polish UI

### LATER (Nice to have):
10. Import wizard
11. Custom codes
12. Advanced filtering

---

## Key Principles for Refactor

1. **Database is Source of Truth** - Types must match Prisma schema exactly
2. **Start Simple** - Get basic CRUD working before adding features
3. **Test Each Layer** - API, then UI, then features
4. **Remove Abstractions** - Direct Prisma queries, no complex helpers
5. **Log Everything** - Console.log at every step to see what's happening

---

## Files That Need Complete Rewrite

### Critical:
- [ ] `src/types/codes.ts` - Align with Prisma
- [ ] `src/lib/validations/code.ts` - Remove invalid fields
- [ ] `src/lib/db/codes.ts` - Simplify queries
- [ ] `src/app/api/codes/route.ts` - Minimal working version
- [ ] `src/app/codes/page.tsx` - Minimal working version

### Can Wait:
- `src/components/codes/*` - After basic display works
- `src/app/api/codes/[id]/*` - After list works
- Import/export features - Much later

---

## Success Criteria

**Phase 1 Complete When:**
- [ ] Dev server starts without errors
- [ ] `/api/codes` returns JSON with 58 codes
- [ ] Browser displays list of codes
- [ ] No TypeScript errors
- [ ] No console errors

**Phase 2 Complete When:**
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Pagination works

---

## Estimated Time

- **Phase 1 (Get Working):** 2 hours
- **Phase 2 (Add Features):** 2 hours
- **Total:** 4 hours for fully functional code library

---

## Next Steps

1. **STOP** - Kill all running processes
2. **SIMPLIFY** - Rewrite core files with minimal code
3. **TEST** - Verify each layer works
4. **BUILD** - Add features one at a time
5. **VERIFY** - Test after each addition

---

## Notes

- We've been fixing symptoms, not the disease
- The core issue is type/schema mismatch
- Need to rebuild from database schema up
- Keep it simple until it works
- Then add complexity incrementally

