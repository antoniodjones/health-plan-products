# EPIC 9: Member Care Engine - User Stories

**Epic:** Member Care Engine  
**Dependencies:** Claims Module (Epic 7), Quality Measures (Epic 6), Code Equivalency Mapping (Epic 8)  
**Total Story Points:** 52  
**Stories:** 18 stories across 7 features

---

## Feature 1: Real-Time Gap Detection

### Story 9.1.1: EMR Lab Result Gap Closure
**As a** Care Coordinator  
**I want** the system to detect when EMR lab results close care gaps  
**So that** I can immediately remove members from outreach lists

**Story Points:** 3  
**Priority:** High

```gherkin
Feature: EMR Lab Result Gap Closure
  Real-time detection and closure of care gaps based on EMR lab results

  Background:
    Given the Member Care Engine is running
    And code equivalency mappings are configured
    And quality measure CDC-H9 is active with numerator codes:
      | Code Type | Code     | Description        |
      | CPT       | 83036    | HbA1c Test         |
      | LOINC     | 4548-4   | HbA1c in Blood     |
      | LOINC     | 17855-8  | HbA1c/Hemoglobin   |

  Scenario: EMR lab result closes open gap
    Given member M12345 has the following profile:
      | Attribute              | Value                |
      | Member ID              | M12345               |
      | DOB                    | 1975-03-15           |
      | Diagnosis              | E11.9 (Type 2 DM)    |
      | Product                | Medicare Advantage   |
    And member has open care gap:
      | Measure ID  | Gap Description        | Days Overdue | Status |
      | CDC-H9      | HbA1c Test Due         | 45           | open   |
    And gap was identified 30 days ago from claims data
    And member is on outreach list for care coordinator Sarah
    When Epic EMR sends FHIR Observation at 2024-11-15 10:30 AM:
      ```json
      {
        "resourceType": "Observation",
        "id": "obs-12345",
        "status": "final",
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "4548-4",
            "display": "Hemoglobin A1c/Hemoglobin.total in Blood"
          }]
        },
        "subject": { "reference": "Patient/M12345" },
        "effectiveDateTime": "2024-11-14",
        "valueQuantity": {
          "value": 6.8,
          "unit": "%",
          "system": "http://unitsofmeasure.org"
        }
      }
      ```
    Then the system should perform the following actions:
      | Step | Action                                                          |
      | 1    | Map LOINC 4548-4 to CPT 83036 via equivalency table           |
      | 2    | Check for duplicate events within 72 hours                      |
      | 3    | Verify service date (2024-11-14) is within measurement period  |
      | 4    | Close care gap status to "closed_compliant"                     |
      | 5    | Set closure date to 2024-11-15 10:30 AM                        |
      | 6    | Set closure reason to "Numerator compliance via EMR"            |
      | 7    | Remove member M12345 from Sarah's outreach list                |
      | 8    | Update CDC-H9 numerator count (+1)                              |
      | 9    | Send notification to Sarah: "Gap closed - HbA1c result received"|
      | 10   | Log event in audit trail                                        |
    And the care gap should have the following final state:
      | Field                | Value                          |
      | status               | closed_compliant               |
      | closedDate           | 2024-11-15 10:30:00            |
      | closureReason        | Numerator compliance via EMR   |
      | serviceDate          | 2024-11-14                     |
      | serviceCodes         | ["LOINC:4548-4"]               |
      | verificationSource   | emr                            |
      | verificationId       | obs-12345                      |

  Scenario: EMR result for member not in denominator (no gap to close)
    Given member M12346 does NOT have a diabetes diagnosis
    And member M12346 does NOT have open care gap for CDC-H9
    When Epic EMR sends HbA1c FHIR Observation (LOINC 4548-4)
    Then the system should perform the following actions:
      | Step | Action                                                  |
      | 1    | Receive and validate FHIR Observation                   |
      | 2    | Check if member M12346 has CDC-H9 denominator diagnosis |
      | 3    | Determine member is NOT in denominator                  |
      | 4    | Log observation for future reference                    |
      | 5    | Do NOT create or close any care gap                     |
      | 6    | Do NOT send any notifications                           |
    And no care gap should be created or modified
    And no alerts should be sent

  Scenario: EMR result outside measurement period (doesn't close gap)
    Given member M12347 has open care gap for CDC-H9
    And measurement period is 2024-01-01 to 2024-12-31
    When Epic EMR sends HbA1c FHIR Observation dated 2023-12-15 (prior year)
    Then the system should perform the following actions:
      | Step | Action                                                          |
      | 1    | Receive and validate FHIR Observation                          |
      | 2    | Check service date: 2023-12-15                                  |
      | 3    | Compare to measurement period: 2024-01-01 to 2024-12-31        |
      | 4    | Determine service date is OUTSIDE measurement period            |
      | 5    | Do NOT close the care gap                                       |
      | 6    | Log observation with note "Outside measurement period"          |
      | 7    | Keep gap status as "open"                                       |
    And the care gap should remain "open"
    And member should remain on outreach list
    And care coordinator should NOT be notified of closure

  Scenario: EMR result closes gap but triggers new higher-level gap
    Given member M12348 has open care gap "HbA1c Test Due"
    When Epic EMR sends HbA1c result with value 9.2% (uncontrolled)
    Then the system should:
      | Step | Action                                                          |
      | 1    | Close gap "HbA1c Test Due" as compliant                        |
      | 2    | Evaluate result value: 9.2% (threshold: >9% = uncontrolled)    |
      | 3    | Open NEW gap "Uncontrolled Diabetes - HbA1c >9%"               |
      | 4    | Tag new gap as "Critical" priority                              |
      | 5    | Assign to care coordinator immediately                          |
      | 6    | Trigger provider alert to PCP                                   |
      | 7    | Schedule urgent outreach within 48 hours                        |
    And member should be removed from "HbA1c Test Due" list
    And member should be added to "Uncontrolled Diabetes" critical list
    And PCP should receive secure message about critical result
```

**Acceptance Criteria:**
- [ ] System maps LOINC codes to CPT codes via equivalency table
- [ ] System checks for duplicates before processing
- [ ] System validates service date is within measurement period
- [ ] Care gaps are closed in real-time (< 1 second)
- [ ] Care coordinators are notified immediately
- [ ] Member is removed from outreach list
- [ ] Audit trail captures all actions
- [ ] Measure numerator count is updated
- [ ] System handles out-of-period results gracefully
- [ ] System detects and acts on critical result values

---

### Story 9.1.2: Duplicate Detection Across Data Sources
**As a** Care Coordinator  
**I want** the system to prevent duplicate alerts from the same event across multiple data sources  
**So that** I don't waste time on false positives

**Story Points:** 5  
**Priority:** Critical

```gherkin
Feature: Duplicate Detection Across Data Sources
  Prevent duplicate care gap closures from same event reported by multiple sources

  Background:
    Given the Member Care Engine is running
    And code equivalency mappings are configured
    And deduplication window is set to 72 hours

  Scenario: Same test reported by claims, lab, and EMR
    Given member M67890 had HbA1c test on 2024-11-01 at 10:00 AM
    And the test was performed at Quest Diagnostics
    When the system receives the following events:
      | Source | Timestamp             | Code Type | Code    | Description        |
      | Claim  | 2024-11-03 14:30:00   | CPT       | 83036   | HbA1c Test         |
      | Lab    | 2024-11-01 16:45:00   | LOINC     | 4548-4  | HbA1c in Blood     |
      | EMR    | 2024-11-02 09:15:00   | LOINC     | 4548-4  | HbA1c in Blood     |
    Then the system should process events in this order:
      | Event # | Source | Timestamp           | Action                          |
      | 1       | Lab    | 2024-11-01 16:45:00 | Process as PRIMARY event        |
      | 2       | EMR    | 2024-11-02 09:15:00 | Detect as DUPLICATE of Lab      |
      | 3       | Claim  | 2024-11-03 14:30:00 | Detect as DUPLICATE of Lab      |
    And the system should create deduplication record:
      | Field                     | Value                                    |
      | memberId                  | M67890                                   |
      | primaryEventSource        | lab                                      |
      | primaryEventId            | lab-event-001                            |
      | primaryEventDate          | 2024-11-01 10:00:00                      |
      | primaryCode               | LOINC:4548-4                             |
      | duplicateCount            | 2                                        |
      | duplicateSources          | ["emr", "claim"]                         |
      | matchingCriteria          | equivalent_code + temporal_proximity     |
      | temporalWindow            | 72 hours                                 |
      | confidence                | 0.95                                     |
    And the care gap should be closed exactly ONCE
    And care coordinator should receive ONE notification (not three)
    And deduplication should save care coordinator approximately 10 minutes

  Scenario: Multiple claims from same visit (unbundled codes)
    Given member M67891 had a comprehensive metabolic panel on 2024-11-05
    When the system receives multiple claims for the same date:
      | Claim ID  | Code Type | Code  | Description              | Service Date |
      | CLM-001   | CPT       | 82947 | Glucose Blood Test       | 2024-11-05   |
      | CLM-002   | CPT       | 84132 | Potassium                | 2024-11-05   |
      | CLM-003   | CPT       | 82565 | Creatinine               | 2024-11-05   |
      | CLM-004   | CPT       | 80053 | Comprehensive Panel      | 2024-11-05   |
    And member has gap "Diabetes Monitoring - Annual Lab Panel"
    And the gap requires codes: [80053 OR (82947 AND 84132 AND 82565)]
    Then the system should:
      | Step | Action                                                          |
      | 1    | Receive all 4 claims                                           |
      | 2    | Recognize 80053 as comprehensive panel (includes others)        |
      | 3    | Mark CLM-001, CLM-002, CLM-003 as components of CLM-004        |
      | 4    | Close care gap using primary code 80053                         |
      | 5    | Log all 4 codes as supporting evidence                          |
      | 6    | Send ONE notification (not four)                                |
    And the care gap closure should reference:
      | Field           | Value                           |
      | primaryCode     | CPT:80053                       |
      | relatedCodes    | ["82947", "84132", "82565"]     |
      | closureNotes    | "Comprehensive panel includes required components" |

  Scenario: Different tests on same day (NOT duplicates)
    Given member M67892 had two DIFFERENT tests on 2024-11-08:
      | Test              | Time     | Code Type | Code    |
      | HbA1c Test        | 08:30 AM | CPT       | 83036   |
      | Lipid Panel       | 08:35 AM | CPT       | 80061   |
    When the system receives both events
    Then the system should recognize them as DISTINCT events
    And the system should:
      | Step | Action                                                          |
      | 1    | Process HbA1c test (83036)                                     |
      | 2    | Check for duplicates within 72 hours                            |
      | 3    | Find no equivalent codes                                        |
      | 4    | Process as separate event                                       |
      | 5    | Process Lipid Panel (80061)                                     |
      | 6    | Check for duplicates                                            |
      | 7    | Find no equivalent codes                                        |
      | 8    | Process as separate event                                       |
      | 9    | Close HbA1c gap if applicable                                   |
      | 10   | Close Lipid Panel gap if applicable                             |
    And both gaps should be closed (not deduplicated)
    And care coordinator should receive TWO notifications

  Scenario: Delayed claim for service already reported by EMR
    Given member M67893 had colonoscopy on 2024-10-15
    And Epic EMR sent procedure (CPT 45378) on 2024-10-15
    And the system closed care gap "Colorectal Cancer Screening"
    When claim for same colonoscopy arrives 45 days later on 2024-11-29
    Then the system should:
      | Step | Action                                                          |
      | 1    | Receive claim with CPT 45378 for service date 2024-10-15      |
      | 2    | Look back for events with same code within 90 days              |
      | 3    | Find EMR event from 2024-10-15 with same code                   |
      | 4    | Mark claim as duplicate (late arrival)                          |
      | 5    | Do NOT reopen or re-close the gap                               |
      | 6    | Link claim to existing gap closure for audit                    |
      | 7    | Do NOT send notification to care coordinator                    |
    And the existing gap closure should be updated:
      | Field                    | Value                                    |
      | additionalVerification   | ["claim:CLM-67893"]                      |
      | verificationNote         | "Claim received 45 days after EMR event" |
```

**Acceptance Criteria:**
- [ ] System deduplicates events within 72-hour window
- [ ] System uses code equivalency mappings for matching
- [ ] System prioritizes data sources: EMR > Lab > Claims
- [ ] System creates deduplication audit records
- [ ] Care coordinators receive single notification per event
- [ ] System handles unbundled claims correctly
- [ ] System distinguishes between duplicates and distinct events
- [ ] System handles delayed claims without re-alerting

---

### Story 9.1.3: New Gap Detection from Diagnosis
**As a** Care Management System  
**I want** to automatically add members to quality measure denominators when qualifying diagnoses are recorded  
**So that** care gaps are identified as soon as members become eligible

**Story Points:** 3  
**Priority:** High

```gherkin
Feature: New Gap Detection from Diagnosis
  Automatically identify new care gaps when qualifying diagnoses are added

  Background:
    Given quality measure CDC-H9 (Diabetes HbA1c) is active
    And denominator includes diagnosis codes:
      | Code Type | Code   | Description            |
      | ICD-10-CM | E10.9  | Type 1 Diabetes        |
      | ICD-10-CM | E11.9  | Type 2 Diabetes        |
      | ICD-10-CM | E13.9  | Other Diabetes         |
      | ICD-10-CM | O24.4  | Gestational Diabetes   |
    And measurement period is 2024-01-01 to 2024-12-31

  Scenario: New diabetes diagnosis triggers gap detection
    Given member M11111 has the following profile:
      | Attribute         | Value              |
      | Member ID         | M11111             |
      | DOB               | 1965-08-20         |
      | Product           | Commercial PPO     |
      | Enrollment Date   | 2024-01-01         |
    And member does NOT have any diabetes diagnoses
    And member is NOT in CDC-H9 denominator
    When Epic EMR sends encounter on 2024-11-10:
      ```json
      {
        "resourceType": "Encounter",
        "id": "enc-12345",
        "status": "finished",
        "class": { "code": "AMB" },
        "subject": { "reference": "Patient/M11111" },
        "period": {
          "start": "2024-11-10T09:00:00Z",
          "end": "2024-11-10T09:30:00Z"
        },
        "diagnosis": [{
          "condition": {
            "reference": "Condition/cond-12345",
            "display": "Type 2 Diabetes Mellitus"
          },
          "use": { "coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "AD",
            "display": "Admission diagnosis"
          }]},
          "rank": 1
        }]
      }
      ```
    And the referenced Condition resource is:
      ```json
      {
        "resourceType": "Condition",
        "id": "cond-12345",
        "clinicalStatus": { "coding": [{ "code": "active" }] },
        "verificationStatus": { "coding": [{ "code": "confirmed" }] },
        "code": {
          "coding": [{
            "system": "http://hl7.org/fhir/sid/icd-10-cm",
            "code": "E11.9",
            "display": "Type 2 diabetes mellitus without complications"
          }]
        },
        "subject": { "reference": "Patient/M11111" },
        "onsetDateTime": "2024-11-10"
      }
      ```
    Then the system should perform the following workflow:
      | Step | Action                                                          |
      | 1    | Receive and parse FHIR Encounter and Condition                 |
      | 2    | Extract diagnosis code: E11.9                                   |
      | 3    | Query quality measures for codes matching E11.9                 |
      | 4    | Find CDC-H9 denominator includes E11.9                          |
      | 5    | Add member M11111 to CDC-H9 denominator                        |
      | 6    | Check if member has HbA1c test in last 12 months               |
      | 7    | Determine NO HbA1c test found                                   |
      | 8    | Create NEW care gap "Diabetes HbA1c Test Due"                  |
      | 9    | Calculate priority score based on clinical risk                 |
      | 10   | Assign gap to care coordinator queue                            |
      | 11   | Schedule member outreach based on priority                      |
    And a new care gap should be created:
      | Field                    | Value                                    |
      | memberId                 | M11111                                   |
      | measureId                | CDC-H9                                   |
      | gapType                  | missing_service                          |
      | description              | Diabetes HbA1c Test Due                  |
      | requiredAction           | HbA1c test within 12 months              |
      | clinicalUrgency          | medium                                   |
      | status                   | open                                     |
      | identifiedDate           | 2024-11-10                               |
      | identifiedSource         | emr                                      |
      | measurementPeriodStart   | 2024-01-01                               |
      | measurementPeriodEnd     | 2024-12-31                               |
      | daysOverdue              | 0                                        |
    And care coordinator should receive notification:
      """
      New Care Gap Identified
      Member: M11111
      Measure: CDC-H9 (Diabetes HbA1c)
      Trigger: New diagnosis E11.9 (Type 2 Diabetes)
      Action: Schedule HbA1c test within 12 months
      Priority: Medium
      """

  Scenario: Multiple qualifying diagnoses on same encounter
    Given member M11112 has encounter with 3 diagnoses:
      | Code   | Description                    | Measure Triggered |
      | E11.9  | Type 2 Diabetes                | CDC-H9            |
      | I10    | Essential Hypertension         | CBP               |
      | E78.5  | Hyperlipidemia                 | N/A               |
    When the system processes the encounter
    Then the system should:
      | Step | Action                                                          |
      | 1    | Process E11.9 → Add to CDC-H9 denominator                      |
      | 2    | Create gap "Diabetes HbA1c Test" if not compliant              |
      | 3    | Process I10 → Add to CBP denominator                            |
      | 4    | Create gap "Blood Pressure Control" if not compliant           |
      | 5    | Process E78.5 → No quality measure applies                      |
      | 6    | Consolidate gaps for member M11112                              |
      | 7    | Calculate bundled outreach strategy                             |
      | 8    | Send single notification with both gaps                         |
    And member should have 2 new care gaps created
    And care coordinator should receive ONE consolidated notification

  Scenario: Historical diagnosis (already in denominator)
    Given member M11113 already has diagnosis E11.9 from 2023-06-15
    And member is already in CDC-H9 denominator
    And member has open care gap "Diabetes HbA1c Test Due"
    When Epic EMR sends encounter on 2024-11-12 with same diagnosis E11.9
    Then the system should:
      | Step | Action                                                          |
      | 1    | Receive encounter with diagnosis E11.9                         |
      | 2    | Check if member already in CDC-H9 denominator                   |
      | 3    | Determine member ALREADY in denominator                         |
      | 4    | Update diagnosis date to most recent: 2024-11-12                |
      | 5    | Do NOT create duplicate care gap                                |
      | 6    | Do NOT send notification                                        |
    And no new care gap should be created
    And existing gap should remain unchanged

  Scenario: Rule out diagnosis (not confirmed)
    Given member M11114 has encounter with diagnosis:
      ```json
      {
        "code": { "coding": [{ "code": "E11.9" }] },
        "clinicalStatus": { "coding": [{ "code": "active" }] },
        "verificationStatus": { "coding": [{ "code": "provisional" }] }
      }
      ```
    And verificationStatus is "provisional" (not confirmed)
    When the system processes the diagnosis
    Then the system should:
      | Step | Action                                                          |
      | 1    | Parse diagnosis E11.9                                          |
      | 2    | Check verificationStatus: "provisional"                         |
      | 3    | Recognize diagnosis is NOT confirmed                            |
      | 4    | Do NOT add member to CDC-H9 denominator                        |
      | 5    | Do NOT create care gap                                          |
      | 6    | Log diagnosis as "provisional" for monitoring                   |
    And no care gap should be created
    And member should not be added to denominator
```

**Acceptance Criteria:**
- [ ] System processes FHIR Encounter and Condition resources
- [ ] System extracts diagnosis codes from encounters
- [ ] System matches diagnoses to quality measure denominators
- [ ] System creates care gaps for new denominator members
- [ ] System checks for existing compliance before creating gap
- [ ] System calculates priority scores for new gaps
- [ ] System assigns gaps to care coordinator queues
- [ ] System consolidates multiple gaps into single notification
- [ ] System ignores provisional/unconfirmed diagnoses
- [ ] System handles duplicate diagnoses gracefully

---

## Feature 2: Risk-Based Prioritization

### Story 9.2.1: High-Risk Member Prioritization
**As a** Care Management Director  
**I want** care gaps prioritized by clinical risk and cost impact  
**So that** staff focus on highest-value interventions

**Story Points:** 3  
**Priority:** High

```gherkin
Feature: High-Risk Member Prioritization
  Automatically prioritize care gaps based on member risk profile

  Background:
    Given risk stratification model is trained and active
    And cost impact data is available from claims history
    And clinical urgency rules are configured

  Scenario: Critical priority member with multiple risk factors
    Given member M22222 has the following risk profile:
      | Risk Factor                | Value                |
      | Age                        | 68                   |
      | Chronic Conditions         | 4 (DM, CHF, CKD, HTN)|
      | HCC Risk Score             | 3.8                  |
      | Predicted Annual Cost      | $85,000              |
      | ER Visits (last 12 months) | 4                    |
      | Hospital Admissions        | 2                    |
      | Medication Adherence (PDC) | 45%                  |
      | No-Show Rate               | 30%                  |
      | SDOH Risk Flags            | Food insecurity, transportation |
    When the system identifies new gap "Diabetic Eye Exam Overdue" (180 days)
    Then the system should calculate priority score:
      | Component               | Weight | Score | Weighted |
      | Clinical Urgency        | 40%    | 90    | 36       |
      | HCC Risk Score          | 25%    | 95    | 23.75    |
      | Cost Impact             | 20%    | 100   | 20       |
      | Days Overdue            | 10%    | 75    | 7.5      |
      | Engagement Risk         | 5%     | 80    | 4        |
      | TOTAL PRIORITY SCORE    |        |       | 91.25    |
    And the gap should be tagged as "CRITICAL PRIORITY"
    And the gap should be assigned to "Senior Care Coordinator"
    And outreach should be scheduled within 24 hours
    And provider should receive care alert
    And case should be escalated to care management nurse
    And gap should appear at TOP of all coordinator worklists

  Scenario: Low-risk member with routine gap
    Given member M22223 has the following risk profile:
      | Risk Factor                | Value                |
      | Age                        | 35                   |
      | Chronic Conditions         | 0                    |
      | HCC Risk Score             | 0.3                  |
      | Predicted Annual Cost      | $2,500               |
      | ER Visits (last 12 months) | 0                    |
      | Hospital Admissions        | 0                    |
      | Medication Adherence       | N/A                  |
      | No-Show Rate               | 5%                   |
      | SDOH Risk Flags            | None                 |
    When the system identifies gap "Annual Wellness Visit Due" (30 days)
    Then the system should calculate priority score:
      | Component               | Weight | Score | Weighted |
      | Clinical Urgency        | 40%    | 10    | 4        |
      | HCC Risk Score          | 25%    | 5     | 1.25     |
      | Cost Impact             | 20%    | 5     | 1        |
      | Days Overdue            | 10%    | 15    | 1.5      |
      | Engagement Risk         | 5%     | 10    | 0.5      |
      | TOTAL PRIORITY SCORE    |        |       | 8.25     |
    And the gap should be tagged as "ROUTINE PRIORITY"
    And outreach should be scheduled via automated campaign (email)
    And no care coordinator assignment required
    And no provider alert sent

  Scenario: Re-prioritization when risk changes
    Given member M22224 has medium priority gap (score 55)
    And gap is scheduled for outreach in 7 days
    When member has unexpected ER visit on 2024-11-14
    And ER visit is for uncontrolled diabetes (HbA1c 12.5%)
    Then the system should:
      | Step | Action                                                          |
      | 1    | Receive ER visit data (ADT feed or claim)                      |
      | 2    | Re-calculate member risk score (increase from 1.5 to 2.8)      |
      | 3    | Re-calculate priority score for ALL open gaps                   |
      | 4    | Update gap priority from "Medium (55)" to "High (78)"          |
      | 5    | Escalate outreach from "7 days" to "24 hours"                  |
      | 6    | Re-assign from automated campaign to care coordinator           |
      | 7    | Send alert to care coordinator                                  |
      | 8    | Notify provider of high-risk status change                      |
    And gap should be moved to TOP of coordinator's worklist
```

**Acceptance Criteria:**
- [ ] System calculates priority scores using weighted algorithm
- [ ] Priority components: clinical urgency, HCC score, cost, days overdue, engagement
- [ ] Gaps tagged as Critical, High, Medium, or Routine
- [ ] Critical gaps assigned to senior coordinators within 24 hours
- [ ] Routine gaps handled by automated campaigns
- [ ] System re-prioritizes when member risk changes
- [ ] Priority scores visible to coordinators
- [ ] Worklists automatically sorted by priority

---

### Story 9.2.2: Bundled Outreach Strategy
**As a** Care Coordinator  
**I want** the system to suggest bundled outreach for members with multiple gaps  
**So that** I can address multiple needs in a single interaction

**Story Points:** 2  
**Priority:** Medium

```gherkin
Feature: Bundled Outreach Strategy
  Recommend consolidated outreach when members have multiple care gaps

  Scenario: Multiple gaps with same provider
    Given member M33333 has 5 open care gaps:
      | Gap                         | Clinical Urgency | Days Overdue | Provider       |
      | Diabetic Eye Exam           | High             | 180          | Dr. Patel (OD) |
      | Diabetic Foot Exam          | High             | 120          | Dr. Smith (PCP)|
      | HbA1c Test                  | Medium           | 60           | Dr. Smith (PCP)|
      | Blood Pressure Measurement  | High             | 30           | Dr. Smith (PCP)|
      | Medication Adherence Review | Low              | 15           | Dr. Smith (PCP)|
    When care coordinator views member's care plan
    Then the system should display gaps sorted by:
      | Sort Priority | Field            |
      | 1             | Clinical Urgency |
      | 2             | Days Overdue     |
    And the system should suggest bundled outreach strategy:
      """
      BUNDLED STRATEGY RECOMMENDED
      
      Bundle 1: Dr. Smith (PCP) - 4 gaps
      - Blood Pressure Measurement (High, 30 days)
      - Diabetic Foot Exam (High, 120 days)
      - HbA1c Test (Medium, 60 days)
      - Medication Adherence Review (Low, 15 days)
      
      Recommended Action:
      Schedule comprehensive diabetic care visit with Dr. Smith
      Duration: 45 minutes
      All 4 services can be completed in single visit
      
      Bundle 2: Dr. Patel (Ophthalmology) - 1 gap
      - Diabetic Eye Exam (High, 180 days)
      
      Recommended Action:
      Schedule diabetic retinopathy screening
      Duration: 30 minutes
      Can be scheduled same week as PCP visit
      """
    And the system should provide one-click actions:
      | Action                          | Details                           |
      | Schedule with Dr. Smith         | Pre-populated 45-min appointment  |
      | Schedule with Dr. Patel         | Pre-populated 30-min appointment  |
      | Send member outreach            | Pre-filled message with both gaps |
      | Arrange transportation          | If SDOH barrier identified        |

  Scenario: Preventive care season bundling
    Given it is October (flu season)
    And member M33334 has gaps:
      | Gap                      | Due Date     | Can Bundle |
      | Flu Shot                 | 2024-12-31   | Yes        |
      | Pneumococcal Vaccine     | 2024-12-31   | Yes        |
      | Annual Wellness Visit    | 2024-11-30   | Yes        |
    When the system generates outreach recommendation
    Then the system should suggest:
      """
      PREVENTIVE CARE BUNDLE
      
      Recommended: Single visit can close 3 gaps
      - Annual Wellness Visit (primary service)
      - Flu Shot (can be administered same visit)
      - Pneumococcal Vaccine (can be administered same visit)
      
      Member Benefits:
      - One appointment instead of three
      - No additional copays (preventive)
      - Saves member time
      
      Quality Impact:
      - 3 HEDIS measures closed
      - Improves STAR ratings
      - $150 quality incentive payment
      """
```

**Acceptance Criteria:**
- [ ] System identifies gaps that can be addressed in single visit
- [ ] System groups gaps by provider
- [ ] System considers clinical appropriateness of bundling
- [ ] System shows time/cost savings to member
- [ ] System provides one-click scheduling actions
- [ ] System identifies transportation needs
- [ ] Bundling suggestions increase coordinator efficiency by 30%

---

## Feature 3: Multi-Channel Member Outreach

### Story 9.3.1: Preferred Channel Outreach
**As a** Member  
**I want** to receive care reminders through my preferred communication channel  
**So that** I am more likely to see and respond to important health information

**Story Points:** 3  
**Priority:** High

```gherkin
Feature: Preferred Channel Outreach
  Send personalized outreach via member's preferred communication channel

  Background:
    Given member communication preferences are stored
    And outreach message templates are configured by channel
    And message personalization engine is active

  Scenario: Spanish-speaking member prefers SMS
    Given member M44444 has communication preferences:
      | Preference           | Value                      |
      | Primary Channel      | SMS                        |
      | Secondary Channel    | Email                      |
      | Language             | Spanish                    |
      | Preferred Time       | Weekday mornings (8-11 AM) |
      | Health Literacy      | Low (6th grade level)      |
      | Mobile Number        | +1-555-0123                |
      | SMS Consent          | Yes                        |
    And member has care gap "Mammogram Overdue"
    When the system schedules member outreach on Tuesday at 9:00 AM
    Then the system should generate SMS message in Spanish:
      """
      Hola Maria,
      
      Es hora de su mamografía anual. Este examen es gratis y puede salvar su vida.
      
      ¿Podemos ayudarle a programar su cita? Responda SÍ.
      
      - Su plan de salud
      """
    And the message should use simple language (6th grade reading level)
    And the message should be sent via SMS to +1-555-0123
    And the message should be sent on Tuesday at 9:00 AM
    And the message should include response handling:
      | Member Reply | System Action                                |
      | SÍ / YES     | Send scheduling link + coordinator callback  |
      | NO           | Ask about barriers                           |
      | YA LO HICE   | Request proof or search claims/EMR           |
      | ?            | Send more information about mammogram        |

  Scenario: English-speaking member prefers email with links
    Given member M44445 has communication preferences:
      | Preference           | Value                      |
      | Primary Channel      | Email                      |
      | Language             | English                    |
      | Preferred Time       | Evenings (6-8 PM)          |
      | Health Literacy      | High (college level)       |
      | Email                | john.smith@email.com       |
    And member has care gap "Colorectal Cancer Screening Due"
    When the system schedules outreach on Wednesday at 7:00 PM
    Then the system should generate email:
      """
      Subject: Time for Your Colorectal Cancer Screening
      
      Hi John,
      
      Our records show you're due for colorectal cancer screening. Early detection
      saves lives - this screening is one of the most important preventive services
      you can have.
      
      You have options:
      • Colonoscopy (every 10 years)
      • Cologuard home test (every 3 years)
      • FIT test (annually)
      
      [Schedule Colonoscopy] [Order Cologuard] [Learn More]
      
      Questions? Reply to this email or call us at 1-800-555-0199.
      
      - Your Care Team
      """
    And email should be sent to john.smith@email.com
    And email should be sent Wednesday at 7:00 PM
    And email should include tracking pixels for opens/clicks

  Scenario: Member portal notification with app push
    Given member M44446 uses the mobile app regularly
    And member has push notifications enabled
    And member has care gap "Diabetic Eye Exam Due"
    When the system schedules outreach
    Then the system should:
      | Channel       | Message                                                    |
      | Push Notify   | "⏰ Diabetic Eye Exam Due - Tap to schedule"              |
      | In-App Inbox  | Full message with scheduling options                       |
      | Email         | Follow-up email if no action in 48 hours                   |
    And push notification should deep-link to gap details in app
    And in-app message should show available ophthalmologists
    And one-click scheduling should be available
```

**Acceptance Criteria:**
- [ ] System respects member's preferred channel
- [ ] System translates messages to member's preferred language
- [ ] System adjusts reading level based on health literacy
- [ ] System sends messages at member's preferred time
- [ ] System includes appropriate call-to-action buttons/links
- [ ] System handles member responses automatically
- [ ] System tracks delivery, opens, clicks, responses
- [ ] Member response rate increases by 40% vs. generic outreach

---

### Story 9.3.2: Multi-Touch Campaign
**As a** Care Management System  
**I want** to automatically escalate outreach when members don't respond  
**So that** critical care gaps don't go unaddressed

**Story Points:** 3  
**Priority:** High

```gherkin
Feature: Multi-Touch Campaign
  Automatically escalate outreach through multiple channels and touchpoints

  Background:
    Given multi-touch campaigns are configured
    And escalation rules are defined by gap urgency

  Scenario: Critical gap - aggressive outreach
    Given member M55555 has care gap "Diabetic Retinopathy Screening"
    And gap urgency is "Critical" (HCC 3.5, 270 days overdue)
    And member preferences: SMS primary, phone secondary
    When the multi-touch campaign starts on Day 0
    Then the system should execute this campaign:
      | Day | Touchpoint | Channel | Action                                    |
      | 0   | Touch 1    | SMS     | Initial alert + scheduling link           |
      | 3   | Touch 2    | SMS     | Reminder + mention risks of delay         |
      | 7   | Touch 3    | Email   | Detailed info + testimonial video         |
      | 10  | Touch 4    | Phone   | Care coordinator call (assigned)          |
      | 14  | Touch 5    | Letter  | Certified mail to home address            |
      | 17  | Touch 6    | Phone   | Provider outreach to member               |
      | 21  | Touch 7    | Home    | Home visit by community health worker     |
    And after each touchpoint, the system should:
      | Check                    | Action if Positive                        |
      | Member responded?        | End campaign, move to scheduling          |
      | Service completed?       | End campaign, close gap                   |
      | Barrier identified?      | Address barrier, adjust campaign          |
    And if member does not respond after all touchpoints:
      | Step | Action                                                    |
      | 1    | Tag member as "Non-Engaged - Critical Gap"               |
      | 2    | Escalate to medical director review                       |
      | 3    | Notify provider of patient non-engagement                 |
      | 4    | Document in medical record                                |

  Scenario: Medium gap - moderate outreach
    Given member M55556 has care gap "Blood Pressure Control Check"
    And gap urgency is "Medium"
    When the multi-touch campaign starts
    Then the system should execute lighter campaign:
      | Day | Touchpoint | Channel | Action                                    |
      | 0   | Touch 1    | SMS     | Initial reminder                          |
      | 7   | Touch 2    | Email   | Follow-up with blood pressure tips        |
      | 14  | Touch 3    | Phone   | Automated voice message                   |
      | 21  | Touch 4    | SMS     | Final reminder before manual escalation   |
    And if no response after 21 days:
      | Step | Action                                                    |
      | 1    | Assign to care coordinator for outreach                   |
      | 2    | Care coordinator makes personal call                      |

  Scenario: Member responds mid-campaign
    Given member M55557 is in multi-touch campaign (Day 5)
    And member has already received SMS (Day 0) and reminder SMS (Day 3)
    When member replies to Day 5 email: "Already scheduled for 11/25"
    Then the system should:
      | Step | Action                                                    |
      | 1    | Parse member response                                     |
      | 2    | Identify appointment date: 11/25                          |
      | 3    | Update gap status to "Intervention Scheduled"             |
      | 4    | Cancel all remaining touchpoints in campaign              |
      | 5    | Send confirmation SMS: "Great! We'll check back after your appt" |
      | 6    | Set reminder to verify completion after 11/25             |
      | 7    | Notify care coordinator of scheduled appointment          |
    And no further outreach should be sent
    And on 11/26, system should check for claim/EMR data
```

**Acceptance Criteria:**
- [ ] System executes multi-touch campaigns based on urgency
- [ ] Critical gaps get 7+ touchpoints over 21 days
- [ ] Medium/low gaps get 3-4 touchpoints
- [ ] System stops campaign when member responds
- [ ] System stops campaign when service completed
- [ ] System escalates to manual outreach after campaign ends
- [ ] Campaign effectiveness tracked (response rate by touchpoint)
- [ ] Gap closure rate increases by 50% with campaigns

---

### Story 9.3.3: Real-Time Response Handling
**As a** Member  
**I want** my responses to care reminders to be acknowledged immediately  
**So that** I don't have to wait days for follow-up

**Story Points:** 2  
**Priority:** Medium

```gherkin
Feature: Real-Time Response Handling
  Automatically parse and act on member responses in real-time

  Background:
    Given natural language processing (NLP) is configured
    And response handlers are registered for common replies
    And care coordinator escalation rules are defined

  Scenario: Member confirms service completed
    Given member M66666 received SMS: "Flu shot reminder - due by 12/31"
    When member replies: "DONE - got shot at CVS on 11/10"
    Then the system should:
      | Step | Action                                                    |
      | 1    | Parse response using NLP                                  |
      | 2    | Extract intent: "service_completed"                       |
      | 3    | Extract details: location=CVS, date=11/10                 |
      | 4    | Search claims for CPT 90658 (flu) at CVS on 11/10        |
      | 5    | Search pharmacy data for NDC flu vaccine codes            |
    And if claim/data found:
      | Step | Action                                                    |
      | 1    | Close care gap as "closed_compliant"                      |
      | 2    | Send SMS: "Thanks! We found your flu shot. You're all set!" |
      | 3    | Remove member from outreach list                          |
    And if no claim/data found yet:
      | Step | Action                                                    |
      | 1    | Send SMS: "Thanks! Can you upload a photo of your receipt?" |
      | 2    | Provide upload link                                       |
      | 3    | Update gap status to "pending_verification"               |
      | 4    | Set reminder to check again in 7 days (claim lag)         |

  Scenario: Member requests scheduling help
    Given member M66667 received email about mammogram
    When member replies: "Yes I need to schedule. Can you help?"
    Then the system should:
      | Step | Action                                                    |
      | 1    | Parse intent: "request_scheduling_assistance"             |
      | 2    | Look up member's preferred imaging centers                |
      | 3    | Check insurance network for mammography facilities        |
      | 4    | Send SMS with 3 nearest locations:                        |
      |      | "Happy to help! Here are nearby locations:"               |
      |      | "1. ABC Imaging (2 mi) - Call 555-0123"                   |
      |      | "2. XYZ Radiology (3 mi) - Call 555-0456"                 |
      |      | "3. CVS MinuteClinic (1 mi) - [Schedule Online]"          |
      | 5    | Assign to care coordinator for callback within 2 hours    |
      | 6    | Update gap status: "intervention_in_progress"             |

  Scenario: Member indicates barrier
    Given member M66668 received SMS about diabetic eye exam
    When member replies: "I don't have a way to get there"
    Then the system should:
      | Step | Action                                                    |
      | 1    | Parse intent: "barrier_transportation"                    |
      | 2    | Send immediate SMS:                                       |
      |      | "We can help with transportation! A coordinator will call you today." |
      | 3    | Create high-priority task for care coordinator           |
      | 4    | Tag gap with barrier: "transportation"                    |
      | 5    | Send coordinator details:                                 |
      |      | - Member needs transportation assistance                  |
      |      | - Check Lyft/Uber Health availability                     |
      |      | - Check paratransit eligibility                           |
      |      | - Consider telehealth alternative if applicable           |
      | 6    | Coordinator to call within 4 hours                        |

  Scenario: Member opts out
    Given member M66669 received care reminder
    When member replies: "STOP" or "Unsubscribe"
    Then the system should:
      | Step | Action                                                    |
      | 1    | Parse intent: "opt_out"                                   |
      | 2    | Update member preferences: SMS opt-out                    |
      | 3    | Send confirmation SMS: "You're unsubscribed from SMS reminders." |
      | 4    | Flag account for care coordinator review                  |
      | 5    | Attempt outreach via alternate channel (email/phone)      |
      | 6    | Do NOT remove from care gap tracking                      |
      | 7    | Document opt-out in compliance log                        |
```

**Acceptance Criteria:**
- [ ] System processes member responses within 60 seconds
- [ ] NLP accurately parses intent (>90% accuracy)
- [ ] System extracts key details (dates, locations, barriers)
- [ ] System automatically searches claims/EMR for verification
- [ ] System sends immediate acknowledgment
- [ ] System escalates to coordinator when needed
- [ ] System respects opt-out requests
- [ ] Member satisfaction with response handling >85%

---

## Feature 4: Care Coordinator Workflow

*Stories 9.4.1, 9.4.2, 9.4.3 - See EPIC document for full Gherkin scenarios*

**Summary:**
- 9.4.1: Morning Worklist (3 pts) - Prioritized dashboard
- 9.4.2: Member Outreach Call (3 pts) - Call script and documentation
- 9.4.3: Intervention Documentation (2 pts) - Action tracking

---

## Feature 5: Provider Care Alerts

*Stories 9.5.1, 9.5.2 - See EPIC document for full Gherkin scenarios*

**Summary:**
- 9.5.1: Pre-Visit Care Gap Summary (3 pts) - Provider alerts before appointments
- 9.5.2: Real-Time Gap Closure Confirmation (2 pts) - Immediate verification

---

## Story Summary Table

| Story ID  | Story Name                               | Points | Priority | Dependencies              |
|-----------|------------------------------------------|--------|----------|---------------------------|
| 9.1.1     | EMR Lab Result Gap Closure               | 3      | High     | Epic 6, Epic 8            |
| 9.1.2     | Duplicate Detection Across Data Sources  | 5      | Critical | Epic 8                    |
| 9.1.3     | New Gap Detection from Diagnosis         | 3      | High     | Epic 6                    |
| 9.2.1     | High-Risk Member Prioritization          | 3      | High     | Claims data               |
| 9.2.2     | Bundled Outreach Strategy                | 2      | Medium   | None                      |
| 9.3.1     | Preferred Channel Outreach               | 3      | High     | Member preferences        |
| 9.3.2     | Multi-Touch Campaign                     | 3      | High     | None                      |
| 9.3.3     | Real-Time Response Handling              | 2      | Medium   | NLP service               |
| 9.4.1     | Morning Worklist                         | 3      | High     | None                      |
| 9.4.2     | Member Outreach Call                     | 3      | High     | None                      |
| 9.4.3     | Intervention Documentation               | 2      | Medium   | None                      |
| 9.5.1     | Pre-Visit Care Gap Summary               | 3      | High     | Provider integration      |
| 9.5.2     | Real-Time Gap Closure Confirmation       | 2      | Medium   | EMR integration           |

**Total: 52 story points**

---

## Implementation Recommendations

### Sprint Planning (2-week sprints)

**Sprint 1 (13 pts):** Foundation
- 9.1.3: New Gap Detection from Diagnosis (3 pts)
- 9.2.1: High-Risk Member Prioritization (3 pts)
- 9.4.1: Morning Worklist (3 pts)
- 9.4.2: Member Outreach Call (3 pts)
- Setup: Data models, basic workflow

**Sprint 2 (11 pts):** Outreach Engine
- 9.3.1: Preferred Channel Outreach (3 pts)
- 9.3.2: Multi-Touch Campaign (3 pts)
- 9.3.3: Real-Time Response Handling (2 pts)
- 9.2.2: Bundled Outreach Strategy (2 pts)
- Setup: Message templates, NLP

**Sprint 3 (13 pts):** Integration & Deduplication
- 9.1.1: EMR Lab Result Gap Closure (3 pts)
- 9.1.2: Duplicate Detection Across Data Sources (5 pts)
- 9.5.2: Real-Time Gap Closure Confirmation (2 pts)
- 9.4.3: Intervention Documentation (2 pts)
- Setup: EMR connectors, equivalency mapping

**Sprint 4 (5 pts):** Provider Portal
- 9.5.1: Pre-Visit Care Gap Summary (3 pts)
- Testing, refinement, performance tuning

---

## Success Criteria

### Functional
- [ ] All 18 user stories pass acceptance tests
- [ ] Real-time gap detection (<1 second latency)
- [ ] Duplicate detection accuracy >95%
- [ ] Member response rate >60%
- [ ] Care coordinator productivity +30%

### Non-Functional
- [ ] System uptime >99.9%
- [ ] API response time <200ms (p95)
- [ ] Handle 100,000+ events per day
- [ ] HIPAA compliant
- [ ] Audit trail for all actions

### Business Outcomes
- [ ] Gap closure rate >80% within 6 months
- [ ] Preventable ER visits reduced by 30-50%
- [ ] HEDIS/STAR ratings improve by 1-2 stars
- [ ] ROI of 3:1 within 18 months

