# Code Management - User Stories (Gherkin Format)

## Epic: Medical Code Management System
**As a** Product Manager  
**I want** a comprehensive medical code management system  
**So that** I can configure products and benefits with accurate billing and coverage codes

---

## Feature 1: Browse and Search Standard Medical Codes

### Story 1.1: View Standard Medical Codes
**JIRA ID:** PBP-[TBD]  
**Priority:** P0 - Critical  
**Story Points:** 3

**As a** Product Manager  
**I want to** browse all standard medical codes in the system  
**So that** I can understand what codes are available for product configuration

```gherkin
Feature: Browse Standard Medical Codes
  As a Product Manager
  I want to browse standard medical codes
  So that I can see what codes are available

  Background:
    Given I am logged in as a Product Manager
    And I have permission to read codes
    And the system has loaded standard codes from CMS

  Scenario: View all medical codes with statistics
    Given I navigate to "Administration > Code Management"
    When the Code Library page loads
    Then I should see a dashboard with the following statistics:
      | Metric         | Value Type |
      | Total Codes    | Number     |
      | Active Codes   | Number     |
      | Inactive Codes | Number     |
      | Code Types     | Number     |
    And I should see a searchable table of codes
    And I should see pagination controls

  Scenario: Filter codes by type
    Given I am on the Code Library page
    When I select "CPT" from the "Code Type" dropdown
    Then I should only see codes where codeType is "CPT"
    And the statistics should update to reflect filtered results

  Scenario: Search codes by value or description
    Given I am on the Code Library page
    When I enter "99213" in the search box
    Then I should see all codes where:
      | Field       | Condition           |
      | codeValue   | contains "99213"    |
      | description | contains "99213"    |
    And results should be highlighted with matching text

  Scenario: Sort codes by different fields
    Given I am on the Code Library page
    When I click on the "Code Value" column header
    Then codes should be sorted by codeValue in ascending order
    When I click on the "Code Value" column header again
    Then codes should be sorted by codeValue in descending order

  Scenario: View code details
    Given I am on the Code Library page
    When I click the "View Details" icon for a code
    Then I should see a dialog with the following information:
      | Field        | Description                    |
      | Code Value   | The unique code identifier     |
      | Code Type    | CPT, ICD-10, HCPCS, etc.      |
      | Description  | What the code represents       |
      | Status       | Active or Inactive             |
      | Created Date | When code was added            |
      | Updated Date | Last modification date         |
      | Mappings     | Products/Plans using this code |
```

---

## Feature 2: Import Medical Codes from External Sources

### Story 2.1: Bulk Import Codes via CSV/Excel
**JIRA ID:** PBP-[TBD]  
**Priority:** P0 - Critical  
**Story Points:** 8

**As a** Product Manager  
**I want to** import medical codes from CSV or Excel files  
**So that** I can quickly populate the system with codes from CMS or other sources

```gherkin
Feature: Import Medical Codes via CSV/Excel
  As a Product Manager
  I want to import codes from files
  So that I can bulk-load standard codes efficiently

  Background:
    Given I am logged in as a Product Manager
    And I have permission to write codes
    And I am on the "Import Codes" page

  Scenario: Upload valid CSV file with codes
    Given I have a CSV file "cms_cpt_codes.csv" with columns:
      | codeValue | codeType | description    | isActive |
      | 99213     | CPT      | Office visit   | true     |
      | 99214     | CPT      | Office visit   | true     |
    When I click "Upload File"
    And I select the CSV file
    Then I should see a preview of 2 codes
    And I should proceed to the mapping step

  Scenario: Map CSV columns to code fields
    Given I have uploaded a CSV file
    And I am on the "Column Mapping" step
    When I see the detected columns:
      | CSV Column  | Detected Field |
      | Code        | codeValue      |
      | Type        | codeType       |
      | Description | description    |
    Then I can manually adjust mappings if needed
    When I click "Next"
    Then I should proceed to validation

  Scenario: Validate codes before import
    Given I have mapped CSV columns
    And I am on the "Validation" step
    When the system validates the data
    Then I should see a summary:
      | Status       | Count |
      | Valid        | 150   |
      | Errors       | 5     |
      | Duplicates   | 3     |
    And I should see error details for failed records
    And I can download an error report

  Scenario: Import validated codes
    Given I have 150 valid codes in the validation step
    When I click "Import Codes"
    Then the system should import all valid codes
    And I should see a success message: "150 codes imported successfully"
    And duplicate codes should be skipped
    And I should see a summary of the import results

  Scenario: Handle validation errors
    Given I have uploaded codes with errors:
      | Row | Error                            |
      | 15  | Invalid code format for CPT      |
      | 23  | Missing required field: codeType |
      | 47  | Code value exceeds max length    |
    When I am on the validation step
    Then I should see all error details
    And I can download an error report as CSV
    And I can choose to:
      | Option                    | Outcome                      |
      | Fix errors and re-upload  | Go back to upload step       |
      | Import valid codes only   | Skip errors, import valid    |
      | Cancel import             | Return to Code Library       |
```

---

## Feature 3: Create Custom Internal Codes

### Story 3.1: Create Custom Code Referencing Standard Code
**JIRA ID:** PBP-[TBD]  
**Priority:** P1 - High  
**Story Points:** 5

**As a** Product Manager  
**I want to** create custom internal codes that reference standard medical codes  
**So that** I can use business-friendly names in my product configurations

```gherkin
Feature: Create Custom Internal Codes
  As a Product Manager
  I want to create custom codes
  So that I can use internal terminology for standard medical codes

  Background:
    Given I am logged in as a Product Manager
    And I have permission to write codes
    And the system has standard CPT code "99213" with description "Office visit"

  Scenario: Create custom code linked to standard code
    Given I navigate to "Administration > Code Management > Create Code"
    When I fill in the form:
      | Field            | Value                           |
      | Code Source      | Custom (references standard)    |
      | Code Category    | CPT                             |
      | Code Value       | WELLNESS-VISIT-BASIC            |
      | Description      | Basic wellness office visit     |
      | Reference Code   | 99213                           |
      | Status           | Active                          |
    And I click "Create Code"
    Then the code should be created successfully
    And I should see the new code in the Code Library
    And the code should show:
      | Field          | Value                         |
      | Type           | CPT                           |
      | Source         | Custom                        |
      | Referenced     | 99213 (Office visit)          |

  Scenario: Create product code without reference
    Given I navigate to "Create Code"
    When I fill in the form:
      | Field            | Value                           |
      | Code Source      | Internal                        |
      | Code Type        | PRODUCT_CODE                    |
      | Code Value       | HMO-GOLD-2024                   |
      | Description      | HMO Gold Plan 2024              |
      | Reference Code   | (none)                          |
      | Status           | Active                          |
    And I click "Create Code"
    Then the product code should be created
    And it should have no referenced code

  Scenario: Validate custom code format
    Given I am creating a custom CPT code
    When I enter an invalid code value:
      | Invalid Value      | Error Message                    |
      | 99                 | CPT codes must be 5 digits       |
      | ABCDE              | CPT codes must be numeric        |
      | 99213 (duplicate)  | Code value already exists        |
    Then I should see the appropriate error message
    And I should not be able to submit the form

  Scenario: Search for reference code during creation
    Given I am creating a custom code
    And I select "CPT" as the category
    When I click "Select Reference Code"
    Then I should see a searchable modal with all standard CPT codes
    When I search for "office visit"
    Then I should see matching CPT codes:
      | Code  | Description                    |
      | 99213 | Office visit, established...   |
      | 99214 | Office visit, established...   |
    When I select "99213"
    Then the reference code field should be populated
    And the description should auto-fill with reference details
```

### Story 3.2: Create Product and Plan Codes
**JIRA ID:** PBP-[TBD]  
**Priority:** P1 - High  
**Story Points:** 3

**As a** Product Manager  
**I want to** create product and plan codes  
**So that** I can uniquely identify my insurance offerings

```gherkin
Feature: Create Product and Plan Codes
  As a Product Manager
  I want to create product and plan codes
  So that I can track my insurance products and plans

  Background:
    Given I am logged in as a Product Manager
    And I have permission to write codes

  Scenario: Create product code
    Given I navigate to "Create Code"
    When I fill in the form:
      | Field            | Value                              |
      | Code Source      | Internal                           |
      | Code Type        | PRODUCT_CODE                       |
      | Code Value       | HMO-GOLD-2024-FL                   |
      | Description      | HMO Gold Plan 2024 - Florida       |
      | Status           | Active                             |
    And I click "Create Code"
    Then the product code should be created
    And it should be available for product configuration

  Scenario: Create plan code
    Given I navigate to "Create Code"
    When I fill in the form:
      | Field            | Value                              |
      | Code Source      | Internal                           |
      | Code Type        | PLAN_CODE                          |
      | Code Value       | HMO-GOLD-2024-FL-SINGLE            |
      | Description      | HMO Gold 2024 FL - Single Coverage |
      | Status           | Active                             |
    And I click "Create Code"
    Then the plan code should be created
    And it should be available for plan configuration

  Scenario: Validate product code naming conventions
    Given I am creating a product code
    When I enter code values:
      | Code Value           | Validation Result | Reason                        |
      | HMO-GOLD-2024        | Valid             | Follows naming convention     |
      | HMO GOLD 2024        | Warning           | Spaces not recommended        |
      | hmo-gold-2024        | Valid             | Lowercase is acceptable       |
      | HMO-GOLD-2024!       | Error             | Special chars not allowed     |
    Then I should see appropriate validation feedback
```

---

## Feature 4: Map Codes to Products and Benefits

### Story 4.1: Map Medical Codes to Products
**JIRA ID:** PBP-[TBD]  
**Priority:** P0 - Critical  
**Story Points:** 8

**As a** Product Manager  
**I want to** map medical codes to specific products and plans  
**So that** I can define which services are covered under each offering

```gherkin
Feature: Map Medical Codes to Products and Plans
  As a Product Manager
  I want to map codes to products
  So that I can define coverage rules

  Background:
    Given I am logged in as a Product Manager
    And I have permission to write codes
    And the system has:
      | Entity   | Name                | ID   |
      | Product  | HMO Gold 2024       | P001 |
      | Product  | PPO Silver 2024     | P002 |
      | Plan     | HMO Gold - Single   | PL01 |
      | Code     | CPT 99213           | C001 |
      | Code     | CPT 99214           | C002 |

  Scenario: Map single code to product
    Given I am viewing code "CPT 99213" in the Code Library
    When I click "Manage Mappings"
    Then I should see the Code Mapping dialog
    When I select "Map to Product"
    And I search for "HMO Gold"
    And I select product "HMO Gold 2024"
    And I click "Add Mapping"
    Then the code should be mapped to the product
    And I should see "HMO Gold 2024" in the mappings list

  Scenario: Map code to multiple products
    Given I am managing mappings for code "CPT 99213"
    When I add mappings to:
      | Product         |
      | HMO Gold 2024   |
      | PPO Silver 2024 |
    Then the code should be mapped to both products
    And I should see 2 product mappings in the table

  Scenario: Map code to plan
    Given I am managing mappings for code "CPT 99213"
    When I select "Map to Plan"
    And I search for "HMO Gold - Single"
    And I select plan "HMO Gold - Single"
    And I click "Add Mapping"
    Then the code should be mapped to the plan
    And I should see the plan mapping details

  Scenario: View mapping guidance
    Given I am managing mappings for a code
    When I select code type "REVENUE"
    Then I should see guidance:
      | Field            | Content                               |
      | Title            | Revenue Code Mapping                  |
      | Description      | Revenue codes identify departments... |
      | Best Practice    | Use for billing system integration... |
      | Mapping Guidance | Map to products for billing...        |

  Scenario: Remove code mapping
    Given code "CPT 99213" is mapped to "HMO Gold 2024"
    When I click "Manage Mappings" for the code
    And I see the mapping to "HMO Gold 2024"
    And I click "Remove" next to the mapping
    And I confirm the removal
    Then the mapping should be removed
    And the code should show as "Unmapped"

  Scenario: Bulk map codes to product
    Given I have selected 10 CPT codes in the Code Library
    When I click "Bulk Actions" > "Map to Product"
    And I select product "HMO Gold 2024"
    And I click "Apply Mapping"
    Then all 10 codes should be mapped to the product
    And I should see a success message
```

---

## Feature 5: Code Analytics and Reporting

### Story 5.1: View Code Usage Analytics
**JIRA ID:** PBP-[TBD]  
**Priority:** P2 - Medium  
**Story Points:** 5

**As a** Product Manager  
**I want to** see analytics on code usage  
**So that** I can understand which codes are most frequently mapped

```gherkin
Feature: Code Usage Analytics
  As a Product Manager
  I want to view code analytics
  So that I can make data-driven decisions

  Background:
    Given I am logged in as a Product Manager
    And the system has tracked code usage data

  Scenario: View code distribution by type
    Given I navigate to "Code Management > Analytics"
    Then I should see a pie chart showing:
      | Code Type | Count | Percentage |
      | CPT       | 59    | 21%        |
      | HCPCS     | 22    | 8%         |
      | ICD-10    | 37    | 13%        |
      | NDC       | 16    | 6%         |
      | REVENUE   | 149   | 52%        |

  Scenario: View most mapped codes
    Given I am on the Analytics page
    Then I should see a table of "Top 10 Most Mapped Codes":
      | Code  | Type   | Mappings | Products |
      | 99213 | CPT    | 15       | 5        |
      | 99214 | CPT    | 12       | 5        |
    And I can click on a code to view details

  Scenario: View unmapped codes report
    Given I am on the Analytics page
    When I click "View Unmapped Codes"
    Then I should see all codes where:
      | Condition     | Value |
      | productId     | null  |
      | planId        | null  |
    And I can export the list as CSV

  Scenario: Export code usage report
    Given I am on the Analytics page
    When I click "Export Report"
    And I select date range "Last 90 days"
    And I select format "CSV"
    Then I should download a CSV file with:
      | Column       | Description                 |
      | Code Value   | The code identifier         |
      | Code Type    | CPT, ICD-10, etc.          |
      | Times Mapped | Number of product mappings  |
      | Last Used    | Most recent mapping date    |
```

---

## Feature 6: Data Model Enhancement - Code Categories

### Story 6.1: Implement Code Source Classification
**JIRA ID:** PBP-[TBD]  
**Priority:** P0 - Critical (Architecture)  
**Story Points:** 13

**As a** System Architect  
**I want to** add a codeSource field to distinguish between standard, custom, and internal codes  
**So that** users can create custom codes that reference standard codes

```gherkin
Feature: Code Source Classification
  As a Product Manager
  I want codes to have a source classification
  So that I can distinguish between standard and custom codes

  Background:
    Given the system has been updated with the new schema:
      """
      model Code {
        codeType          CodeType       // CPT, ICD-10, etc.
        codeSource        CodeSource     // STANDARD, CUSTOM, INTERNAL
        codeValue         String
        description       String
        referencedCodeId  String?        // Links to standard code
        referencedCode    Code?
      }
      
      enum CodeSource {
        STANDARD   // Official codes from CMS/AMA
        CUSTOM     // User-created, references standard
        INTERNAL   // Product/Plan codes
      }
      """

  Scenario: View code with source indicator
    Given I am viewing the Code Library
    Then each code should display:
      | Field       | Example               | Badge/Icon         |
      | Code Value  | 99213                 | -                  |
      | Code Type   | CPT                   | -                  |
      | Code Source | STANDARD              | "Official" badge   |
    When I view a custom code
    Then I should see:
      | Field           | Example               | Additional Info    |
      | Code Value      | WELLNESS-VISIT        | -                  |
      | Code Type       | CPT                   | -                  |
      | Code Source     | CUSTOM                | "Custom" badge     |
      | Referenced Code | 99213 (Office visit)  | Link to standard   |

  Scenario: Filter by code source
    Given I am on the Code Library page
    When I select filter "Code Source"
    Then I should see options:
      | Option   | Description                      |
      | All      | Show all codes                   |
      | Standard | Official codes only              |
      | Custom   | User-created codes only          |
      | Internal | Product/Plan codes only          |
    When I select "Custom"
    Then I should only see codes where codeSource = "CUSTOM"

  Scenario: Create custom code with standard reference
    Given I navigate to "Create Code"
    When I select:
      | Field        | Value                    |
      | Code Source  | Custom                   |
      | Code Type    | CPT                      |
    Then I should see a "Reference Code" field appear
    And I can search for and select a standard CPT code
    When I select standard code "99213"
    Then the system should:
      | Action                              | Result                        |
      | Set referencedCodeId                | ID of code 99213              |
      | Pre-fill description with reference | "Based on CPT 99213..."       |
      | Allow custom description override   | User can edit description     |
```

---

## Cross-Cutting Concerns

### Security: Role-Based Access Control
```gherkin
Feature: Code Management Permissions
  
  Scenario Outline: Role-based code access
    Given I am logged in as a <Role>
    Then I should have the following permissions:
      | Action        | Allowed |
      | Read codes    | <Read>  |
      | Create codes  | <Write> |
      | Edit codes    | <Write> |
      | Delete codes  | <Delete>|
      | Import codes  | <Write> |
    
    Examples:
      | Role            | Read | Write | Delete |
      | ADMINISTRATOR   | Yes  | Yes   | Yes    |
      | PRODUCT_MANAGER | Yes  | Yes   | Yes    |
      | MEMBER_SUPPORT  | Yes  | No    | No     |
      | VIEWER          | Yes  | No    | No     |
```

### Audit Trail
```gherkin
Feature: Code Audit Trail
  
  Scenario: Track code changes
    Given code "CPT 99213" exists
    When a user with email "user@example.com" updates the description
    Then the system should record:
      | Field      | Value                |
      | updatedBy  | user@example.com     |
      | updatedAt  | Current timestamp    |
    And the change should be logged in the audit trail
```

---

## Non-Functional Requirements

### Performance
```gherkin
Feature: Code Library Performance

  Scenario: Fast code search
    Given the system has 10,000+ codes
    When I search for a code
    Then results should return in less than 500ms
    And pagination should load instantly

  Scenario: Bulk import performance
    Given I am importing 5,000 codes
    Then the import should complete in less than 30 seconds
    And I should see progress updates every 500 records
```

### Data Validation
```gherkin
Feature: Code Format Validation

  Scenario Outline: Validate code formats
    Given I am creating a code of type <Type>
    When I enter code value <Value>
    Then the validation should be <Result>
    And I should see message <Message>

    Examples:
      | Type    | Value      | Result | Message                              |
      | CPT     | 99213      | Valid  | -                                    |
      | CPT     | 9921       | Error  | "CPT codes must be exactly 5 digits" |
      | ICD10   | E11.9      | Valid  | -                                    |
      | ICD10   | E11        | Error  | "ICD-10 codes must include period"   |
      | HCPCS   | A0426      | Valid  | -                                    |
      | REVENUE | 0100       | Valid  | -                                    |
      | REVENUE | 100        | Error  | "Revenue codes must be 4 digits"     |
```

---

## Summary: User Stories by Feature

| Feature | Story Count | Total Story Points | Priority |
|---------|-------------|-------------------|----------|
| Browse & Search Codes | 1 | 3 | P0 |
| Import Codes | 1 | 8 | P0 |
| Create Custom Codes | 2 | 8 | P1 |
| Map Codes to Products | 1 | 8 | P0 |
| Code Analytics | 1 | 5 | P2 |
| Code Source Classification | 1 | 13 | P0 |
| **TOTAL** | **7** | **45** | - |

---

## JIRA Integration Checklist

- [ ] Create Epic: "Code Management System" (PBP-XXX)
- [ ] Create Stories with Gherkin scenarios
- [ ] Link Stories to Epic
- [ ] Add acceptance criteria from scenarios
- [ ] Tag stories with component: "code-management"
- [ ] Set sprint assignments based on priority
- [ ] Link related technical tasks (schema updates, API changes)
- [ ] Add test cases based on Gherkin scenarios






