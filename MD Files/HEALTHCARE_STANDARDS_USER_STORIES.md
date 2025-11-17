# EPIC 8: Healthcare Standards & Interoperability - User Stories

**Epic:** Healthcare Standards & Interoperability  
**Dependencies:** Code Management (Epic 1), Quality Measures (Epic 6)  
**Total Story Points:** 68  
**Stories:** 24 stories across 7 features

---

## Feature 1: Code Equivalency Management

### Story 8.1.1: Create Code Equivalency Mappings
**As a** Data Steward  
**I want** to create equivalency mappings between different code systems  
**So that** the system can recognize when different codes represent the same clinical concept

**Story Points:** 3  
**Priority:** Critical

```gherkin
Feature: Create Code Equivalency Mappings
  Map codes across different terminology systems (CPT ↔ LOINC ↔ SNOMED)

  Background:
    Given I am logged in as a Data Steward
    And I have access to Code Management module
    And the following codes exist:
      | Code Type | Code    | Description                    |
      | CPT       | 83036   | Hemoglobin A1c test            |
      | LOINC     | 4548-4  | HbA1c/Hemoglobin.total in Blood |
      | SNOMED    | 43396009| HbA1c measurement              |

  Scenario: Create new equivalency group
    When I navigate to Code Mappings → Equivalency tab
    And I click "Create Equivalency"
    Then I should see equivalency creation form:
      | Field             | Required | Type           |
      | Name              | Yes      | Text           |
      | Description       | Yes      | Textarea       |
      | Category          | Yes      | Select         |
      | Source            | Yes      | Select         |
    When I enter the following:
      | Field             | Value                          |
      | Name              | HbA1c Test                     |
      | Description       | Hemoglobin A1c measurement     |
      | Category          | Laboratory                     |
      | Source            | Manual                         |
    And I click "Add Code Mapping"
    And I select "CPT" as source code system
    And I select "83036" as source code
    And I select "LOINC" as target code system
    And I select "4548-4" as target code
    And I select relationship type "Exact match"
    And I mark it as bidirectional
    And I click "Add Mapping"
    Then the mapping should be added to the list
    When I click "Add Another Mapping"
    And I map "LOINC 4548-4" to "SNOMED 43396009" as exact match
    And I click "Save Equivalency"
    Then the equivalency should be created successfully
    And I should see confirmation: "Equivalency 'HbA1c Test' created with 2 mappings"
    And the equivalency should appear in the list

  Scenario: Import equivalencies from CMS Crosswalk
    Given CMS publishes CPT-HCPCS crosswalk
    When I navigate to Code Mappings → Import
    And I select source "CMS CPT-HCPCS Crosswalk"
    And I upload the crosswalk file "cms-cpt-hcpcs-2025.csv"
    Then the system should validate the file format
    And the system should preview first 10 mappings:
      | Source Code | Target Code | Relationship | Action   |
      | CPT 99213   | HCPCS G0438 | Exact        | Import   |
      | CPT 99214   | HCPCS G0439 | Exact        | Import   |
      | ...         | ...         | ...          | ...      |
    When I review and click "Import All"
    Then the system should:
      | Step | Action                                    |
      | 1    | Create equivalency groups                 |
      | 2    | Link codes via EquivalencyMapping table   |
      | 3    | Set source = "cms_crosswalk"              |
      | 4    | Set confidence = 1.0 (verified)           |
      | 5    | Log import in audit trail                 |
    And I should see "250 equivalencies imported successfully"

  Scenario: AI suggests equivalency
    Given the system has ML model trained on existing mappings
    And a new code "LOINC 17855-8" exists: "HbA1c/Hemoglobin.total in Blood"
    When the AI model analyzes the code description
    Then the system should identify similarity to existing "HbA1c Test" equivalency
    And the system should create a suggested mapping:
      | Field          | Value                                |
      | Suggested Code | LOINC 17855-8                        |
      | Match To       | CPT 83036, LOINC 4548-4, SNOMED 43396009 |
      | Confidence     | 0.92 (92%)                           |
      | Reason         | Description similarity + clinical context |
    When Data Steward reviews suggestions
    And clicks "Approve" on the suggestion
    Then the code should be added to "HbA1c Test" equivalency
    And confidence should be updated based on steward approval
```

**Acceptance Criteria:**
- [ ] Can create equivalency with name, description, category
- [ ] Can add multiple code mappings to single equivalency
- [ ] Supports relationship types: exact, broader, narrower, related
- [ ] Can import from CMS/NLM crosswalks
- [ ] AI suggests equivalencies based on description/context
- [ ] All mappings logged in audit trail
- [ ] Bidirectional mappings work both ways

---

### Story 8.1.2: Query Code Equivalencies
**As a** Developer  
**I want** API endpoints to find equivalent codes  
**So that** I can deduplicate events and close care gaps across code systems

**Story Points:** 3  
**Priority:** Critical

```gherkin
Feature: Query Code Equivalencies
  Find all equivalent codes for a given code

  Background:
    Given the following equivalencies exist:
      | Name        | Codes                                    |
      | HbA1c Test  | CPT 83036, LOINC 4548-4, SNOMED 43396009|
      | Lipid Panel | CPT 80061, LOINC 24331-1                 |

  Scenario: Find equivalents for a CPT code
    Given I have CPT code "83036"
    When I call GET /api/code-equivalencies?code=83036&system=CPT
    Then I should receive response:
      ```json
      {
        "equivalency": {
          "id": "equiv-001",
          "name": "HbA1c Test",
          "category": "laboratory",
          "confidence": 1.0,
          "mappings": [
            {
              "codeType": "CPT",
              "code": "83036",
              "description": "Hemoglobin A1c test",
              "relationship": "exact"
            },
            {
              "codeType": "LOINC",
              "code": "4548-4",
              "description": "HbA1c/Hemoglobin.total in Blood",
              "relationship": "exact"
            },
            {
              "codeType": "SNOMED",
              "code": "43396009",
              "description": "HbA1c measurement",
              "relationship": "exact"
            }
          ]
        }
      }
      ```
    And response time should be <100ms

  Scenario: Bulk equivalency lookup
    Given I have a list of codes from mixed systems
    When I call POST /api/code-equivalencies/bulk:
      ```json
      {
        "codes": [
          { "system": "CPT", "code": "83036" },
          { "system": "CPT", "code": "80061" },
          { "system": "ICD-10-CM", "code": "E11.9" }
        ]
      }
      ```
    Then I should receive equivalencies for all found codes
    And codes without equivalencies should be flagged
    And response should include cache headers for 24 hours

  Scenario: Check if two codes are equivalent
    When I call GET /api/code-equivalencies/compare?code1=CPT:83036&code2=LOINC:4548-4
    Then I should receive:
      ```json
      {
        "areEquivalent": true,
        "equivalencyId": "equiv-001",
        "equivalencyName": "HbA1c Test",
        "relationship": "exact",
        "confidence": 1.0
      }
      ```
```

**Acceptance Criteria:**
- [ ] GET endpoint returns all equivalent codes
- [ ] POST bulk endpoint handles 100+ codes efficiently
- [ ] Compare endpoint checks if two codes are equivalent
- [ ] Response time <100ms for single lookup
- [ ] Responses are cached (24 hours)
- [ ] Handles codes not in any equivalency gracefully

---

### Story 8.1.3: Visualize Code Equivalency Network
**As a** Data Steward  
**I want** to visualize equivalency relationships as a network graph  
**So that** I can identify gaps and verify mapping completeness

**Story Points:** 5  
**Priority:** Medium

```gherkin
Feature: Visualize Code Equivalency Network
  Display code relationships as an interactive graph

  Scenario: View equivalency network for HbA1c
    Given I am viewing "HbA1c Test" equivalency
    When I click "View Network"
    Then I should see an interactive graph visualization:
      ```
               SNOMED 43396009
                      ↕
      CPT 83036 ← → LOINC 4548-4
                      ↕
               LOINC 17855-8
      ```
    And nodes should be color-coded by code system:
      | Code System | Color  |
      | CPT         | Blue   |
      | LOINC       | Green  |
      | SNOMED      | Purple |
      | ICD-10      | Orange |
    And edges should show relationship type:
      | Relationship | Line Style |
      | Exact        | Solid      |
      | Broader      | Dashed     |
      | Narrower     | Dotted     |
      | Related      | Thin solid |
    When I hover over a node
    Then I should see tooltip with:
      - Code and description
      - Number of connections
      - Confidence score
    When I click a node
    Then I should see detailed information panel:
      - All equivalent codes
      - Value sets using this code
      - Quality measures using this code
      - Usage statistics

  Scenario: Identify orphan codes
    Given I am viewing "All Laboratory Codes" network
    When I apply filter "Show only codes without equivalencies"
    Then the graph should highlight orphan codes in red
    And I should see count: "23 codes without equivalencies"
    When I click an orphan code
    Then I should see "Suggest Equivalency" button
    And I can initiate AI-assisted mapping
```

**Acceptance Criteria:**
- [ ] Interactive graph with zoom/pan
- [ ] Color-coded by code system
- [ ] Shows relationship types visually
- [ ] Hover tooltips with summary info
- [ ] Click for detailed panel
- [ ] Filter by code system, category, confidence
- [ ] Identify orphan codes (no equivalencies)
- [ ] Export graph as PNG/SVG

---

## Feature 2: FHIR Patient Data Integration

### Story 8.2.1: Retrieve Patient from EMR
**As a** Care Coordinator  
**I want** to retrieve member demographics from Epic/Cerner  
**So that** I have up-to-date member information for care management

**Story Points:** 3  
**Priority:** High

```gherkin
Feature: Retrieve Patient from EMR via FHIR
  Fetch patient demographics from Epic/Cerner using FHIR R4

  Background:
    Given Epic FHIR connector is configured
    And member M12345 exists in CAPS system
    And member has Epic patient ID "eQNSKL3v5QiC9VyfUAm8Zaw3"
    And EMR integration is authorized via SMART on FHIR

  Scenario: Fetch patient demographics from Epic
    Given I am viewing member M12345 profile
    When I click "Sync from EMR"
    Then the system should call Epic FHIR API:
      ```
      GET https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/eQNSKL3v5QiC9VyfUAm8Zaw3
      Authorization: Bearer {access_token}
      Accept: application/fhir+json
      ```
    And Epic should return FHIR Patient resource:
      ```json
      {
        "resourceType": "Patient",
        "id": "eQNSKL3v5QiC9VyfUAm8Zaw3",
        "identifier": [
          {
            "system": "http://hospital.smarthealthit.org",
            "value": "123456789"
          }
        ],
        "name": [{
          "use": "official",
          "family": "Smith",
          "given": ["John", "Robert"]
        }],
        "gender": "male",
        "birthDate": "1975-03-15",
        "address": [{
          "line": ["123 Main St"],
          "city": "Boston",
          "state": "MA",
          "postalCode": "02114"
        }],
        "telecom": [{
          "system": "phone",
          "value": "555-123-4567",
          "use": "mobile"
        }]
      }
      ```
    Then the system should update member record:
      | Field         | CAPS Field    | Value              |
      | name          | firstName     | John               |
      | name          | lastName      | Smith              |
      | birthDate     | dob           | 1975-03-15         |
      | address       | address       | 123 Main St, ...   |
      | telecom       | phone         | 555-123-4567       |
    And the system should log sync event:
      - Timestamp: current time
      - Source: Epic FHIR
      - Fields updated: name, address, phone
    And I should see notification "Member synced from EMR"

  Scenario: Handle EMR API failure
    Given Epic FHIR API is experiencing issues
    When I attempt to sync member M12345
    And the API returns 503 Service Unavailable
    Then the system should:
      | Step | Action                                        |
      | 1    | Retry up to 3 times with exponential backoff  |
      | 2    | If all retries fail, log error                |
      | 3    | Show user: "EMR temporarily unavailable"      |
      | 4    | Queue for background retry in 5 minutes       |
    And member data should remain unchanged
    And I should be able to continue working with cached data
```

**Acceptance Criteria:**
- [ ] FHIR R4 Patient resource retrieval
- [ ] OAuth 2.0 + SMART on FHIR authentication
- [ ] Maps FHIR fields to CAPS member fields
- [ ] Logs all sync events in audit trail
- [ ] Retry logic with exponential backoff
- [ ] Graceful failure handling
- [ ] Works with Epic and Cerner

---

### Story 8.2.2: Subscribe to EMR Updates (FHIR Subscription)
**As a** System Administrator  
**I want** to receive real-time notifications when member data changes in EMR  
**So that** CAPS always has the most current information

**Story Points:** 5  
**Priority:** Medium

```gherkin
Feature: FHIR Subscription for Real-Time Updates
  Subscribe to EMR events for real-time data sync

  Background:
    Given FHIR Subscription mechanism is supported by Epic
    And webhook endpoint is configured: https://api.caps.health/webhooks/fhir

  Scenario: Create subscription for patient updates
    When system administrator creates FHIR Subscription:
      ```json
      {
        "resourceType": "Subscription",
        "status": "requested",
        "reason": "Monitor patient demographic changes",
        "criteria": "Patient?_lastUpdated=gt2025-01-01",
        "channel": {
          "type": "rest-hook",
          "endpoint": "https://api.caps.health/webhooks/fhir/patient",
          "payload": "application/fhir+json",
          "header": ["Authorization: Bearer {webhook_secret}"]
        }
      }
      ```
    Then Epic should confirm subscription
    And subscription should become "active"
    When patient data changes in Epic (e.g., address update)
    Then Epic should POST to webhook endpoint:
      ```json
      {
        "resourceType": "Bundle",
        "type": "history",
        "entry": [{
          "resource": {
            "resourceType": "Patient",
            "id": "eQNSKL3v5QiC9VyfUAm8Zaw3",
            "address": [{
              "line": ["456 Oak Ave"],
              "city": "Cambridge",
              "state": "MA",
              "postalCode": "02139"
            }]
          }
        }]
      }
      ```
    Then CAPS should:
      | Step | Action                                     |
      | 1    | Validate webhook signature                 |
      | 2    | Extract patient ID from FHIR resource      |
      | 3    | Find matching member in CAPS               |
      | 4    | Update member address                      |
      | 5    | Log sync event                             |
      | 6    | Return 200 OK to Epic                      |
    And member M12345 address should be updated to "456 Oak Ave"
```

**Acceptance Criteria:**
- [ ] Creates FHIR Subscription via API
- [ ] Webhook endpoint receives real-time updates
- [ ] Validates webhook signatures
- [ ] Updates member data automatically
- [ ] Logs all updates in audit trail
- [ ] Handles high volume (100+ updates/min)

---

## Feature 3: Lab Results Integration (LOINC)

### Story 8.3.1: Receive Lab Results via FHIR
**As a** Care Coordinator  
**I want** to receive lab results from LabCorp/Quest via FHIR  
**So that** care gaps are closed immediately when labs are completed

**Story Points:** 5  
**Priority:** Critical

```gherkin
Feature: Receive Lab Results via FHIR
  Process lab results (LOINC codes) and close care gaps

  Background:
    Given member M12345 has open care gap "HbA1c Test Due" (CDC-H9)
    And gap requires CPT 83036 or LOINC 4548-4
    And code equivalency exists: CPT 83036 ↔ LOINC 4548-4
    And LabCorp is configured to send results via FHIR

  Scenario: Lab result closes care gap
    When LabCorp sends FHIR Observation to CAPS webhook:
      ```json
      {
        "resourceType": "Observation",
        "id": "obs-lab-001",
        "status": "final",
        "category": [{
          "coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "laboratory"
          }]
        }],
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "4548-4",
            "display": "Hemoglobin A1c/Hemoglobin.total in Blood"
          }]
        },
        "subject": {
          "reference": "Patient/member-12345"
        },
        "effectiveDateTime": "2025-11-20T08:30:00Z",
        "issued": "2025-11-20T14:15:00Z",
        "valueQuantity": {
          "value": 6.5,
          "unit": "%",
          "system": "http://unitsofmeasure.org",
          "code": "%"
        },
        "interpretation": [{
          "coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
            "code": "N",
            "display": "Normal"
          }]
        }],
        "performer": [{
          "reference": "Organization/labcorp",
          "display": "LabCorp"
        }]
      }
      ```
    Then the system should process the observation:
      | Step | Action                                           |
      | 1    | Validate FHIR Observation resource               |
      | 2    | Extract patient reference: member-12345          |
      | 3    | Extract LOINC code: 4548-4                       |
      | 4    | Query equivalency: LOINC 4548-4 → CPT 83036      |
      | 5    | Check for duplicate within 72 hours              |
      | 6    | No duplicate found, process as new               |
      | 7    | Find open gap for member requiring 83036/4548-4  |
      | 8    | Verify service date within measurement period    |
      | 9    | Close gap status = "closed_compliant"            |
      | 10   | Update CDC-H9 numerator count (+1)               |
      | 11   | Store lab result for member record               |
      | 12   | Notify care coordinator                          |
    And care gap should be closed with:
      | Field               | Value                        |
      | closedDate          | 2025-11-20 14:15:00          |
      | closureReason       | Numerator compliance via lab |
      | serviceDate         | 2025-11-20                   |
      | serviceCodes        | ["LOINC:4548-4"]             |
      | verificationSource  | lab                          |
      | verificationId      | obs-lab-001                  |
    And care coordinator should receive notification:
      "Gap closed: HbA1c result received (6.5%)"

  Scenario: Lab result triggers new high-risk alert
    Given member M12345 has diabetes diagnosis
    And care gap "HbA1c Test" is now closed
    When system evaluates HbA1c result value: 10.2%
    And threshold for "Uncontrolled Diabetes" is >9%
    Then the system should:
      | Step | Action                                         |
      | 1    | Recognize result exceeds control threshold     |
      | 2    | Create new gap "Uncontrolled Diabetes - HbA1c >9%" |
      | 3    | Set clinical urgency = "Critical"              |
      | 4    | Assign to senior care coordinator immediately  |
      | 5    | Send provider alert to PCP                     |
      | 6    | Schedule urgent outreach within 24 hours       |
    And care coordinator should see critical alert:
      "⚠️ CRITICAL: Member M12345 HbA1c 10.2% (uncontrolled)"
```

**Acceptance Criteria:**
- [ ] Receives FHIR Observation resources via webhook
- [ ] Validates FHIR resource structure
- [ ] Extracts LOINC codes from observations
- [ ] Uses code equivalency to match CPT requirements
- [ ] Checks for duplicates before processing
- [ ] Closes care gaps immediately
- [ ] Stores lab results in member record
- [ ] Evaluates result values for clinical thresholds
- [ ] Creates new gaps for abnormal results

---

## Feature 4: X12 Claims Processing

### Story 8.4.1: Parse Inbound 837P Professional Claim
**As a** Claims Processor  
**I want** to automatically parse inbound 837P claims  
**So that** claims data is available for gap detection and adjudication

**Story Points:** 5  
**Priority:** High

```gherkin
Feature: Parse Inbound 837P Professional Claim
  Parse X12 837P EDI format into structured data

  Background:
    Given X12 clearinghouse sends 837P claim
    And claim is for member M12345
    And claim includes CPT 99213 (Office visit) and CPT 83036 (HbA1c)

  Scenario: Successfully parse 837P claim
    When the system receives X12 837P file:
      ```
      ISA*00*          *00*          *ZZ*SUBMITTER      *ZZ*RECEIVER       *251120*1430*^*00501*000000001*0*P*:~
      GS*HC*SUBMITTER*RECEIVER*20251120*1430*1*X*005010X222A1~
      ST*837*0001*005010X222A1~
      BHT*0019*00*12345*20251120*1430*CH~
      NM1*41*2*PROVIDER CLINIC*****46*123456789~
      NM1*IL*1*SMITH*JOHN****MI*M12345~
      CLM*CLAIM001*100.00***11:B:1*Y*A*Y*Y~
      HI*ABK:E11.9~
      LX*1~
      SV1*HC:99213*75.00*UN*1***1~
      LX*2~
      SV1*HC:83036*25.00*UN*1***1~
      SE*15*0001~
      GE*1*1~
      IEA*1*000000001~
      ```
    Then the system should parse all X12 segments:
      | Segment | Purpose               | Extracted Data            |
      | ISA     | Interchange header    | Sender, receiver, date    |
      | GS      | Functional group      | App sender/receiver       |
      | ST      | Transaction set       | Type: 837 (claim)         |
      | BHT     | Beginning of hierarchy| Claim transaction ID      |
      | NM1*41  | Submitter             | Provider clinic           |
      | NM1*IL  | Insured/patient       | Member M12345             |
      | CLM     | Claim info            | Claim ID, amount          |
      | HI      | Diagnosis codes       | E11.9 (Type 2 diabetes)   |
      | LX      | Service line          | Line 1, Line 2            |
      | SV1     | Professional service  | CPT 99213, CPT 83036      |
    And the system should create Claim record:
      | Field         | Value                      |
      | claimId       | CLAIM001                   |
      | memberId      | M12345                     |
      | providerId    | 123456789 (NPI)            |
      | claimDate     | 2025-11-20                 |
      | totalCharge   | $100.00                    |
      | claimType     | Professional               |
      | source        | X12_837P                   |
    And the system should create ClaimLine records:
      | Line | Code Type | Code   | Description | Charge  | Units |
      | 1    | CPT       | 99213  | Office visit| $75.00  | 1     |
      | 2    | CPT       | 83036  | HbA1c test  | $25.00  | 1     |
    And the system should create Diagnosis records:
      | Sequence | Code Type | Code  | Description         |
      | 1        | ICD-10-CM | E11.9 | Type 2 diabetes     |
    And the system should check for care gap closure:
      - Line 2 (CPT 83036) matches open gap "HbA1c Test Due"
      - Close gap if within measurement period

  Scenario: Handle invalid X12 format
    When the system receives malformed 837P file
    And ISA segment is missing required fields
    Then the system should:
      | Step | Action                                    |
      | 1    | Validate X12 syntax                       |
      | 2    | Identify error: "ISA segment invalid"     |
      | 3    | Send 999 Acknowledgment with error code   |
      | 4    | Log validation error                      |
      | 5    | Notify submitter of rejection reason      |
    And claim should NOT be created
    And error should be reported to clearinghouse
```

**Acceptance Criteria:**
- [ ] Parses all X12 837P segments
- [ ] Validates X12 syntax before processing
- [ ] Extracts member, provider, diagnosis, procedure codes
- [ ] Creates Claim and ClaimLine records
- [ ] Checks for care gap closure automatically
- [ ] Sends 999 Acknowledgment
- [ ] Handles errors gracefully with clear messages
- [ ] Logs all claims in audit trail

---

## Feature 5: CDA Document Processing

### Story 8.5.1: Parse Continuity of Care Document (CCD)
**As a** Care Coordinator  
**I want** to import member CCD from external provider  
**So that** I have complete medical history for care management

**Story Points:** 5  
**Priority:** Medium

```gherkin
Feature: Parse Continuity of Care Document (CCD)
  Import CDA CCD XML and extract clinical data

  Background:
    Given member M12345 is transitioning from external health plan
    And external plan sends CCD document

  Scenario: Import CCD and extract data
    When I upload CCD XML document
    Then the system should parse CDA structure:
      | Section                | CDA Template OID              |
      | Allergies              | 2.16.840.1.113883.10.20.22.2.6.1 |
      | Medications            | 2.16.840.1.113883.10.20.22.2.1.1 |
      | Problems               | 2.16.840.1.113883.10.20.22.2.5.1 |
      | Procedures             | 2.16.840.1.113883.10.20.22.2.7.1 |
      | Results                | 2.16.840.1.113883.10.20.22.2.3.1 |
      | Vital Signs            | 2.16.840.1.113883.10.20.22.2.4.1 |
    And the system should extract:
      **Allergies:**
      - Penicillin (severe reaction)
      - Sulfa drugs (rash)
      
      **Active Medications:**
      - Metformin 500mg twice daily
      - Lisinopril 10mg daily
      
      **Problem List:**
      - Type 2 Diabetes (ICD-10: E11.9)
      - Hypertension (ICD-10: I10)
      
      **Recent Lab Results:**
      - HbA1c: 7.2% (2025-09-15)
      - LDL: 110 mg/dL (2025-09-15)
    And the system should convert to FHIR Bundle:
      - AllergyIntolerance resources (2)
      - MedicationRequest resources (2)
      - Condition resources (2)
      - Observation resources (2)
    And the system should store in member's medical history
    And the system should check for care gaps:
      - Diabetes: HbA1c within 6 months ✓ (9/15)
      - Hypertension: BP check needed (last 90 days?)
```

**Acceptance Criteria:**
- [ ] Parses CDA XML structure
- [ ] Extracts all standard CCD sections
- [ ] Converts to FHIR Bundle
- [ ] Stores in member medical history
- [ ] Checks for care gaps based on imported data
- [ ] Handles missing sections gracefully
- [ ] Validates CDA against schema

---

## Feature 6: Graph Database Queries

### Story 8.6.1: Multi-Hop Graph Query for Care Coordination
**As a** Care Manager  
**I want** to find members with complex clinical patterns  
**So that** I can proactively coordinate care

**Story Points:** 5  
**Priority:** Medium

```gherkin
Feature: Multi-Hop Graph Query for Care Coordination
  Execute complex graph queries across multiple data sources

  Background:
    Given graph database contains:
      - Members (Patient nodes)
      - Diagnoses (Condition nodes)
      - Procedures (Procedure nodes)
      - Medications (Medication nodes)
      - Providers (Practitioner nodes)
      - Claims (Claim nodes)
      - Lab Results (Observation nodes)
    And all data is linked via relationships

  Scenario: Find members with uncontrolled diabetes needing specialist
    Given I want to identify high-risk diabetic members
    When I execute Cypher query:
      ```cypher
      // Find members with diabetes, high HbA1c, no endocrinology visit
      MATCH (m:Member)-[:HAS_DIAGNOSIS]->(d:Diagnosis)
      WHERE d.code IN ['E10.9', 'E11.9', 'E13.9']  // Diabetes
      
      // Check latest HbA1c
      MATCH (m)-[:HAD_LAB_TEST {result: hba1c}]->(lab:Lab)
      WHERE lab.code = '4548-4'  // LOINC HbA1c
      AND lab.date > date() - duration({months: 12})
      WITH m, max(lab.date) AS latestLabDate, hba1c
      WHERE hba1c > 9.0  // Uncontrolled
      
      // Exclude if already seeing endocrinologist
      WHERE NOT exists(
        (m)-[:SAW_PROVIDER]->(p:Provider {specialty: 'Endocrinology'})
      )
      
      // Get member details
      RETURN m.memberId, m.name, hba1c, latestLabDate
      ORDER BY hba1c DESC
      LIMIT 100
      ```
    Then the system should return matching members:
      | Member ID | Name        | HbA1c | Last Test  | Action Needed        |
      | M12345    | John Smith  | 10.5% | 2025-11-01 | Refer to Endo        |
      | M67890    | Jane Doe    | 9.8%  | 2025-10-15 | Refer to Endo        |
      | ...       | ...         | ...   | ...        | ...                  |
    And results should include relationship paths:
      - Member → Diagnosis → Lab Result
      - Member → Provider (missing Endocrinology)
    And I can export results to CSV for care coordinator assignment

  Scenario: Trace medication adherence impact on outcomes
    When I execute query to correlate medication adherence with HbA1c:
      ```cypher
      // Members on metformin with varying adherence
      MATCH (m:Member)-[:TAKES_MEDICATION {adherence: pdc}]->(med:Medication)
      WHERE med.code = 'metformin'
      
      // Get their HbA1c trends
      MATCH (m)-[:HAD_LAB_TEST {result: hba1c, date: labDate}]->(lab:Lab)
      WHERE lab.code = '4548-4'
      
      // Group by adherence level
      WITH 
        CASE 
          WHEN pdc >= 0.8 THEN 'High (≥80%)'
          WHEN pdc >= 0.5 THEN 'Medium (50-79%)'
          ELSE 'Low (<50%)'
        END AS adherenceGroup,
        avg(hba1c) AS avgHbA1c,
        count(m) AS memberCount
      
      RETURN adherenceGroup, avgHbA1c, memberCount
      ORDER BY avgHbA1c
      ```
    Then I should see correlation:
      | Adherence Group | Avg HbA1c | Members |
      | High (≥80%)     | 7.1%      | 450     |
      | Medium (50-79%) | 8.3%      | 280     |
      | Low (<50%)      | 9.7%      | 95      |
    And I can use this to prioritize adherence interventions
```

**Acceptance Criteria:**
- [ ] Executes Cypher queries on Neo4j/Neptune
- [ ] Traverses multiple relationships (3+ hops)
- [ ] Joins data from claims, EMR, labs
- [ ] Returns results <5 seconds for 100K member database
- [ ] Supports aggregations and analytics
- [ ] Can export results to CSV/Excel
- [ ] Visualizes relationship paths

---

## Feature 7: Deduplication Service

### Story 8.7.1: Deduplicate Events Across Data Sources
**As a** System  
**I want** to automatically detect duplicate events from multiple sources  
**So that** care gaps aren't incorrectly closed multiple times

**Story Points:** 8  
**Priority:** Critical

```gherkin
Feature: Deduplicate Events Across Data Sources
  Prevent duplicate care gap closures from same event reported by multiple systems

  Background:
    Given member M12345 had HbA1c test on 2025-11-20 at 9:00 AM
    And test was performed at Quest Diagnostics
    And deduplication window is set to 72 hours
    And code equivalencies are configured

  Scenario: Same test from 3 sources (Lab, EMR, Claim)
    # Event 1: Lab sends result
    When Quest lab sends FHIR Observation on 2025-11-20 at 11:00 AM:
      | Field              | Value                    |
      | Code               | LOINC 4548-4 (HbA1c)     |
      | Effective DateTime | 2025-11-20 09:00:00      |
      | Result             | 7.2%                     |
      | Source             | Quest Diagnostics        |
    Then the system should:
      | Step | Action                                        |
      | 1    | Receive FHIR Observation                      |
      | 2    | Parse: Member M12345, LOINC 4548-4, 9:00 AM   |
      | 3    | Query for duplicates: Member + Code equiv + Time window |
      | 4    | No duplicates found                           |
      | 5    | Process as PRIMARY event                      |
      | 6    | Close care gap "HbA1c Test Due"               |
      | 7    | Create DeduplicationEvent record              |
    And care gap should be closed
    And DeduplicationEvent should be:
      | Field              | Value                              |
      | primaryEventSource | lab                                |
      | primaryEventId     | obs-quest-001                      |
      | primaryEventDate   | 2025-11-20 09:00:00                |
      | primaryCode        | LOINC:4548-4                       |
      | duplicateCount     | 0 (so far)                         |

    # Event 2: Epic EMR sends same result
    When Epic EMR sends FHIR Observation on 2025-11-21 at 2:00 PM:
      | Field              | Value                    |
      | Code               | LOINC 4548-4 (HbA1c)     |
      | Effective DateTime | 2025-11-20 09:00:00      |
      | Result             | 7.2%                     |
      | Source             | Epic at Hospital         |
    Then the system should:
      | Step | Action                                           |
      | 1    | Receive FHIR Observation                         |
      | 2    | Parse: Member M12345, LOINC 4548-4, 9:00 AM      |
      | 3    | Query for duplicates within 72 hours             |
      | 4    | FIND primary event from Quest (same code, same date) |
      | 5    | Match score: 1.0 (exact code, exact time)        |
      | 6    | Mark as DUPLICATE of lab event                   |
      | 7    | DO NOT close gap again                           |
      | 8    | Update DeduplicationEvent: add EMR as duplicate  |
      | 9    | DO NOT send care coordinator alert               |
    And care gap should remain "closed" (not re-closed)
    And DeduplicationEvent should be updated:
      | Field              | Value                              |
      | duplicateCount     | 1                                  |
      | duplicateSources   | ["emr"]                            |
      | duplicateEventIds  | ["obs-epic-002"]                   |

    # Event 3: X12 claim arrives
    When claim with CPT 83036 arrives on 2025-11-25:
      | Field              | Value                    |
      | Code               | CPT 83036 (HbA1c)        |
      | Service Date       | 2025-11-20               |
      | Provider           | Quest Diagnostics        |
    Then the system should:
      | Step | Action                                           |
      | 1    | Receive X12 837 claim                            |
      | 2    | Parse: Member M12345, CPT 83036, 11/20           |
      | 3    | Query equivalency: CPT 83036 ↔ LOINC 4548-4      |
      | 4    | Query for duplicates: Equivalent codes + 72hr    |
      | 5    | FIND primary event from Quest (equivalent code)  |
      | 6    | Match score: 0.95 (equivalent code, same day)    |
      | 7    | Mark as DUPLICATE of lab event                   |
      | 8    | DO NOT close gap again                           |
      | 9    | Update DeduplicationEvent: add claim as duplicate|
      | 10   | Link claim to existing gap closure (audit)       |
    And care gap should remain "closed"
    And DeduplicationEvent should be updated:
      | Field              | Value                              |
      | duplicateCount     | 2                                  |
      | duplicateSources   | ["emr", "claim"]                   |
      | matchingCriteria   | equivalent_code + temporal_proximity |

  Scenario: Calculate deduplication savings
    When system generates monthly report
    Then report should show:
      | Metric                        | Value      |
      | Total events received         | 12,450     |
      | Unique events (after dedup)   | 5,280      |
      | Duplicates prevented          | 7,170      |
      | Deduplication rate            | 57.6%      |
      | Care coordinator alerts saved | 7,170      |
      | Est. time saved (5 min each)  | 597 hours  |
```

**Acceptance Criteria:**
- [ ] Detects duplicates within configurable time window (default 72 hours)
- [ ] Uses code equivalency for cross-system matching
- [ ] Matches by: Member + Code Equivalency + Service Date
- [ ] Confidence scoring for fuzzy matches
- [ ] Prioritizes data sources: EMR > Lab > Claims
- [ ] Prevents duplicate gap closures
- [ ] Prevents duplicate care coordinator alerts
- [ ] Creates comprehensive deduplication audit trail
- [ ] Generates deduplication savings reports

---

## Story Summary Table

| Story ID  | Story Name                                  | Points | Priority | Dependencies              |
|-----------|---------------------------------------------|--------|----------|---------------------------|
| 8.1.1     | Create Code Equivalency Mappings            | 3      | Critical | Code Management           |
| 8.1.2     | Query Code Equivalencies                    | 3      | Critical | Story 8.1.1               |
| 8.1.3     | Visualize Code Equivalency Network          | 5      | Medium   | Story 8.1.1               |
| 8.1.4     | Bulk Import Equivalencies                   | 2      | Medium   | Story 8.1.1               |
| 8.2.1     | Retrieve Patient from EMR                   | 3      | High     | FHIR server setup         |
| 8.2.2     | Subscribe to EMR Updates                    | 5      | Medium   | Story 8.2.1               |
| 8.2.3     | Sync All Patient Data                       | 5      | High     | Story 8.2.1               |
| 8.3.1     | Receive Lab Results via FHIR                | 5      | Critical | Code Equivalency, QM      |
| 8.3.2     | Lab Results Close Care Gaps                 | 3      | Critical | Story 8.3.1               |
| 8.4.1     | Parse Inbound 837P Professional Claim       | 5      | High     | X12 parser                |
| 8.4.2     | Parse Inbound 837I Institutional Claim      | 5      | High     | X12 parser                |
| 8.4.3     | Generate 835 Payment Remittance             | 3      | Medium   | Claims module             |
| 8.5.1     | Parse Continuity of Care Document (CCD)     | 5      | Medium   | CDA parser                |
| 8.5.2     | Generate CCD for Member                     | 5      | Medium   | Story 8.5.1               |
| 8.6.1     | Multi-Hop Graph Query                       | 5      | Medium   | Graph database            |
| 8.6.2     | Visualize Relationship Paths                | 3      | Low      | Story 8.6.1               |
| 8.7.1     | Deduplicate Events Across Data Sources      | 8      | Critical | Code Equivalency          |
| 8.7.2     | Deduplication Performance Tuning            | 5      | Medium   | Story 8.7.1               |

**Total: 68 story points**

---

## Implementation Recommendations

### Sprint Planning (2-week sprints)

**Sprint 1 (13 pts):** Code Equivalency Foundation
- 8.1.1: Create Code Equivalency Mappings (3 pts)
- 8.1.2: Query Code Equivalencies (3 pts)
- 8.1.4: Bulk Import Equivalencies (2 pts)
- 8.1.3: Visualize Network (5 pts)

**Sprint 2 (13 pts):** FHIR Patient Integration
- 8.2.1: Retrieve Patient from EMR (3 pts)
- 8.2.3: Sync All Patient Data (5 pts)
- 8.2.2: Subscribe to EMR Updates (5 pts)

**Sprint 3 (13 pts):** Lab Results Integration
- 8.3.1: Receive Lab Results via FHIR (5 pts)
- 8.3.2: Lab Results Close Care Gaps (3 pts)
- 8.7.1: Deduplicate Events (8 pts) - START

**Sprint 4 (13 pts):** X12 Claims
- 8.4.1: Parse 837P (5 pts)
- 8.4.2: Parse 837I (5 pts)
- 8.4.3: Generate 835 (3 pts)

**Sprint 5 (16 pts):** CDA & Graph Database
- 8.5.1: Parse CCD (5 pts)
- 8.5.2: Generate CCD (5 pts)
- 8.6.1: Multi-Hop Queries (5 pts)
- 8.7.2: Deduplication Tuning (5 pts) - if time allows

---

## Success Criteria

### Functional
- [ ] All 24 user stories pass acceptance tests
- [ ] Code equivalency coverage >80% of active codes
- [ ] FHIR R4 US Core compliance 100%
- [ ] X12 5010 compliance 100%
- [ ] CDA R2 compliance 100%

### Non-Functional
- [ ] API response time <200ms (p95) for equivalency lookup
- [ ] Deduplication accuracy >95% precision, >90% recall
- [ ] Handle 10,000+ FHIR events per day
- [ ] Handle 100,000+ X12 claims per month
- [ ] Graph queries <5 seconds for 100K members

### Business Outcomes
- [ ] Duplicate alerts reduced by 70-80%
- [ ] Real-time care gap closure (<5 seconds from lab result)
- [ ] EMR integrations: 3+ (Epic, Cerner, +1)
- [ ] Lab integrations: 2+ (LabCorp, Quest)
- [ ] CMS Interoperability Final Rule compliance

