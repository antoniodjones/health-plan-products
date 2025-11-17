# EPIC 8: Healthcare Standards & Interoperability

**Epic Owner:** Interoperability & Standards Team  
**Priority:** Critical  
**Dependencies:** Code Management (Epic 1), Quality Measures (Epic 6)  
**Status:** Planned  
**Target Phase:** Phase 3 (before Claims Module)

---

## Executive Summary

Epic 8 establishes the platform's ability to communicate across the healthcare ecosystem by implementing industry-standard data formats (X12, FHIR, CDA) and creating **code equivalency mappings** that prevent duplicate triggers and enable seamless data integration from EMRs, labs, payers, and other systems.

### Key Differentiator
Unlike traditional payers who maintain siloed data systems, CAPS creates a **unified semantic layer** that translates between coding systems (CPT ↔ LOINC ↔ SNOMED) and data standards (X12 ↔ FHIR ↔ CDA), enabling true interoperability.

---

## Business Value

### Quantifiable Benefits
- **70-80% reduction** in duplicate alerts/triggers
- **Real-time data exchange** vs. 30-90 day claim lag
- **90%+ automation** of data transformation
- **50-60% reduction** in integration costs per partner
- **Regulatory compliance** with CMS Interoperability Final Rule

### Strategic Benefits
- **EMR integration** - direct Epic, Cerner, Allscripts connectivity
- **Multi-payer collaboration** - shared member data with consent
- **Lab result integration** - real-time clinical data
- **Care coordination** - unified view across providers
- **Graph database foundation** - multi-source data lake readiness

---

## Problem Statement

### Current State Pain Points

1. **Code System Fragmentation**
   - Payers use CPT/HCPCS for claims
   - EMRs use LOINC/SNOMED for clinical data
   - Labs use proprietary codes + LOINC
   - **Result:** Same test appears as 3 different codes, triggers 3 alerts

2. **Data Format Incompatibility**
   - Claims: X12 EDI (837/835)
   - EMRs: FHIR R4/STU3, CDA, HL7v2
   - Labs: HL7v2, FHIR Observations
   - **Result:** Custom integration for each system

3. **No Semantic Understanding**
   - Systems can't recognize `CPT 83036` = `LOINC 4548-4` = "HbA1c Test"
   - Manual mapping required for each code
   - **Result:** Duplicates, missed gaps, alert fatigue

4. **Vendor Lock-In**
   - Proprietary integration formats
   - Custom API per EMR vendor
   - **Result:** Expensive, slow integrations

---

## Solution Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                           │
│         (Quality Measures, Care Gaps, Claims)                │
└─────────────────────────────────────────────────────────────┘
                            ↑
┌─────────────────────────────────────────────────────────────┐
│              SEMANTIC LAYER (Epic 8)                         │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Code Equivalency │  │ Data Translation │                │
│  │   Mappings       │  │   Engine         │                │
│  │  CPT ↔ LOINC     │  │ X12 ↔ FHIR ↔ CDA │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↑
┌─────────────────────────────────────────────────────────────┐
│                 INTEGRATION LAYER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ EMR APIs │  │ Lab APIs │  │ X12 EDI  │  │ Pharmacy │   │
│  │  (FHIR)  │  │(HL7v2)   │  │(Claims)  │  │ (NCPDP)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Code Equivalency Mapping Engine

**Purpose:** Recognize that different code systems represent the same clinical concept

**Example:**
```
HbA1c Test:
  CPT 83036 (Professional claims)
  ↔ LOINC 4548-4 (Lab results, EMR)
  ↔ SNOMED 43396009 (Clinical documentation)
  
All three codes mean: "Hemoglobin A1c measurement in blood"
```

**Data Model:**
```typescript
interface CodeEquivalency {
  id: string;
  name: string; // "HbA1c Test"
  description: string;
  category: 'lab' | 'procedure' | 'diagnosis' | 'medication' | 'observation';
  
  mappings: EquivalencyMapping[];
  
  metadata: {
    createdDate: Date;
    lastVerified: Date;
    source: 'manual' | 'cms_crosswalk' | 'nlm_umls' | 'ai_suggested';
    confidence: number; // 0-1
  };
}

interface EquivalencyMapping {
  id: string;
  sourceCode: CodeSet;  // FK to CodeSet
  targetCode: CodeSet;  // FK to CodeSet
  relationship: 'exact' | 'broader' | 'narrower' | 'related';
  bidirectional: boolean;
  validFrom: Date;
  validTo?: Date;
}
```

**Use Cases:**
1. **Deduplication:** Recognize `CPT 83036` claim + `LOINC 4548-4` lab result = same event
2. **Gap closure:** EMR sends LOINC, system closes gap defined by CPT
3. **Search/query:** User searches "diabetes test" finds all code systems
4. **Analytics:** Roll up utilization across all code representations

### 2. FHIR R4 Implementation

**Resources Supported:**

```typescript
interface FHIRResources {
  // Clinical
  Patient: 'US Core Patient profile';
  Observation: 'Lab results, vitals, assessments';
  Condition: 'Diagnoses, problems';
  Procedure: 'Procedures performed';
  MedicationRequest: 'Prescriptions';
  Immunization: 'Vaccinations';
  DiagnosticReport: 'Lab reports, imaging';
  
  // Administrative
  Coverage: 'Insurance information';
  ExplanationOfBenefit: 'Claim adjudication';
  Claim: 'Claim submission';
  
  // Care Coordination
  CarePlan: 'Care management plans';
  CareTeam: 'Provider teams';
  ServiceRequest: 'Orders, referrals';
}
```

**FHIR Endpoints:**
```
Base URL: https://api.caps.health/fhir/r4/

GET  /Patient/{id}
GET  /Patient?identifier={member-id}
GET  /Observation?patient={id}&category=laboratory
GET  /Condition?patient={id}&clinical-status=active
GET  /MedicationRequest?patient={id}&status=active
POST /Claim
GET  /ExplanationOfBenefit?patient={id}
```

**Smart on FHIR Support:**
- OAuth 2.0 with PKCE
- EHR launch flow
- Standalone launch flow
- Scopes: `patient/*.read`, `user/*.read`, `system/*.read`

### 3. X12 EDI Implementation

**Transaction Sets:**

```
Inbound (from providers/clearinghouses):
├─ 270: Eligibility Inquiry
├─ 837I: Institutional Claims (hospital)
├─ 837P: Professional Claims (physician)
├─ 837D: Dental Claims
├─ 275: Claims Attachments
└─ 276: Claim Status Inquiry

Outbound (to providers/clearinghouses):
├─ 271: Eligibility Response
├─ 835: Payment/Remittance Advice
├─ 277: Claim Status Response
└─ 999: Functional Acknowledgment
```

**X12 → FHIR Translation:**
```typescript
class X12ToFHIRTranslator {
  async translate837ToClaim(x12Message: X12_837): Promise<FHIR.Claim> {
    // Parse X12 segments
    const claimInfo = this.parseClaimInfo(x12Message);
    const patient = this.parsePatient(x12Message);
    const provider = this.parseProvider(x12Message);
    const diagnoses = this.parseDiagnoses(x12Message);
    const procedures = this.parseProcedures(x12Message);
    
    // Create FHIR Claim resource
    return {
      resourceType: 'Claim',
      id: claimInfo.claimNumber,
      status: 'active',
      type: this.mapClaimType(claimInfo.type),
      patient: { reference: `Patient/${patient.memberId}` },
      provider: { reference: `Organization/${provider.npi}` },
      diagnosis: diagnoses.map(d => ({
        sequence: d.sequence,
        diagnosisCodeableConcept: {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10-cm',
            code: d.code,
            display: d.description
          }]
        }
      })),
      item: procedures.map(p => ({
        sequence: p.lineNumber,
        productOrService: {
          coding: [{
            system: 'http://www.ama-assn.org/go/cpt',
            code: p.code,
            display: p.description
          }]
        },
        servicedDate: p.serviceDate,
        quantity: { value: p.units },
        unitPrice: { value: p.chargeAmount, currency: 'USD' }
      }))
    };
  }
}
```

### 4. CDA (Clinical Document Architecture) Support

**Document Types:**
```
Continuity of Care Document (CCD):
├─ Patient summary
├─ Allergies
├─ Medications
├─ Problems
├─ Procedures
└─ Results

Discharge Summary:
├─ Hospital stay summary
├─ Diagnoses
├─ Procedures performed
└─ Follow-up instructions

Progress Notes:
├─ Visit notes
├─ Assessment & Plan
└─ Treatment updates
```

**CDA → FHIR Bundle:**
```typescript
class CDAToFHIRTranslator {
  async translateCCDToBundle(cdaXml: string): Promise<FHIR.Bundle> {
    const cda = this.parseCDA(cdaXml);
    
    const bundle: FHIR.Bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: []
    };
    
    // Extract and convert sections
    if (cda.allergies) {
      bundle.entry.push(...this.convertAllergies(cda.allergies));
    }
    if (cda.medications) {
      bundle.entry.push(...this.convertMedications(cda.medications));
    }
    if (cda.problems) {
      bundle.entry.push(...this.convertProblems(cda.problems));
    }
    if (cda.results) {
      bundle.entry.push(...this.convertResults(cda.results));
    }
    
    return bundle;
  }
}
```

### 5. Code Terminology Services

**Terminology Server (FHIR $expand, $validate-code, $lookup):**

```typescript
// Expand value set
GET /ValueSet/$expand?url=http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.198.12.1012

// Response: All ICD-10 codes for diabetes
{
  "resourceType": "ValueSet",
  "expansion": {
    "contains": [
      { "system": "http://hl7.org/fhir/sid/icd-10-cm", "code": "E10.9", "display": "Type 1 diabetes mellitus" },
      { "system": "http://hl7.org/fhir/sid/icd-10-cm", "code": "E11.9", "display": "Type 2 diabetes mellitus" },
      ...
    ]
  }
}

// Find equivalent codes
GET /ConceptMap/$translate?system=http://www.ama-assn.org/go/cpt&code=83036&target=http://loinc.org

// Response:
{
  "parameter": [
    { "name": "result", "valueBoolean": true },
    { "name": "match", "valueCoding": { 
      "system": "http://loinc.org", 
      "code": "4548-4", 
      "display": "Hemoglobin A1c/Hemoglobin.total in Blood" 
    }}
  ]
}
```

### 6. EMR Integration Connectors

**Epic FHIR Connector:**
```typescript
class EpicFHIRConnector {
  private baseUrl: string = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/';
  private clientId: string;
  private accessToken: string;
  
  async getPatient(epicPatientId: string): Promise<FHIR.Patient> {
    return await this.get(`Patient/${epicPatientId}`);
  }
  
  async getObservations(
    patientId: string, 
    category: 'laboratory' | 'vital-signs',
    fromDate?: Date
  ): Promise<FHIR.Bundle<FHIR.Observation>> {
    const params = new URLSearchParams({
      patient: patientId,
      category: category,
      ...(fromDate && { date: `ge${fromDate.toISOString()}` })
    });
    return await this.get(`Observation?${params}`);
  }
  
  async getConditions(patientId: string): Promise<FHIR.Bundle<FHIR.Condition>> {
    return await this.get(`Condition?patient=${patientId}&clinical-status=active`);
  }
}
```

**Cerner FHIR Connector:**
```typescript
class CernerFHIRConnector {
  private baseUrl: string = 'https://fhir-ehr.cerner.com/r4/';
  private tenantId: string;
  
  // Similar implementation to Epic
  // Cerner uses slightly different auth flow (client credentials)
}
```

### 7. Graph Database Preparation

**Why Graph Database:**
- Represent complex relationships: Patient → Diagnosis → Medication → Lab → Provider
- Query across multiple hops: "Find all members with diabetes (ICD-10) who had HbA1c test (CPT/LOINC) > 9% and are taking metformin (NDC)"
- Multi-source data integration: Link claims (X12) + EMR (FHIR) + lab (HL7v2) by semantic equivalency

**Property Graph Model (Neo4j/Neptune):**

```cypher
// Nodes
(Member:Person {memberId, name, dob, ...})
(Diagnosis:ClinicalConcept {code, system, description})
(Procedure:ClinicalConcept {code, system, description})
(Medication:ClinicalConcept {code, system, description})
(Lab:ClinicalConcept {code, system, description})
(Provider:Organization {npi, name, specialty})
(Claim:FinancialRecord {claimId, amount, date})

// Relationships
(Member)-[:HAS_DIAGNOSIS {since, status}]->(Diagnosis)
(Member)-[:RECEIVED_PROCEDURE {date, provider}]->(Procedure)
(Member)-[:TAKES_MEDICATION {start, end, dosage}]->(Medication)
(Member)-[:HAD_LAB_TEST {date, result, unit}]->(Lab)
(Provider)-[:PERFORMED {date}]->(Procedure)
(Claim)-[:CONTAINS {lineNumber}]->(Procedure)

// Code equivalencies as relationships
(Code_CPT_83036:Code)-[:EQUIVALENT_TO {confidence: 1.0}]->(Code_LOINC_4548_4:Code)
(Code_LOINC_4548_4:Code)-[:EQUIVALENT_TO]->(Code_SNOMED_43396009:Code)
```

**Example Query:**
```cypher
// Find members with uncontrolled diabetes who haven't had endocrinology referral
MATCH (m:Member)-[:HAS_DIAGNOSIS]->(d:Diagnosis)
WHERE d.code IN ['E11.9', 'E10.9']  // Type 1 or 2 diabetes
AND NOT (m)-[:RECEIVED_PROCEDURE]->(:Procedure {specialty: 'Endocrinology'})
WITH m
MATCH (m)-[:HAD_LAB_TEST {result: hba1c}]->(:Lab {code: '4548-4'})  // LOINC HbA1c
WHERE hba1c > 9.0
AND NOT exists((m)-[:RECEIVED_REFERRAL]->(:Referral {specialty: 'Endocrinology'}))
RETURN m.memberId, m.name, hba1c
ORDER BY hba1c DESC
LIMIT 100
```

---

## Technical Architecture

### Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEMS                           │
├──────────────────────────────────────────────────────────────┤
│ Epic EMR │ Cerner │ Lab Corp │ Quest │ X12 Clearinghouse     │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  INTEGRATION ADAPTERS                         │
├──────────────────────────────────────────────────────────────┤
│ FHIR Client │ HL7v2 Parser │ X12 EDI Parser │ NCPDP Parser   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│               DATA TRANSFORMATION ENGINE                      │
├──────────────────────────────────────────────────────────────┤
│ • Validate incoming data                                      │
│ • Transform to canonical format (FHIR)                        │
│ • Apply code equivalency mappings                             │
│ • Check for duplicates (72-hour window)                       │
│ • Enrich with additional context                              │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                 SEMANTIC LAYER (Epic 8)                       │
├──────────────────────────────────────────────────────────────┤
│ Code Equivalency Service │ Terminology Server │ Mapping Cache │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                           │
├──────────────────────────────────────────────────────────────┤
│ PostgreSQL (Transactional) │ Neo4j (Graph) │ Redis (Cache)   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  APPLICATION SERVICES                         │
├──────────────────────────────────────────────────────────────┤
│ Quality Measures │ Care Gaps │ Claims │ Analytics │ Reporting │
└──────────────────────────────────────────────────────────────┘
```

### API Architecture

**RESTful + Event-Driven Hybrid:**

```typescript
// Synchronous REST APIs
POST /api/fhir/r4/Observation        // Create lab result
GET  /api/fhir/r4/Patient/{id}       // Read patient
POST /api/x12/837                    // Submit claim

// Asynchronous Event Bus (Kafka/RabbitMQ)
Topic: "clinical.observations.created"
Topic: "claims.received"
Topic: "code.mapped"
Topic: "gap.detected"
Topic: "gap.closed"

// Consumers subscribe to relevant topics
CareGapService.subscribe("clinical.observations.created")
DeduplicationService.subscribe("clinical.observations.created")
AnalyticsService.subscribe("gap.closed")
```

---

## Implementation Plan

### Phase 1: Code Equivalency Foundation (4 weeks)

**Week 1-2: Data Model & Seed Data**
- [ ] Create `CodeEquivalency` and `EquivalencyMapping` models
- [ ] Seed common mappings from CMS/NLM crosswalks:
  - CPT → LOINC for labs
  - ICD-10-CM → SNOMED CT for diagnoses
  - HCPCS → NDC for drugs
- [ ] Build equivalency query APIs

**Week 3-4: Integration with Existing Systems**
- [ ] Update Code Management UI to show equivalencies
- [ ] Update Quality Measures to use equivalencies
- [ ] Build deduplication service using equivalencies
- [ ] Create code search that spans all systems

**Deliverables:**
- 500+ code equivalency mappings seeded
- API endpoints for equivalency lookup
- Deduplication service operational

### Phase 2: FHIR R4 Implementation (6 weeks)

**Week 1-2: FHIR Server Setup**
- [ ] Set up HAPI FHIR server (or build custom)
- [ ] Implement US Core profiles
- [ ] Configure OAuth 2.0 + SMART on FHIR
- [ ] Build resource validation

**Week 3-4: Core Resources**
- [ ] Patient resource (US Core)
- [ ] Observation (labs, vitals)
- [ ] Condition (diagnoses)
- [ ] Procedure
- [ ] MedicationRequest
- [ ] Coverage

**Week 5-6: EMR Connectors**
- [ ] Epic FHIR connector
- [ ] Cerner FHIR connector
- [ ] Test with sandbox environments
- [ ] Real-time sync mechanism

**Deliverables:**
- FHIR R4 server operational
- 6+ core resources implemented
- 2 EMR connectors functional

### Phase 3: X12 EDI Implementation (4 weeks)

**Week 1-2: X12 Parser**
- [ ] Build X12 EDI parser (or use library)
- [ ] Support 837P, 837I, 270, 276
- [ ] Validation engine for X12 syntax

**Week 3-4: Bi-Directional Translation**
- [ ] X12 → FHIR translator
- [ ] FHIR → X12 generator
- [ ] Testing with sample files
- [ ] Clearinghouse connectivity

**Deliverables:**
- X12 parser/generator
- Bi-directional translation
- Clearinghouse integration

### Phase 4: CDA Support & Graph Database (4 weeks)

**Week 1-2: CDA Parser**
- [ ] CDA XML parser
- [ ] CCD document support
- [ ] CDA → FHIR Bundle conversion

**Week 3-4: Graph Database Pilot**
- [ ] Neo4j/Neptune setup
- [ ] Define property graph schema
- [ ] Build ETL pipeline (FHIR/X12 → Graph)
- [ ] Prototype complex queries

**Deliverables:**
- CDA parser operational
- Graph database pilot
- 10+ complex queries demonstrated

---

## User Stories Summary

See `HEALTHCARE_STANDARDS_USER_STORIES.md` for detailed Gherkin scenarios covering:

1. **Code Equivalency Management** (5 scenarios, 13 story points)
2. **FHIR Patient Data Integration** (4 scenarios, 8 story points)
3. **Lab Results Integration (LOINC)** (3 scenarios, 8 story points)
4. **X12 Claims Processing** (4 scenarios, 13 story points)
5. **CDA Document Processing** (2 scenarios, 5 story points)
6. **Graph Database Queries** (3 scenarios, 8 story points)
7. **Deduplication Service** (3 scenarios, 13 story points)

**Total: 68 story points across 24 user stories**

---

## Success Metrics

### Technical Metrics
- **Equivalency coverage:** >80% of active codes mapped
- **Deduplication accuracy:** >95% precision, >90% recall
- **FHIR conformance:** 100% US Core compliance
- **API response time:** <200ms (p95) for equivalency lookup
- **Data latency:** <5 seconds from EMR event to system availability

### Business Metrics
- **Duplicate alerts reduced:** 70-80%
- **Integration cost per partner:** 50-60% reduction
- **Data timeliness:** Real-time vs. 30-90 day lag
- **Interoperability compliance:** CMS Interoperability Final Rule

### Operational Metrics
- **EMR integrations:** 3+ (Epic, Cerner, +1) in first 6 months
- **Lab integrations:** 2+ (LabCorp, Quest) in first year
- **X12 transaction volume:** 100,000+ per month
- **FHIR API calls:** 1M+ per month

---

## Dependencies

### Must Have Before Starting
1. ✅ **Code Management (Epic 1)** - Standardized code sets
2. ✅ **Quality Measures (Epic 6)** - Use case for equivalencies

### Integration Dependencies
- OAuth 2.0 / SMART on FHIR provider
- FHIR server infrastructure (HAPI or custom)
- X12 clearinghouse connectivity
- EMR sandbox access (Epic/Cerner)
- Graph database (Neo4j/AWS Neptune)

---

## Risks & Mitigation

### Technical Risks
- **EMR API reliability:** Mitigate with retry logic, fallback to batch
- **Code mapping accuracy:** Start with verified crosswalks (CMS/NLM)
- **Graph database scalability:** Pilot before full rollout

### Operational Risks
- **EMR vendor cooperation:** Negotiate BAAs and API access early
- **Data quality issues:** Robust validation and cleansing
- **Performance at scale:** Caching, async processing, CDC patterns

### Regulatory Risks
- **HIPAA compliance:** All integrations require BAAs
- **CMS requirements:** Follow Interoperability Final Rule guidance
- **State regulations:** Vary by state, legal review required

---

## Alignment with Design System

### Journey Color Mapping
From `/Downloads/Design System/CAPS_Journey_Color_System.md`:

**Interoperability UI Color Strategy:**
- **Configuration screens:** 💙 Activating (Cyan) - first-time setup of integrations
- **Active integrations:** 💚 Engaged (Green) - operational data flows
- **Code mappings:** Use neutral grays + Info Blue for educational context
- **Equivalency suggestions:** 💙 Cyan badges for AI-suggested mappings
- **Errors/missing mappings:** ❌ Red (system color)

**UI Component Examples:**
```
Integration Status Card:
├─ Active: Engaged-500 (Green) border
├─ Configuring: Activating-500 (Cyan) border
├─ Error: Error-500 (Red) border
└─ Background: Journey-50 based on status

Code Equivalency Viewer:
├─ Confirmed mappings: Engaged-700 (Green) badges
├─ Suggested mappings: Activating-500 (Cyan) badges
├─ Missing mappings: Warning-500 (Amber) badges
└─ Background: White with Info-50 highlights
```

---

## Next Steps

1. ✅ **Review and approve Epic 8 design**
2. **Seed initial code equivalencies** - Start with top 100 lab/procedure codes
3. **Set up FHIR server** - HAPI FHIR or custom implementation
4. **Build Phase 1 (Code Equivalency)** - Foundation for deduplication
5. **Establish EMR partnerships** - Epic/Cerner sandbox access

---

**Epic Status:** Planned  
**Ready for Development:** After Quality Measures UI complete  
**Estimated Effort:** 68 story points (18-20 weeks / 4-5 months)

---

**This epic is foundational for true healthcare interoperability and positions CAPS as a leader in multi-source data integration.**

