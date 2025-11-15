# Code Management - Answers to Planning Questions

## Question 1: What user stories are PRODUCT_CODE and PLAN_CODE associated with?

### Current State: ❌ **No Explicit User Stories**

PRODUCT_CODE and PLAN_CODE were added as enum values for future use but **were never tied to specific user stories**. This is a gap in our planning.

### Proposed User Stories:

**NEW - Story 3.2: Create Product and Plan Codes**
- **JIRA ID:** PBP-[TBD]
- **Priority:** P1 - High
- **Story Points:** 3
- **Location:** `CODE_MANAGEMENT_USER_STORIES.md` (lines 275-350)

```
As a Product Manager
I want to create product and plan codes
So that I can uniquely identify my insurance offerings
```

**Use Cases:**
1. Create unique identifiers for products (e.g., `HMO-GOLD-2024-FL`)
2. Create unique identifiers for plans (e.g., `HMO-GOLD-2024-FL-SINGLE`)
3. Use these codes in downstream systems (billing, claims, reporting)
4. Track products/plans across different lines of business

---

## Question 2: How do users associate internal codes to specific groupings?

### Current Problem: ❌ **Data Model Gap Identified**

**The Issue:**
```
Current Schema:
  codeType: "CPT"  →  Is this a standard CPT or a custom CPT?
  
We can't distinguish between:
  1. Standard CPT 99213 (from CMS)
  2. Custom "WELLNESS-VISIT" (references CPT 99213)
```

### Your Proposed Solution: ✅ **Add Code Category/Source**

**You're absolutely right!** We need a two-level classification:

```
Level 1: codeType     → WHAT it is (CPT, ICD-10, Revenue, etc.)
Level 2: codeSource   → WHERE it came from (Standard, Custom, Internal)
```

### Recommended Schema Change:

```prisma
model Code {
  codeValue         String
  codeType          CodeType       // CPT, ICD-10, HCPCS, etc.
  codeSource        CodeSource     // STANDARD, CUSTOM, INTERNAL
  description       String
  
  // For CUSTOM codes that reference standard codes
  referencedCodeId  String?
  referencedCode    Code?
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
  STANDARD      // Official codes from CMS/AMA/WHO
  CUSTOM        // User-created, references a standard code
  INTERNAL      // Product/Plan codes
}
```

### Example Use Cases:

**1. Standard Medical Code:**
```json
{
  "codeValue": "99213",
  "codeType": "CPT",
  "codeSource": "STANDARD",
  "description": "Office visit, established patient",
  "referencedCodeId": null
}
```

**2. Custom Code Referencing Standard:**
```json
{
  "codeValue": "WELLNESS-VISIT-BASIC",
  "codeType": "CPT",
  "codeSource": "CUSTOM",
  "description": "Basic wellness office visit",
  "referencedCodeId": "code_xyz123"  // → Links to CPT 99213
}
```

**3. Product Code:**
```json
{
  "codeValue": "HMO-GOLD-2024-FL",
  "codeType": "PRODUCT_CODE",
  "codeSource": "INTERNAL",
  "description": "HMO Gold Plan 2024 - Florida",
  "referencedCodeId": null
}
```

### UI Changes for Manual Creation:

**Updated Create Code Form:**
```
┌────────────────────────────────────────┐
│ Create New Code                        │
├────────────────────────────────────────┤
│ Step 1: Choose Code Source            │
│   ○ Standard (official CMS/AMA code)   │
│   ● Custom (reference standard code)   │ ← Selected
│   ○ Internal (product/plan code)       │
├────────────────────────────────────────┤
│ Step 2: Choose Code Type (Category)   │
│   Code Category: [CPT ▼]              │ ← Dropdown shows: CPT, ICD-10, HCPCS...
├────────────────────────────────────────┤
│ Step 3: Define Your Code              │
│   Code Value: [WELLNESS-VISIT-BASIC]   │
│   Description: [Basic wellness...]     │
│                                        │
│ Step 4: Link to Standard Code         │ ← Only shown if Source = Custom
│   Referenced Code: [Search... 🔍]      │
│     Selected: CPT 99213 - Office visit │
├────────────────────────────────────────┤
│ [Cancel]  [Create Code]               │
└────────────────────────────────────────┘
```

**Mapping Flow:**
```
Code Category Dropdown Options for Manual Creation:
  (Same as Code Types for consistency)
  
  If codeSource = STANDARD or CUSTOM:
    • CPT
    • HCPCS
    • ICD-10
    • NDC
    • Revenue
  
  If codeSource = INTERNAL:
    • PRODUCT_CODE
    • PLAN_CODE
```

---

## Question 3: User Stories in Gherkin Format

### Answer: ✅ **CREATED - See `CODE_MANAGEMENT_USER_STORIES.md`**

**Full Gherkin user stories have been created for:**

| Feature | Stories | Story Points | Priority |
|---------|---------|--------------|----------|
| Browse & Search Codes | 1 | 3 | P0 |
| Import Codes via CSV/Excel | 1 | 8 | P0 |
| Create Custom Codes | 2 | 8 | P1 |
| Map Codes to Products/Plans | 1 | 8 | P0 |
| Code Analytics & Reporting | 1 | 5 | P2 |
| **Code Source Classification** | 1 | 13 | P0 |
| **TOTAL** | **7** | **45** | - |

### Key Stories for Your Questions:

**Story 3.1: Create Custom Code Referencing Standard Code**
- **File:** `CODE_MANAGEMENT_USER_STORIES.md` (lines 199-274)
- Covers: How users create custom codes and link them to standards
- Includes: Validation, search, auto-fill scenarios

**Story 3.2: Create Product and Plan Codes**
- **File:** `CODE_MANAGEMENT_USER_STORIES.md` (lines 275-350)
- Covers: PRODUCT_CODE and PLAN_CODE creation
- Includes: Naming conventions, validation rules

**Story 6.1: Implement Code Source Classification**
- **File:** `CODE_MANAGEMENT_USER_STORIES.md` (lines 509-616)
- Covers: The architecture change for codeSource
- Includes: Schema, UI, filtering, badges

---

## Summary: What We Need to Do

### Immediate Actions:

1. **Schema Enhancement** (13 story points)
   - Add `codeSource` enum field
   - Add `referencedCodeId` foreign key
   - Update unique constraints
   - Create migration script

2. **API Updates** (5 story points)
   - Update GET /api/codes to return codeSource
   - Update POST /api/codes to validate based on source
   - Add reference code search endpoint
   - Update import logic

3. **UI Updates** (8 story points)
   - Add "Code Source" column to Code Library
   - Update Create/Edit forms with conditional fields
   - Add reference code selector component
   - Add source badges (Standard, Custom, Internal)
   - Update filters to include source

4. **Documentation & JIRA** (2 story points)
   - Create Epic: "Code Management System"
   - Add all 7 user stories to JIRA
   - Link Gherkin scenarios as acceptance criteria
   - Tag with component: "code-management"

### JIRA Integration Checklist:

- [ ] Create Epic: PBP-XXX "Code Management System"
- [ ] Create Story: PBP-XXX+1 "Browse Standard Medical Codes" (3 pts)
- [ ] Create Story: PBP-XXX+2 "Bulk Import Codes via CSV" (8 pts)
- [ ] Create Story: PBP-XXX+3 "Create Custom Code w/ Reference" (5 pts)
- [ ] Create Story: PBP-XXX+4 "Create Product and Plan Codes" (3 pts)
- [ ] Create Story: PBP-XXX+5 "Map Codes to Products/Plans" (8 pts)
- [ ] Create Story: PBP-XXX+6 "Code Usage Analytics" (5 pts)
- [ ] Create Story: PBP-XXX+7 "Implement Code Source Classification" (13 pts)
- [ ] Link all stories to Epic
- [ ] Add Gherkin scenarios as acceptance criteria
- [ ] Set priorities (P0, P1, P2)
- [ ] Assign to sprints based on dependencies

---

## Files Created for You:

1. **`CODE_MANAGEMENT_USER_STORIES.md`**
   - Complete Gherkin scenarios for all 7 stories
   - Background, Given/When/Then format
   - Validation rules, error cases, edge cases
   - Security and performance scenarios

2. **`CODE_SCHEMA_ENHANCEMENT_PROPOSAL.md`**
   - Detailed schema design with `codeSource`
   - Use cases for Standard, Custom, Internal codes
   - Migration strategy (SQL scripts)
   - UI mockups and component changes
   - Benefits and risk analysis

3. **`CODE_MANAGEMENT_ANSWERS.md`** (this file)
   - Summary of your 3 questions
   - Current state vs. proposed solution
   - Action items and JIRA checklist

---

## Next Steps:

**Do you want me to:**

1. **Implement the schema changes now?**
   - Create Prisma migration for `codeSource`
   - Update seed data
   - Update API routes

2. **Update the UI for the new fields?**
   - Add source column
   - Update create form
   - Add filters

3. **Focus on something else first?**
   - Product Catalog
   - Benefits Configuration
   - Something else

**Let me know and I'll execute!** 🚀




