# Code Schema Enhancement Proposal

## Problem Statement

**Current Issue:**  
The existing schema cannot distinguish between:
- **Standard codes** from CMS/official sources (CPT 99213)
- **Custom codes** that reference standards (WELLNESS-VISIT → CPT 99213)
- **Internal codes** for products/plans (HMO-GOLD-2024)

This creates ambiguity when users want to create custom business-friendly codes that map to standard medical codes.

---

## Proposed Solution

### Option 1: Add `codeSource` Field (RECOMMENDED)

```prisma
model Code {
  id                String            @id @default(cuid())
  
  // Core fields
  codeValue         String
  codeType          CodeType          // What category: CPT, ICD-10, etc.
  codeSource        CodeSource        // Where it came from: STANDARD, CUSTOM, INTERNAL
  description       String?
  isActive          Boolean           @default(true)
  
  // Reference to standard code (for CUSTOM codes)
  referencedCodeId  String?
  referencedCode    Code?             @relation("CodeReference", fields: [referencedCodeId], references: [id])
  customCodes       Code[]            @relation("CodeReference")
  
  // Relationships - Many-to-Many with Products and Plans
  productId         String?
  planId            String?
  product           Product?          @relation(fields: [productId], references: [id])
  plan              Plan?             @relation(fields: [planId], references: [id])
  
  // Audit fields
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  createdBy         String?
  updatedBy         String?
  
  @@unique([codeValue, codeType, codeSource])
  @@map("codes")
}

enum CodeType {
  CPT
  HCPCS
  ICD10
  NDC
  REVENUE
  PRODUCT_CODE
  PLAN_CODE
}

enum CodeSource {
  STANDARD      // Official codes from CMS, AMA, WHO, etc.
  CUSTOM        // User-created codes that reference standard codes
  INTERNAL      // Product/Plan codes (no external reference)
}
```

---

## Use Cases with New Schema

### Use Case 1: Standard Medical Code
```typescript
{
  codeValue: "99213",
  codeType: "CPT",
  codeSource: "STANDARD",
  description: "Office or other outpatient visit, established patient, level 3",
  referencedCodeId: null,  // No reference (this IS the standard)
}
```

### Use Case 2: Custom Code Referencing Standard
```typescript
{
  codeValue: "WELLNESS-VISIT-BASIC",
  codeType: "CPT",
  codeSource: "CUSTOM",
  description: "Basic wellness office visit for established patients",
  referencedCodeId: "xyz123",  // Points to standard CPT 99213
}
```

### Use Case 3: Custom Bundled Code
```typescript
{
  codeValue: "ANNUAL-CHECKUP-BUNDLE",
  codeType: "CPT",
  codeSource: "CUSTOM",
  description: "Annual checkup including basic visit and lab work",
  referencedCodeId: null,  // Could reference multiple codes via separate mapping table
}
```

### Use Case 4: Product Code
```typescript
{
  codeValue: "HMO-GOLD-2024-FL",
  codeType: "PRODUCT_CODE",
  codeSource: "INTERNAL",
  description: "HMO Gold Plan 2024 - Florida",
  referencedCodeId: null,  // No external reference
}
```

### Use Case 5: Plan Code
```typescript
{
  codeValue: "HMO-GOLD-2024-FL-SINGLE",
  codeType: "PLAN_CODE",
  codeSource: "INTERNAL",
  description: "HMO Gold 2024 FL - Single Coverage",
  referencedCodeId: null,
}
```

---

## UI Changes Required

### 1. Code Library - Add Source Column
```
| Code Value  | Type    | Source   | Description           | Referenced Code |
|-------------|---------|----------|-----------------------|-----------------|
| 99213       | CPT     | Standard | Office visit...       | -               |
| WELLNESS-V  | CPT     | Custom   | Basic wellness...     | 99213           |
| HMO-GOLD-24 | Product | Internal | HMO Gold Plan...      | -               |
```

### 2. Create Code Form - Enhanced
```
┌─────────────────────────────────────────────┐
│ Create New Code                             │
├─────────────────────────────────────────────┤
│ Code Source: [Dropdown ▼]                  │
│   • Standard (official CMS/AMA code)        │
│   • Custom (reference standard code)        │
│   • Internal (product/plan code)            │
│                                             │
│ Code Type: [Dropdown ▼]                    │
│   [Shows based on Source selection]         │
│                                             │
│ Code Value: [___________________]           │
│                                             │
│ Description: [___________________]          │
│                                             │
│ [If Source = Custom]                        │
│ Referenced Code: [Search standard codes...] │
│   Selected: CPT 99213 - Office visit        │
│                                             │
│ Status: ○ Active  ○ Inactive               │
│                                             │
│ [Cancel]  [Create Code]                    │
└─────────────────────────────────────────────┘
```

### 3. Filters - Add Source Filter
```
Filters:
  Code Type: [All Types ▼]
  Code Source: [All Sources ▼]  ← NEW
    • All
    • Standard
    • Custom
    • Internal
  Status: [All ▼]
```

---

## Migration Strategy

### Phase 1: Schema Update
```sql
-- Add new columns
ALTER TABLE codes ADD COLUMN "codeSource" TEXT;
ALTER TABLE codes ADD COLUMN "referencedCodeId" TEXT;

-- Set default values for existing codes
UPDATE codes 
SET "codeSource" = 
  CASE 
    WHEN "codeType" IN ('PRODUCT_CODE', 'PLAN_CODE') THEN 'INTERNAL'
    ELSE 'STANDARD'
  END
WHERE "codeSource" IS NULL;

-- Make codeSource NOT NULL after migration
ALTER TABLE codes ALTER COLUMN "codeSource" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE codes 
ADD CONSTRAINT "codes_referencedCodeId_fkey" 
FOREIGN KEY ("referencedCodeId") REFERENCES "codes"("id");

-- Update unique constraint
DROP INDEX IF EXISTS "codes_codeValue_codeType_key";
CREATE UNIQUE INDEX "codes_codeValue_codeType_codeSource_key" 
ON "codes"("codeValue", "codeType", "codeSource");
```

### Phase 2: Data Validation
```typescript
// Validate that CUSTOM codes have referencedCodeId
// Validate that STANDARD/INTERNAL codes don't have referencedCodeId
// Validate that referencedCodeId points to STANDARD codes only
```

### Phase 3: Update APIs
- Update GET /api/codes to include codeSource and referencedCode
- Update POST /api/codes to validate based on codeSource
- Update PUT /api/codes/[id] to handle reference changes
- Add GET /api/codes/standard for reference code selection

### Phase 4: Update UI Components
- Add source badges to code cards
- Update create/edit forms with conditional fields
- Add reference code selector component
- Update filters to include source

---

## Benefits

1. **Clear Distinction**: Immediately see if a code is official or custom
2. **Traceability**: Custom codes link back to standard codes
3. **Flexibility**: Create business-friendly code names
4. **Validation**: Enforce different rules based on source
5. **Reporting**: Analyze usage of custom vs. standard codes
6. **Compliance**: Maintain link to official codes for billing

---

## Alternative: Option 2 - Category Field

```prisma
model Code {
  // ... existing fields
  codeType     CodeType     // CPT, ICD-10, PRODUCT_CODE, PLAN_CODE
  codeCategory String?      // "STANDARD", "CUSTOM", "BUNDLE", etc.
  // ... rest of fields
}
```

**Why Option 1 is Better:**
- ✅ Enforced via enum (type safety)
- ✅ Clear semantics (source vs. category)
- ✅ Better for database indexes and queries
- ✅ Easier to validate and constrain

---

## Recommendation

**Implement Option 1** with `codeSource` enum:
- **Effort:** 13 story points (schema change + migration + UI updates)
- **Risk:** Low (additive change, backward compatible during migration)
- **Value:** High (enables custom code workflows, improves clarity)
- **Timeline:** 2 sprints (1 for backend/migration, 1 for UI)

---

## Next Steps

1. ✅ Review and approve schema design
2. ⬜ Create Prisma migration
3. ⬜ Update seed data with codeSource
4. ⬜ Update API routes to handle new fields
5. ⬜ Update TypeScript types
6. ⬜ Implement UI changes (forms, filters, badges)
7. ⬜ Write tests for new functionality
8. ⬜ Update documentation
9. ⬜ Deploy and monitor




