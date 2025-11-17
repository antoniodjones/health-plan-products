# 🚀 Pre-Staging Comprehensive Plan

**Date:** November 15, 2025  
**Goal:** Prepare application for QA staging environment  
**Timeline:** 2-3 days  

---

## 📋 **Overview**

This plan covers all critical work before deploying to staging for QA testing:

1. ✅ **Code Quality & Functionality**
2. 📱 **Design System Review**
3. 📚 **Documentation Suite**
4. 🏗️ **Staging Environment Setup**
5. 🔗 **Jira Integration**

---

## PHASE 1: CODE QUALITY & FUNCTIONALITY (Day 1, 4-6 hours)

### **1.1 Fix TypeScript Warnings**
**Time:** 5 minutes  
**Priority:** High  

**Issues:**
- `src/app/layout.tsx:3` - Remove unused `Metadata` import
- `src/app/codes/page.tsx:14` - Remove unused `DialogDescription` import

**Action:**
```typescript
// Fix layout.tsx
- import { Inter } from 'next/font/google', { Metadata }
+ import { Inter } from 'next/font/google'

// Fix codes/page.tsx
- import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
+ import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
```

---

### **1.2 Test All Buttons & Interactive Components**
**Time:** 2 hours  
**Priority:** Critical  

#### **Dashboard Page** (`/dashboard`)
- [ ] Quick Actions - All 4 cards clickable
- [ ] Recent Activity - View details links
- [ ] Alert cards - Action buttons
- [ ] Navigation - All sidebar links work

#### **Products Page** (`/products`)
- [ ] Create Product button - Opens form modal
- [ ] Search - Real-time filtering
- [ ] Status filter - Filters products
- [ ] View Details - Opens detail modal
- [ ] Edit button - Opens edit form
- [ ] Delete button - Shows confirmation dialog

#### **Code Library Page** (`/codes`)
- [ ] ✅ Search - WORKING
- [ ] ✅ Filters - WORKING
- [ ] ✅ Sort columns - WORKING
- [ ] ✅ View Details - WORKING
- [ ] Import Codes button - Opens import wizard
- [ ] Export CSV button - Downloads file
- [ ] Create Code button - Opens create form

#### **Quality Measures Page** (`/quality-measures`)
- [ ] ✅ Search - WORKING
- [ ] ✅ Filters - WORKING
- [ ] ✅ View Details - WORKING
- [ ] ✅ Edit Logic button - WORKING
- [ ] Create Measure button - Opens create form
- [ ] Export button - Downloads data
- [ ] Refresh button - Reloads data
- [ ] Add to Product - Opens selection modal

#### **Value Sets Page** (`/value-sets`)
- [ ] ✅ Search - WORKING
- [ ] ✅ View Codes - WORKING
- [ ] ✅ Add/Remove codes - WORKING
- [ ] Create Value Set button - Opens form
- [ ] Import CSV - Opens import dialog
- [ ] Export CSV - Downloads file
- [ ] Delete button - Shows confirmation

#### **Code Mappings Page** (`/mappings`)
- [ ] ✅ Tab switching - WORKING
- [ ] ✅ Search equivalencies - WORKING
- [ ] ✅ Statistics display - WORKING
- [ ] **Create Equivalency button** - TO IMPLEMENT
- [ ] **Create Mapping button** - TO IMPLEMENT
- [ ] **Bulk Map Codes** - TO IMPLEMENT
- [ ] Edit button - Opens edit form
- [ ] Delete button - Shows confirmation
- [ ] View details - Opens detail modal

#### **Analytics Page** (`/analytics`)
- [ ] Date range picker - Filters data
- [ ] Export Report - Downloads PDF/CSV
- [ ] Refresh button - Reloads charts
- [ ] Chart interactions - Drill-downs work

---

### **1.3 Implement Missing Forms**
**Time:** 2-3 hours  
**Priority:** High  

#### **Create Equivalency Form**
```typescript
// src/components/mappings/create-equivalency-dialog.tsx
- Name, description, category
- Source code selection (searchable)
- Target code selection (searchable)
- Relationship type (EXACT, BROADER, etc.)
- Confidence slider (0-100%)
- Bidirectional toggle
- Save & Cancel buttons with toast feedback
```

#### **Create Benefit Mapping Form**
```typescript
// src/components/mappings/create-benefit-mapping-dialog.tsx
- Code selection (searchable)
- Benefit segment selection
- Priority slider
- Rules configuration (JSON editor)
- Save & Cancel buttons with toast feedback
```

#### **Create Product Form** (if time permits)
```typescript
// src/components/products/create-product-dialog.tsx
- Product ID, name, description
- Line of business, market type, plan type
- Effective/termination dates
- Status selection
- Save as draft or active
```

---

### **1.4 Add Toast Notifications**
**Time:** 1 hour  
**Priority:** High  

**Integrate `useToast` hook into:**
- [ ] Create/Edit/Delete actions (all pages)
- [ ] Import/Export operations
- [ ] Save operations (measure logic, value sets)
- [ ] Validation errors
- [ ] Network errors

**Example Integration:**
```typescript
const { addToast } = useToast();

const handleCreate = async () => {
  try {
    await createEquivalency(data);
    addToast('Equivalency created successfully!', 'success');
  } catch (error) {
    addToast('Failed to create equivalency', 'error');
  }
};
```

---

### **1.5 Add Confirmation Dialogs**
**Time:** 30 minutes  
**Priority:** High  

**Integrate `useConfirm` hook for:**
- [ ] Delete equivalency
- [ ] Delete mapping
- [ ] Delete measure
- [ ] Delete value set
- [ ] Delete product
- [ ] Remove codes from value sets
- [ ] Discard unsaved changes

**Example Integration:**
```typescript
const { confirm } = useConfirm();

const handleDelete = async (id: string) => {
  const confirmed = await confirm(
    'Are you sure you want to delete this equivalency?',
    'This action cannot be undone.',
    'danger'
  );
  
  if (confirmed) {
    await deleteEquivalency(id);
    addToast('Equivalency deleted', 'success');
  }
};
```

---

## PHASE 2: DESIGN SYSTEM REVIEW (Day 1-2, 3-4 hours)

### **2.1 Review Current Design System**
**Time:** 1 hour  
**Priority:** High  

**Current Files:**
- `CAPS_Enterprise_Design_System.md` (existing)
- `CAPS_Journey_Color_System.md` (existing)
- `BRAND_COLORS.md` (custom orange, blue, green)
- `tailwind.config.ts` (implementation)

**Review Checklist:**
- [ ] Color consistency across all pages
- [ ] Typography hierarchy (headings, body, labels)
- [ ] Spacing consistency (padding, margins, gaps)
- [ ] Button variants (primary, secondary, danger, ghost)
- [ ] Card styles (borders, shadows, hover states)
- [ ] Input field styles (text, select, checkbox, radio)
- [ ] Icon usage and sizing
- [ ] Loading states and skeletons
- [ ] Empty states and placeholders

---

### **2.2 Design System Audit**
**Time:** 2 hours  
**Priority:** Medium  

**Audit Each Page:**

| Page | Colors | Typography | Spacing | Components | Issues |
|------|--------|------------|---------|------------|--------|
| Dashboard | ✅ | ✅ | ⚠️ | ✅ | Inconsistent card padding |
| Products | ⚠️ | ✅ | ✅ | ⚠️ | Status badges need colors |
| Codes | ✅ | ✅ | ✅ | ✅ | None |
| Quality Measures | ✅ | ✅ | ✅ | ✅ | None |
| Value Sets | ✅ | ✅ | ✅ | ✅ | None |
| Mappings | ✅ | ✅ | ✅ | ✅ | None |
| Analytics | ⏳ | ⏳ | ⏳ | ⏳ | TBD |

**Action Items:**
- [ ] Document inconsistencies
- [ ] Create design tokens file
- [ ] Update components to use tokens
- [ ] Verify WCAG 2.1 AA compliance

---

### **2.3 Refine Design System**
**Time:** 1-2 hours  
**Priority:** Medium  

**Create/Update:**

#### **Design Tokens File**
```typescript
// src/styles/tokens.ts
export const tokens = {
  colors: {
    brand: {
      orange: '#FF9834',
      blue: '#0EA5E9',
      green: '#22C51E',
    },
    journey: {
      prospect: '#8B5CF6',    // Purple
      applicant: '#3B82F6',   // Blue
      enrollment: '#10B981',  // Green
      newMember: '#F59E0B',   // Amber
      activating: '#EF4444',  // Red
      engaged: '#06B6D4',     // Cyan
    },
    semantic: {
      success: '#22C51E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
    },
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },
};
```

#### **Component Library Documentation**
```markdown
# Component Library (UPDATED)

## Buttons
- Primary: Brand orange, white text
- Secondary: Gray outline, gray text
- Danger: Red background, white text
- Ghost: Transparent, gray text

## Cards
- Border: 1px solid gray-200
- Shadow: sm on hover
- Padding: 1.5rem
- Radius: 0.5rem

## Status Badges
- Active: Green background
- Inactive: Gray background
- Draft: Yellow background
- Pending: Blue background
```

---

## PHASE 3: DOCUMENTATION SUITE (Day 2, 4-6 hours)

### **3.1 Jira Integration**
**Time:** 1 hour  
**Priority:** Critical  

#### **A. Create Jira Project Structure**
```
Project: HPBP (Health Plan Benefits Platform)

Epic Structure:
├── HPBP-1: Epic 1 - Code Management System ✅ COMPLETE
├── HPBP-6: Epic 6 - Quality Measures ✅ COMPLETE
├── HPBP-8: Epic 8 - Code Equivalency ✅ COMPLETE
├── HPBP-2: Epic 2 - Product Catalog (NEXT)
└── HPBP-3-12: Future Epics

Story Types:
- Epic (highest level)
- User Story (feature)
- Task (technical work)
- Bug (defects)
- Spike (research)
```

#### **B. Map GitHub PRs to Jira Tickets**
```
PR Naming Convention:
HPBP-XXX: Brief description

Examples:
- HPBP-101: Add Code Library search functionality
- HPBP-102: Implement Quality Measures API
- HPBP-103: Create Code Mappings UI
```

#### **C. Configure GitHub-Jira Integration**
```yaml
# .github/workflows/jira-sync.yml
name: Jira Sync
on:
  pull_request:
    types: [opened, edited, closed]
  
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Extract Jira Issue
        id: jira
        run: |
          PR_TITLE="${{ github.event.pull_request.title }}"
          ISSUE_KEY=$(echo $PR_TITLE | grep -oP 'HPBP-\d+')
          echo "issue_key=$ISSUE_KEY" >> $GITHUB_OUTPUT
      
      - name: Update Jira Issue
        uses: atlassian/gajira-transition@v2
        with:
          issue: ${{ steps.jira.outputs.issue_key }}
          transition: "In Review"
```

#### **D. Backfill Existing Work**
```
Tasks:
1. Create Epics in Jira (HPBP-1, HPBP-6, HPBP-8)
2. Create User Stories from Gherkin files
3. Link completed PRs retroactively
4. Update Epic status to "Done"
5. Add acceptance criteria from user stories
```

---

### **3.2 Business User Documentation**
**Time:** 2-3 hours  
**Priority:** High  

#### **A. Product/Feature Training Guide**
```markdown
File: BUSINESS_USER_GUIDE.md

# Health Plan Products & Benefits Platform
## Business User Guide

### Table of Contents
1. Getting Started
2. Dashboard Overview
3. Managing Medical Codes
4. Quality Measures Management
5. Code Mappings & Equivalencies
6. Product Catalog (Coming Soon)
7. FAQs & Troubleshooting

### 1. Getting Started

#### What is this platform?
This platform helps you manage health plan products by:
- Organizing medical billing codes (ICD-10, CPT, HCPCS)
- Managing quality measures (HEDIS, MIPS)
- Creating code equivalencies across systems
- Building benefit packages (coming soon)

#### Who should use this?
- Product Managers
- Clinical Staff
- Compliance Teams
- Actuaries
- QA Testers

#### How to access
1. Navigate to: [staging URL]
2. Login with your credentials
3. You'll land on the Dashboard

---

### 2. Dashboard Overview

#### Key Metrics Cards
- **Total Codes**: Shows count of medical codes in system
- **Quality Measures**: Active HEDIS/MIPS measures
- **Code Mappings**: Equivalencies and benefit mappings
- **Products**: Health plan products (coming soon)

#### Quick Actions
- Import Codes: Upload CSV of new medical codes
- Create Measure: Add new quality measure
- View Analytics: See usage reports

---

### 3. Managing Medical Codes

#### Viewing Codes
1. Click "Code Library" in sidebar
2. Browse 58+ medical codes
3. Use search to find specific codes
4. Filter by type (ICD-10, CPT, HCPCS)

#### Understanding Code Details
- **Code**: The billing code (e.g., "83036")
- **Type**: Code system (CPT, ICD-10, etc.)
- **Description**: What the code represents
- **Category**: Clinical grouping
- **Status**: Active/Inactive
- **Effective Date**: When code became valid

#### Importing Codes
1. Click "Import Codes"
2. Download CSV template
3. Fill in code details
4. Upload file
5. Review validation results
6. Confirm import

---

### 4. Quality Measures Management

#### What are Quality Measures?
Quality measures (HEDIS, MIPS) track healthcare quality:
- Diabetes screening (CDC-H9)
- Colorectal cancer screening (COL)
- Breast cancer screening (BCS)

#### Viewing Measures
1. Click "Quality Measures" in sidebar
2. See 5 HEDIS measures
3. Filter by program, domain, status
4. Click measure to see details

#### Measure Logic
Each measure has:
- **Denominator**: Who qualifies for measure
- **Numerator**: Who met the quality goal
- **Exclusions**: Who doesn't count

Example: CDC-H9 (Diabetes HbA1c Test)
- Denominator: Patients with diabetes (ICD-10 E11.9)
- Numerator: Had HbA1c test (CPT 83036)
- Exclusions: Hospice patients

#### Configuring Measure Logic
1. Open measure details
2. Click "Edit Logic"
3. Add/edit rules for each logic type
4. Select value sets (code groups)
5. Save changes

---

### 5. Code Mappings & Equivalencies

#### Two Types of Mappings

**A. Benefit Mappings** (Coming Soon)
Maps codes to benefit coverage:
- CPT 83036 → Covered under "Lab Tests"
- ICD-10 E11.9 → Eligible for "Diabetes Program"

**B. Code Equivalencies** (Live Now)
Maps equivalent codes across systems:
- CPT 83036 ↔ LOINC 4548-4 (both represent HbA1c test)
- Prevents duplicate tracking
- Enables EMR data integration

#### Viewing Equivalencies
1. Click "Mappings" in sidebar
2. Click "Equivalency Mappings" tab
3. See 3 equivalencies:
   - HbA1c Test
   - Lipid Panel
   - Office Visit

#### Understanding Equivalency Details
- **Name**: What the equivalency represents
- **Category**: LABORATORY, PROCEDURE, etc.
- **Source**: How it was created (MANUAL, CMS)
- **Confidence**: How accurate (95-100%)
- **Codes**: The equivalent codes

#### Creating New Equivalency
1. Click "Create Equivalency"
2. Enter name & description
3. Select source code (e.g., CPT 83036)
4. Select target code (e.g., LOINC 4548-4)
5. Choose relationship (EXACT, BROADER, etc.)
6. Set confidence level
7. Save

---

### 6. FAQs

**Q: Can I delete a code?**
A: No, codes are deactivated, not deleted (audit trail)

**Q: How often are measures updated?**
A: HEDIS measures update annually

**Q: Can I create custom codes?**
A: Yes (coming in next release)

**Q: How do I report a bug?**
A: Contact support@yourcompany.com
```

---

### **3.3 Technical Documentation**
**Time:** 2 hours  
**Priority:** High  

#### **A. Engineering Implementation Guide**
```markdown
File: TECHNICAL_DOCUMENTATION.md

# Technical Documentation
## Health Plan Products & Benefits Platform

### Architecture Overview

#### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Library**: Shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (GCP Cloud SQL)
- **ORM**: Prisma
- **Deployment**: GCP Cloud Run
- **CI/CD**: GitHub Actions

#### Project Structure
```
health-plan-products/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Code seeding
│   ├── seed-quality-measures.ts
│   └── seed-direct.js         # Equivalency seeding
├── src/
│   ├── app/                   # Next.js pages
│   │   ├── dashboard/
│   │   ├── codes/
│   │   ├── quality-measures/
│   │   ├── value-sets/
│   │   ├── mappings/
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn components
│   │   ├── codes/
│   │   ├── quality-measures/
│   │   └── mappings/
│   ├── lib/
│   │   ├── db/              # Database functions
│   │   ├── validations/     # Zod schemas
│   │   └── utils/           # Utilities
│   ├── types/               # TypeScript types
│   └── hooks/               # React hooks
└── MD Files/                # Product docs
```

---

### Database Schema

#### Core Models

**CodeSet** (Medical Codes)
```prisma
model CodeSet {
  id              String         @id @default(uuid())
  code            String         // "83036"
  codeType        CodeType       // CPT, ICD_10, HCPCS
  description     String
  category        String?
  isActive        Boolean        @default(true)
  effectiveDate   DateTime
  terminationDate DateTime?
  
  mappings              CodeMapping[]
  valueSetCodes         ValueSetCode[]
  sourceEquivalencies   EquivalencyMapping[]
  targetEquivalencies   EquivalencyMapping[]
  
  @@unique([code, codeType, version])
  @@map("code_sets")
}
```

**QualityMeasure** (HEDIS/MIPS)
```prisma
model QualityMeasure {
  id          String         @id @default(uuid())
  measureId   String         @unique // "CDC-H9"
  name        String
  description String
  program     QualityProgram // HEDIS, MIPS
  domain      MeasureDomain  // Effectiveness_of_Care
  status      MeasureStatus  // ACTIVE, RETIRED
  steward     String         // "NCQA"
  
  logic           MeasureLogic[]
  productMeasures ProductMeasure[]
  
  @@map("quality_measures")
}
```

**CodeEquivalency** (Epic 8)
```prisma
model CodeEquivalency {
  id          String   @id @default(uuid())
  name        String   // "HbA1c Test"
  description String
  category    EquivalencyCategory // LABORATORY
  source      EquivalencySource   // MANUAL, CMS_CROSSWALK
  confidence  Float    @default(1.0)
  
  mappings EquivalencyMapping[]
  
  @@map("code_equivalencies")
}
```

---

### API Routes

#### Code Management

**GET /api/codes**
```typescript
// Search & list codes
Query Params:
  - search: string (optional)
  - codeType: CodeType[] (optional)
  - category: string (optional)
  - isActive: boolean (optional)
  - page: number (default: 1)
  - pageSize: number (default: 25)

Response:
{
  codes: CodeSet[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

**GET /api/codes/[id]**
```typescript
// Get single code
Response: CodeSet
```

**GET /api/codes/statistics**
```typescript
// Aggregate stats
Response:
{
  totalCodes: number,
  activePercent: number,
  byType: Record<CodeType, number>,
  byCategory: Record<string, number>
}
```

---

#### Quality Measures

**GET /api/quality-measures**
```typescript
// Search & list measures
Query Params:
  - query: string (optional)
  - program: QualityProgram[] (optional)
  - domain: MeasureDomain[] (optional)
  - status: MeasureStatus[] (optional)
  - page: number (default: 1)
  - pageSize: number (default: 25)

Response:
{
  measures: QualityMeasure[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

**GET /api/quality-measures/[id]**
```typescript
// Get measure with logic
Response: QualityMeasure & {
  logic: MeasureLogic[]
}
```

**PUT /api/quality-measures/[id]/logic**
```typescript
// Update measure logic
Body: {
  logicType: LogicType, // DENOMINATOR, NUMERATOR
  rules: LogicRule[]
}

Response: MeasureLogic
```

---

#### Code Equivalencies

**GET /api/code-equivalencies**
```typescript
// Search equivalencies
Query Params:
  - query: string (optional)
  - category: EquivalencyCategory (optional)
  - source: EquivalencySource (optional)
  - minConfidence: number (optional)
  - page: number (default: 1)
  - pageSize: number (default: 25)

Response:
{
  equivalencies: CodeEquivalency[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

**POST /api/code-equivalencies**
```typescript
// Create equivalency
Body: {
  name: string,
  description: string,
  category: EquivalencyCategory,
  source: EquivalencySource,
  confidence: number, // 0.0-1.0
  mappings: [{
    sourceCodeId: string,
    targetCodeId: string,
    relationship: EquivalencyRelationship,
    bidirectional: boolean
  }]
}

Response: CodeEquivalency
```

**GET /api/code-equivalencies/lookup**
```typescript
// Find equivalent codes
Query Params:
  - code: string (required)
  - system: CodeType (required)

Response: {
  sourceCode: CodeSet,
  equivalencies: Array<{
    equivalency: CodeEquivalency,
    targetCodes: CodeSet[]
  }>
}
```

---

### Development Workflow

#### Setup
```bash
# Clone repo
git clone https://github.com/antoniodjones/health-plan-products.git
cd health-plan-products

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local
# Edit .env.local with database credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed data
npm run db:seed        # Medical codes
npm run db:seed:quality # Quality measures
node seed-direct.js     # Code equivalencies

# Start dev server
npm run dev
```

#### Making Changes
```bash
# Create feature branch
git checkout -b HPBP-XXX-feature-name

# Make changes
# Test locally

# Commit with Jira ticket
git commit -m "HPBP-XXX: Description"

# Push and create PR
git push origin HPBP-XXX-feature-name
```

#### Database Changes
```bash
# Update prisma/schema.prisma

# Generate migration (production)
npx prisma migrate dev --name descriptive_name

# Or push directly (development)
npx prisma db push

# Regenerate client
npx prisma generate

# Restart dev server
npm run dev
```

---

### Testing

#### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Search works on all pages
- [ ] Filters apply correctly
- [ ] Pagination works
- [ ] Create forms validate input
- [ ] Edit forms pre-populate data
- [ ] Delete shows confirmation
- [ ] Toast notifications appear
- [ ] Loading states show during async ops
- [ ] Responsive on mobile/tablet/desktop

#### API Testing
```bash
# Using curl
curl http://localhost:3000/api/codes
curl http://localhost:3000/api/quality-measures
curl http://localhost:3000/api/code-equivalencies/statistics

# Using Postman
Import: docs/postman-collection.json
```

---

### Deployment

#### Staging (Auto-deploy on push to `develop`)
```yaml
# .github/workflows/staging.yml
- Runs on: push to develop
- Environment: staging
- URL: https://staging-hpbp.run.app
- Database: code_management_staging
```

#### Production (Manual approval)
```yaml
# .github/workflows/production.yml
- Runs on: push to main
- Requires: Manual approval
- Environment: production
- URL: https://hpbp.yourcompany.com
- Database: code_management_prod
```

---

### Troubleshooting

#### Dev Server Won't Start
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Regenerate Prisma client
npx prisma generate

# Restart
npm run dev
```

#### Database Connection Errors
```bash
# Check .env.local
cat .env.local | grep DATABASE_URL

# Test connection
npx prisma db pull

# Whitelist IP in GCP
# Cloud SQL → Connections → Authorized networks
```

#### Prisma Client Errors
```bash
# Regenerate client
npx prisma generate

# Push schema
npx prisma db push

# Restart server
```
```

---

### **3.4 Glossary of Terms**
**Time:** 30 minutes  
**Priority:** High  

```markdown
File: GLOSSARY.md

# Glossary of Terms
## Health Plan Products & Benefits Platform

### A

**Actuarial**: Related to insurance mathematics and risk assessment

**Active Status**: A code, measure, or product currently in use

**API (Application Programming Interface)**: Software interface for communication between systems

**Authorization**: Pre-approval required for certain medical services

---

### B

**Benefit**: A covered service or item in a health plan

**Benefit Mapping**: Linking medical codes to benefit coverage rules

**Benefit Segment**: A group of related benefits (e.g., "Preventive Care")

**BCS**: Breast Cancer Screening (HEDIS measure)

**Bidirectional**: An equivalency that works both ways (A ↔ B)

---

### C

**Care Gap**: A missed opportunity for preventive care or treatment

**Category**: Grouping for codes (Laboratory, Procedure, Diagnosis)

**CBP**: Controlling High Blood Pressure (HEDIS measure)

**CDC-H9**: Comprehensive Diabetes Care - HbA1c Testing (HEDIS measure)

**CIS-10**: Childhood Immunization Status (HEDIS measure)

**CMS**: Centers for Medicare & Medicaid Services

**Code**: A standardized identifier for medical services, diagnoses, supplies

**Code Equivalency**: Mapping showing two codes represent the same thing

**Code Set**: Collection of related medical codes (also: individual medical code record)

**COL**: Colorectal Cancer Screening (HEDIS measure)

**Confidence**: How certain an equivalency is correct (0-100%)

**Coverage Rate**: Percentage of codes with equivalencies

**CPT (Current Procedural Terminology)**: Code system for medical procedures

**CRUD**: Create, Read, Update, Delete operations

**Custom Code**: Organization-specific code not in standard code sets

---

### D

**Deduplication**: Removing duplicate clinical events from different sources

**Denominator**: Population eligible for a quality measure

**Domain**: Category of quality measure (Effectiveness of Care, Access, etc.)

**Draft Status**: Not yet active or published

---

### E

**Effective Date**: When a code, measure, or product becomes active

**EMR (Electronic Medical Record)**: Digital patient health record system

**Epic**: Major body of work in agile development

**Equivalency**: Relationship between codes representing same concept

**Exclusion**: Criteria that removes someone from a measure

---

### F

**FHIR (Fast Healthcare Interoperability Resources)**: Standard for healthcare data exchange

---

### G

**Gherkin**: Format for writing user stories (Given-When-Then)

---

### H

**HbA1c**: Hemoglobin A1c test for diabetes management

**HCPCS (Healthcare Common Procedure Coding System)**: Code system for supplies, services

**HEDIS (Healthcare Effectiveness Data and Information Set)**: Quality measure set

---

### I

**ICD-10 (International Classification of Diseases)**: Diagnosis code system

**ICD-10-CM**: Clinical Modification for US diagnosis coding

**ICD-10-PCS**: Procedure Coding System for inpatient procedures

---

### J

**Jira**: Project management and issue tracking tool

---

### L

**Line of Business**: Type of insurance (Commercial, Medicare, Medicaid)

**LOINC (Logical Observation Identifiers Names and Codes)**: Lab/clinical observation code system

**Logic Type**: Part of measure calculation (Denominator, Numerator, Exclusion)

---

### M

**Mapping**: Connection between two entities (code to benefit, code to code)

**Measure**: Quality metric for healthcare performance

**Measure Logic**: Rules defining who qualifies and meets a quality measure

**Metadata**: Additional data about data

**MIPS (Merit-based Incentive Payment System)**: Medicare quality program (formerly PQRS)

---

### N

**NCQA**: National Committee for Quality Assurance (HEDIS steward)

**NDC (National Drug Code)**: Medication code system

**Numerator**: Population that met the quality measure goal

---

### O

**ORM (Object-Relational Mapping)**: Database abstraction layer (Prisma)

---

### P

**Plan Type**: Category of health plan (HMO, PPO, EPO, POS)

**PQRS**: Physician Quality Reporting System (now MIPS)

**Prisma**: Database ORM for TypeScript/JavaScript

**Product**: Health plan offering with defined benefits and costs

**Product Catalog**: Repository of all health plan products

---

### Q

**QA (Quality Assurance)**: Testing process to ensure quality

**Quality Measure**: Standardized metric for healthcare quality

**Quality Program**: Set of measures (HEDIS, MIPS, etc.)

---

### R

**Relationship**: Type of equivalency (EXACT, BROADER, NARROWER, RELATED)

**REV (Revenue Code)**: Facility billing codes

---

### S

**Seed Data**: Initial database records for development/testing

**Semantic**: Related to meaning (e.g., semantic search)

**SNOMED CT**: Clinical terminology system

**Source**: Origin of data or equivalency (MANUAL, CMS_CROSSWALK, etc.)

**Staging**: Pre-production environment for testing

**Steward**: Organization that maintains a measure (e.g., NCQA)

**Story Points**: Estimate of work complexity

---

### T

**Terminology Date**: When a code becomes valid

**Toast**: Brief notification message

---

### U

**UI (User Interface)**: Visual interface for users

**User Story**: Description of feature from user perspective

---

### V

**Validation**: Checking data for correctness

**Value Set**: Named collection of codes for specific purpose

**Version**: Iteration of code or measure

---

### W

**WCAG (Web Content Accessibility Guidelines)**: Accessibility standards

---

### X

**X12 EDI**: Electronic data interchange standard for healthcare transactions

---

## Medical Code Systems

| System | Full Name | Purpose | Example |
|--------|-----------|---------|---------|
| ICD-10-CM | International Classification of Diseases, 10th Revision, Clinical Modification | Diagnoses | E11.9 (Type 2 diabetes) |
| ICD-10-PCS | ICD-10 Procedure Coding System | Inpatient procedures | 0DT60ZZ (Resection of stomach) |
| CPT | Current Procedural Terminology | Outpatient procedures | 83036 (HbA1c test) |
| HCPCS | Healthcare Common Procedure Coding System | Supplies, services, DME | E0424 (Stationary oxygen concentrator) |
| NDC | National Drug Code | Medications | 00071-0155-23 (Lipitor) |
| LOINC | Logical Observation Identifiers Names and Codes | Lab tests, observations | 4548-4 (HbA1c in Blood) |
| SNOMED CT | Systematized Nomenclature of Medicine Clinical Terms | Clinical terms | 44054006 (Type 2 diabetes) |
| REV | Revenue Codes | Facility billing | 0450 (Emergency room) |

## Quality Measure Programs

| Program | Full Name | Sponsor | Focus |
|---------|-----------|---------|-------|
| HEDIS | Healthcare Effectiveness Data and Information Set | NCQA | Commercial, Medicare, Medicaid plans |
| MIPS | Merit-based Incentive Payment System | CMS | Medicare physicians |
| Stars | Medicare Advantage Star Ratings | CMS | Medicare Advantage plans |
| QHP | Qualified Health Plan | CMS | ACA Marketplace plans |

## Healthcare Domains

| Domain | Description | Examples |
|--------|-------------|----------|
| Effectiveness of Care | Clinical quality and outcomes | Diabetes care, cancer screening |
| Access/Availability | Ability to get timely care | Wait times, provider availability |
| Experience of Care | Patient satisfaction | CAHPS surveys |
| Utilization | Appropriate use of services | ER visits, readmissions |
| Cost | Financial efficiency | Cost per member, waste reduction |
| Population Health | Community health outcomes | Chronic disease prevalence |
```

---

## PHASE 4: STAGING ENVIRONMENT SETUP (Day 3, 4-6 hours)

### **4.1 GCP Staging Database**
**Time:** 1 hour  
**Priority:** Critical  

```bash
# Create staging database instance
gcloud sql instances create code-mgmt-staging \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=HDD \
  --storage-size=10GB \
  --network=default

# Create database
gcloud sql databases create code_management_staging \
  --instance=code-mgmt-staging

# Set password
gcloud sql users set-password postgres \
  --instance=code-mgmt-staging \
  --password=<SECURE_PASSWORD>

# Get connection string
gcloud sql instances describe code-mgmt-staging \
  --format="value(connectionName)"

# Whitelist office IP
gcloud sql instances patch code-mgmt-staging \
  --authorized-networks=<OFFICE_IP>

# Test connection
psql "postgresql://postgres:<PASSWORD>@<IP>:5432/code_management_staging"

# Push schema
DATABASE_URL="postgresql://postgres:<PASSWORD>@<IP>:5432/code_management_staging" \
  npx prisma db push

# Seed data
DATABASE_URL="..." npm run db:seed
DATABASE_URL="..." npm run db:seed:quality
DATABASE_URL="..." node seed-direct.js
```

---

### **4.2 Cloud Run Setup**
**Time:** 1 hour  
**Priority:** Critical  

```bash
# Build container
docker build -t gcr.io/code-management-app-dev/hpbp-staging:latest .

# Push to registry
docker push gcr.io/code-management-app-dev/hpbp-staging:latest

# Deploy to Cloud Run
gcloud run deploy hpbp-staging \
  --image gcr.io/code-management-app-dev/hpbp-staging:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=<STAGING_DB_URL> \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2

# Get URL
gcloud run services describe hpbp-staging \
  --platform managed \
  --region us-central1 \
  --format="value(status.url)"
```

---

### **4.3 GitHub Actions CI/CD**
**Time:** 1-2 hours  
**Priority:** High  

```yaml
# .github/workflows/staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Type check
        run: npm run type-check
        
      - name: Build
        run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Authenticate to GCP
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Build and Push Docker image
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT }}/hpbp-staging:${{ github.sha }}
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy hpbp-staging \
            --image gcr.io/${{ secrets.GCP_PROJECT }}/hpbp-staging:${{ github.sha }} \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
      
      - name: Update Jira
        uses: atlassian/gajira-transition@v2
        with:
          issue: ${{ github.event.head_commit.message }}
          transition: "In Staging"
```

---

### **4.4 QA Access Documentation**
**Time:** 30 minutes  
**Priority:** High  

```markdown
File: QA_TESTING_GUIDE.md

# QA Testing Guide
## Staging Environment Access

### Environment Details
- **URL**: https://hpbp-staging-xxxxxxx.run.app
- **Database**: code_management_staging (read-only for QA)
- **Branch**: `develop` (auto-deploys)
- **Test Data**: 58 codes, 5 measures, 3 equivalencies

### Login Credentials
- **Username**: qa@yourcompany.com
- **Password**: (see 1Password)

### Test Accounts
1. **Admin User**: Full access
2. **Product Manager**: View + Edit
3. **Read-Only User**: View only

---

### Testing Scope

#### Sprint 1 Features (Current)
- [ ] Dashboard metrics display
- [ ] Code Library search, filter, sort
- [ ] Code details modal
- [ ] Quality Measures search, filter
- [ ] Measure logic viewer
- [ ] Measure logic editor
- [ ] Value Sets management
- [ ] Value set code editor
- [ ] Code Mappings (both tabs)
- [ ] Code equivalencies display
- [ ] Statistics accuracy

#### Out of Scope (Not Yet Built)
- Product catalog
- Create product forms
- Benefit mappings (tab exists but no data)
- Analytics reports
- Import/Export (UI exists but not wired)

---

### Test Scenarios

#### 1. Dashboard
**Steps:**
1. Login and land on dashboard
2. Verify 4 metric cards show numbers
3. Click each quick action
4. Verify navigation works

**Expected:**
- Metrics match database counts
- Quick actions navigate correctly
- No console errors

---

#### 2. Code Library
**Steps:**
1. Navigate to Code Library
2. Search for "diabetes"
3. Filter by CPT codes
4. Sort by effective date
5. Click code to view details

**Expected:**
- Search returns relevant codes
- Filters apply correctly
- Sorting works
- Modal shows complete code data

---

#### 3. Quality Measures
**Steps:**
1. Navigate to Quality Measures
2. Filter by HEDIS program
3. Select diabetes measure (CDC-H9)
4. View measure logic
5. Click "Edit Logic"
6. Add a new rule
7. Save changes

**Expected:**
- Filters work correctly
- Logic displays clearly
- Edit form pre-populates
- Save button works
- Toast notification appears

---

### Bug Reporting

#### Template
```
Title: [Page] - Brief description

Environment: Staging
URL: https://hpbp-staging-xxx.run.app/[page]
Browser: Chrome 119 / Safari 17 / etc.
User: qa@yourcompany.com

Steps to Reproduce:
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

Expected Result:
Should display/do X

Actual Result:
Shows/does Y instead

Screenshots:
[Attach screenshot]

Console Errors:
[Copy any browser console errors]

Priority: High / Medium / Low
```

#### Submit To
- **Jira**: Create ticket in HPBP project
- **Slack**: #qa-testing channel
- **Email**: dev-team@yourcompany.com

---

### Performance Testing

#### Load Times (Expected)
- Dashboard: < 1s
- Code Library: < 1.5s
- Quality Measures: < 2s
- Mappings: < 1.5s

#### API Response Times (Expected)
- Search: < 200ms
- Statistics: < 300ms
- Details: < 150ms

#### Test Tools
- Chrome DevTools Network tab
- Lighthouse performance audit
- WebPageTest.org

---

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate dropdowns

#### Screen Reader
- [ ] VoiceOver (Mac) / NVDA (Windows)
- [ ] All images have alt text
- [ ] Form labels are associated
- [ ] Headings are hierarchical

#### Color Contrast
- [ ] Run WAVE browser extension
- [ ] Verify WCAG AA compliance
- [ ] Check in dark mode (if applicable)

---

### Regression Testing

**Before Each Release:**
- [ ] Run full test suite
- [ ] Verify all previous bugs are fixed
- [ ] Check data integrity
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify email notifications (if applicable)
```

---

## PHASE 5: EXECUTION CHECKLIST (Summary)

### **Day 1: Code Quality**
- [ ] Fix TypeScript warnings (5 min)
- [ ] Test all buttons & links (2 hours)
- [ ] Implement Create Equivalency form (1 hour)
- [ ] Implement Create Mapping form (1 hour)
- [ ] Add toast notifications (1 hour)
- [ ] Add confirmation dialogs (30 min)

### **Day 1-2: Design System**
- [ ] Audit current design (1 hour)
- [ ] Document inconsistencies (1 hour)
- [ ] Create design tokens file (1 hour)
- [ ] Refine component library (1 hour)

### **Day 2: Documentation**
- [ ] Set up Jira project structure (1 hour)
- [ ] Create Business User Guide (2 hours)
- [ ] Create Technical Documentation (2 hours)
- [ ] Create Glossary of Terms (30 min)

### **Day 3: Staging**
- [ ] Create staging database (1 hour)
- [ ] Set up Cloud Run (1 hour)
- [ ] Configure GitHub Actions (1-2 hours)
- [ ] Create QA Testing Guide (30 min)
- [ ] Seed staging database (30 min)
- [ ] Test staging deployment (1 hour)

---

## 📊 **Deliverables**

### **Code**
- [ ] All TypeScript errors fixed
- [ ] All interactive components functional
- [ ] Create forms implemented
- [ ] Toast notifications integrated
- [ ] Confirmation dialogs added

### **Design**
- [ ] Design system audit complete
- [ ] Design tokens file created
- [ ] Component library documented
- [ ] Inconsistencies resolved

### **Documentation**
- [ ] BUSINESS_USER_GUIDE.md
- [ ] TECHNICAL_DOCUMENTATION.md
- [ ] GLOSSARY.md
- [ ] QA_TESTING_GUIDE.md
- [ ] Jira project configured
- [ ] GitHub-Jira integration active

### **Infrastructure**
- [ ] Staging database provisioned
- [ ] Cloud Run staging service deployed
- [ ] GitHub Actions CI/CD configured
- [ ] Staging URL accessible
- [ ] QA test accounts created

---

## 🎯 **Success Criteria**

- ✅ Zero TypeScript errors
- ✅ Zero linting errors (code, not markdown)
- ✅ All buttons perform expected actions
- ✅ All forms validate and save correctly
- ✅ Design system is consistent across pages
- ✅ Documentation is comprehensive and clear
- ✅ Staging environment is stable and accessible
- ✅ QA team can begin testing independently
- ✅ Jira tickets map to GitHub PRs
- ✅ Business users understand how to use features

---

## 📞 **Team Responsibilities**

### **Engineering**
- Implement code fixes
- Test all functionality
- Deploy to staging
- Fix bugs from QA

### **Product**
- Review Business User Guide
- Prioritize bug fixes
- Define acceptance criteria

### **QA**
- Execute test scenarios
- Report bugs in Jira
- Verify fixes
- Sign off on release

### **Design**
- Review design system audit
- Approve design tokens
- Validate UI consistency

---

## 🚀 **Next After Staging**

1. **QA Testing Sprint** (1 week)
2. **Bug Fix Sprint** (3-5 days)
3. **Production Deployment** (when ready)
4. **Epic 2: Product Catalog** (next feature)

---

**Document Version:** 1.0  
**Last Updated:** November 15, 2025  
**Owner:** Engineering Team  
**Status:** Ready to Execute

