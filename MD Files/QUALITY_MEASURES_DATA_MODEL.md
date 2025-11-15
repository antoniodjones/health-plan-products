# Quality Measures Data Model
## HEDIS & PQRS/MIPS Integration

**Document Version:** 1.0  
**Date:** November 15, 2025  
**Purpose:** Define data structures for storing quality measure specifications and code mappings

---

## 📋 Executive Summary

**HEDIS** (Healthcare Effectiveness Data and Information Set) and **PQRS** (Physician Quality Reporting System, now **MIPS**) are standardized quality measurement systems that rely on specific combinations of billing codes to calculate quality metrics.

### Key Concepts

1. **Quality Measures** = Rules for measuring healthcare quality
2. **Value Sets** = Groups of billing codes that define measure criteria
3. **Measure Logic** = Denominator + Numerator + Exclusions
4. **Code Tags** = Linking billing codes to quality measures

---

## 🏥 Real-World Examples

### Example 1: HEDIS Diabetes HbA1c Control (CDC-H9)

**Measure Goal:** % of diabetic patients with HbA1c < 9%

**Value Sets Needed:**
- **Denominator (Who qualifies?):**
  - ICD-10: E10.*, E11.* (Diabetes diagnosis codes)
  - Age: 18-75 years
  
- **Numerator (Who meets goal?):**
  - CPT: 83036, 83037 (HbA1c lab tests)
  - LOINC: 4548-4, 17856-6 (HbA1c results)
  - Result: < 9%

- **Exclusions:**
  - ICD-10: O24.* (Gestational diabetes)
  - CPT: 90935-90937 (Dialysis codes)

### Example 2: HEDIS Colorectal Cancer Screening (COL)

**Measure Goal:** % of adults 50-75 with appropriate screening

**Value Sets:**
- **Denominator:**
  - Age: 50-75 years
  - Active member

- **Numerator (Any of these):**
  - **Colonoscopy (10 years):** CPT 44388-44394, G0105, G0121
  - **Flexible Sigmoidoscopy (5 years):** CPT 45330-45347, G0104
  - **FIT Test (1 year):** CPT 82270, 82274, G0328
  - **Cologuard (3 years):** CPT 81528

- **Exclusions:**
  - ICD-10: C18-C20 (Colorectal cancer history)
  - CPT: 44150-44160 (Total colectomy)

### Example 3: MIPS/PQRS Measure #1 - Diabetes Mellitus: HbA1c Poor Control

**Measure Goal:** % of diabetic patients with HbA1c > 9% (inverse measure - lower is better)

**G-codes for PQRS reporting:**
- G8417: HbA1c > 9%
- G8418: HbA1c result not documented

---

## 🗄️ Proposed Data Structure

### Core Entities

```
┌─────────────────┐         ┌──────────────────┐
│ QualityMeasure  │────────▶│   ValueSet       │
│                 │         │                  │
│ - measureId     │         │ - valueSetId     │
│ - name          │         │ - name           │
│ - description   │         │ - oid            │
│ - program       │         │ - version        │
│ - domain        │         │ - purpose        │
│ - version       │         └──────────────────┘
│ - effectiveDate │                 │
│ - status        │                 │
└─────────────────┘                 │
                                    ▼
                          ┌──────────────────┐
                          │ ValueSetCode     │
                          │                  │
                          │ - id             │
                          │ - valueSetId     │──┐
                          │ - codeId         │  │
                          │ - included       │  │
                          └──────────────────┘  │
                                               │
                                               ▼
┌─────────────────┐                  ┌──────────────────┐
│ MeasureLogic    │                  │     CodeSet      │
│                 │                  │                  │
│ - id            │                  │ - id             │
│ - measureId     │                  │ - code           │
│ - logicType     │◀─────────────────│ - codeType       │
│ - valueSetId    │                  │ - description    │
│ - operator      │                  │ - category       │
│ - timeframe     │                  └──────────────────┘
└─────────────────┘

Legend:
- QualityMeasure: HEDIS/MIPS measure definitions
- ValueSet: Named groups of codes (e.g., "Diabetes Diagnosis Codes")
- ValueSetCode: Many-to-many link between value sets and codes
- MeasureLogic: Denominator/Numerator/Exclusion rules
- CodeSet: Your existing medical codes
```

---

## 📊 Database Schema (Prisma)

### New Models

```prisma
// Quality Measure Programs
enum QualityProgram {
  HEDIS
  MIPS
  PQRS
  NQF
  CMS_STAR
  CUSTOM
}

enum MeasureDomain {
  EFFECTIVENESS_OF_CARE
  ACCESS_AVAILABILITY
  EXPERIENCE_OF_CARE
  UTILIZATION
  HEALTH_PLAN_DESCRIPTIVE
  CLINICAL_DATA_SYSTEMS
  PREVENTION
  CHRONIC_CARE
  BEHAVIORAL_HEALTH
  PATIENT_SAFETY
}

enum MeasureStatus {
  ACTIVE
  RETIRED
  DRAFT
  DEPRECATED
}

enum LogicType {
  DENOMINATOR
  NUMERATOR
  EXCLUSION
  EXCEPTION
  STRATIFICATION
}

// Quality Measure Definition
model QualityMeasure {
  id              String          @id @default(uuid())
  measureId       String          @unique // e.g., "CDC-H9", "MIPS-001"
  name            String          // "Diabetes HbA1c Control"
  description     String          @db.Text
  program         QualityProgram
  domain          MeasureDomain
  version         String          @default("1.0")
  effectiveDate   DateTime
  retirementDate  DateTime?
  status          MeasureStatus   @default(ACTIVE)
  
  // Metadata
  nqfNumber       String?         // National Quality Forum ID
  cmsNumber       String?         // CMS measure number
  steward         String?         // Measure steward (NCQA, CMS, etc.)
  
  // Reporting
  reportingMethod String?         // "Claims", "Registry", "EHR", "Hybrid"
  measureType     String?         // "Process", "Outcome", "Structure"
  
  // Performance
  nationalBenchmark Float?
  targetRate       Float?
  
  // Relationships
  measureLogic    MeasureLogic[]
  productMeasures ProductMeasure[] // Which products track this measure
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([program, domain])
  @@index([status, effectiveDate])
  @@map("quality_measures")
}

// Value Set (Groups of codes for measure criteria)
model ValueSet {
  id              String          @id @default(uuid())
  valueSetId      String          @unique // e.g., "2.16.840.1.113883.3.464.1003.103.12.1001"
  name            String          // "Diabetes Diagnosis Codes"
  description     String?         @db.Text
  oid             String?         // Object Identifier for interoperability
  version         String          @default("1.0")
  purpose         String?         // "Denominator", "Numerator", etc.
  
  effectiveDate   DateTime
  expirationDate  DateTime?
  
  // Relationships
  codes           ValueSetCode[]
  measureLogic    MeasureLogic[]
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([oid])
  @@map("value_sets")
}

// Many-to-Many: Value Sets ↔ Codes
model ValueSetCode {
  id              String          @id @default(uuid())
  valueSetId      String
  codeSetId       String
  
  // Inclusion/Exclusion
  included        Boolean         @default(true)
  notes           String?
  
  // Relationships
  valueSet        ValueSet        @relation(fields: [valueSetId], references: [id], onDelete: Cascade)
  codeSet         CodeSet         @relation(fields: [codeSetId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime        @default(now())
  
  @@unique([valueSetId, codeSetId])
  @@index([valueSetId])
  @@index([codeSetId])
  @@map("value_set_codes")
}

// Measure Logic (Denominator, Numerator, Exclusions)
model MeasureLogic {
  id              String          @id @default(uuid())
  measureId       String
  logicType       LogicType
  sequence        Int             @default(0) // Order of logic evaluation
  
  // Value Set Reference
  valueSetId      String?
  
  // Logic Operators
  operator        String?         // "AND", "OR", "NOT", "AT_LEAST_ONE"
  timeframeValue  Int?            // e.g., 365 days
  timeframeUnit   String?         // "DAYS", "MONTHS", "YEARS"
  
  // Age/Demographics
  ageMin          Int?
  ageMax          Int?
  gender          String?
  
  // Additional Criteria
  criteriaJson    Json?           // Flexible JSON for complex logic
  
  // Relationships
  measure         QualityMeasure  @relation(fields: [measureId], references: [id], onDelete: Cascade)
  valueSet        ValueSet?       @relation(fields: [valueSetId], references: [id])
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([measureId, logicType])
  @@map("measure_logic")
}

// Link Products to Quality Measures
model ProductMeasure {
  id              String          @id @default(uuid())
  productId       String
  measureId       String
  
  // Tracking
  isRequired      Boolean         @default(false)
  reportingYear   Int
  targetRate      Float?
  
  // Relationships
  product         Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  measure         QualityMeasure  @relation(fields: [measureId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@unique([productId, measureId, reportingYear])
  @@map("product_measures")
}
```

---

## 🎯 Use Cases

### Use Case 1: Check if Code is Tagged to Quality Measures

```typescript
// Find all quality measures that include CPT code 99213
const measuresForCode = await prisma.valueSetCode.findMany({
  where: {
    codeSet: {
      code: '99213',
      codeType: 'CPT'
    }
  },
  include: {
    valueSet: {
      include: {
        measureLogic: {
          include: {
            measure: true
          }
        }
      }
    }
  }
});

// Result: 
// - MIPS Quality ID 001: Diabetes HbA1c Control
// - HEDIS Diabetes Monitoring (CDC)
// - etc.
```

### Use Case 2: Calculate Measure Denominator

```typescript
// Get all patients who qualify for diabetes measure denominator
const denominatorCodes = await prisma.measureLogic.findMany({
  where: {
    measureId: 'CDC-H9',
    logicType: 'DENOMINATOR'
  },
  include: {
    valueSet: {
      include: {
        codes: {
          include: {
            codeSet: true
          }
        }
      }
    }
  }
});

// Returns: All ICD-10 codes E10.*, E11.* for diabetes diagnosis
```

### Use Case 3: Product Quality Reporting

```typescript
// Which HEDIS measures does my Medicare Advantage product need to report?
const productMeasures = await prisma.productMeasure.findMany({
  where: {
    productId: 'medicare-advantage-2024',
    reportingYear: 2024
  },
  include: {
    measure: {
      include: {
        measureLogic: {
          include: {
            valueSet: {
              include: {
                codes: {
                  include: {
                    codeSet: true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

// Returns: Complete measure specifications with all code lists
```

---

## 📈 Example Data

### Sample HEDIS Measure: Colorectal Cancer Screening (COL)

```typescript
// 1. Create the Measure
const colMeasure = await prisma.qualityMeasure.create({
  data: {
    measureId: 'COL',
    name: 'Colorectal Cancer Screening',
    description: 'Percentage of adults 50-75 who had appropriate screening',
    program: 'HEDIS',
    domain: 'EFFECTIVENESS_OF_CARE',
    version: '2024',
    effectiveDate: new Date('2024-01-01'),
    status: 'ACTIVE',
    nqfNumber: '0034',
    steward: 'NCQA',
    reportingMethod: 'Hybrid',
    measureType: 'Process'
  }
});

// 2. Create Value Sets
const colonoscopyValueSet = await prisma.valueSet.create({
  data: {
    valueSetId: 'HEDIS_COL_COLONOSCOPY',
    name: 'Colonoscopy Procedures',
    description: 'CPT codes for colonoscopy screening',
    oid: '2.16.840.1.113883.3.464.1003.108.12.1020',
    version: '2024',
    purpose: 'Numerator',
    effectiveDate: new Date('2024-01-01')
  }
});

// 3. Link Codes to Value Set
await prisma.valueSetCode.createMany({
  data: [
    { valueSetId: colonoscopyValueSet.id, codeSetId: '<code-id-for-44388>' },
    { valueSetId: colonoscopyValueSet.id, codeSetId: '<code-id-for-44389>' },
    { valueSetId: colonoscopyValueSet.id, codeSetId: '<code-id-for-G0105>' },
    { valueSetId: colonoscopyValueSet.id, codeSetId: '<code-id-for-G0121>' },
  ]
});

// 4. Create Measure Logic
await prisma.measureLogic.create({
  data: {
    measureId: colMeasure.id,
    logicType: 'NUMERATOR',
    sequence: 1,
    valueSetId: colonoscopyValueSet.id,
    operator: 'AT_LEAST_ONE',
    timeframeValue: 10,
    timeframeUnit: 'YEARS',
    criteriaJson: {
      description: 'Colonoscopy within 10 years'
    }
  }
});
```

---

## 🔍 Benefits of This Structure

### ✅ Advantages

1. **Flexibility**: Support any quality program (HEDIS, MIPS, CMS Stars, etc.)
2. **Reusability**: Value sets can be shared across multiple measures
3. **Versioning**: Track measure and value set versions over time
4. **Auditability**: Complete history of measure specifications
5. **Extensibility**: Easy to add new programs or logic types
6. **Standardization**: Use industry-standard OIDs for interoperability
7. **Performance**: Indexed for fast lookups by code or measure

### 📊 Key Queries Enabled

- "Which quality measures use this billing code?"
- "What codes are in the numerator for HEDIS CDC-H9?"
- "Which products report this measure?"
- "Show all HEDIS measures for diabetes care"
- "Find codes that need to be mapped to quality measures"

---

## 🚀 Implementation Phases

### Phase 1: Core Schema (Week 1)
- Add new Prisma models
- Create API routes for CRUD operations
- Build admin UI for quality measure management

### Phase 2: Value Set Management (Week 2)
- Import NCQA HEDIS value sets
- Import CMS MIPS quality measures
- Link value sets to existing codes

### Phase 3: Measure Logic Builder (Week 3)
- UI for defining measure logic
- Visual builder for denominator/numerator/exclusion
- Test measure calculations

### Phase 4: Product Integration (Week 4)
- Link products to required measures
- Quality reporting dashboard
- Measure performance tracking

---

## 📚 External Resources

- **NCQA HEDIS**: https://www.ncqa.org/hedis/
- **CMS Quality Measures**: https://cmit.cms.gov/CMIT_public/ListMeasures
- **NQF**: https://www.qualityforum.org/
- **Value Set Authority Center (VSAC)**: https://vsac.nlm.nih.gov/
- **MIPS Measures**: https://qpp.cms.gov/mips/explore-measures

---

## 💡 Next Steps

1. **Review & Approve** this data model
2. **Update Prisma schema** with new models
3. **Run migrations** to create database tables
4. **Seed with sample measures** (5-10 common HEDIS measures)
5. **Build Quality Measures UI** (browse, search, view)
6. **Import real value sets** from NCQA/CMS

---

**Questions to Consider:**
- Do we need to support custom/proprietary quality measures?
- Should we track member-level quality measure compliance?
- Do we need real-time measure calculation vs. batch reporting?
- Integration with claims adjudication engine?

