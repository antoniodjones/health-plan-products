# PRODUCTS & BENEFITS PLATFORM
## UI/UX Architecture & Navigation Structure

**Date:** November 3, 2025  
**Mode:** Planning & Analysis  
**Purpose:** Define all UI screens, navigation structure, and user workflows  
**Separation:** UI Layer (what users see) vs. API Layer (backend services)

---

## OVERVIEW

### Platform Philosophy

**PHASE 1-2: Manual Configuration (Current Focus)**
- Users manually configure everything
- UI-heavy, forms-based workflows
- Drag-and-drop builders
- Step-by-step wizards

**PHASE 3+: Agent-Driven Automation (Future)**
- AI Agents do most of the work
- Users only intervene for exceptions or approvals
- UI becomes monitoring & approval-focused
- Less data entry, more decision-making

**This Document:** Focuses on Phase 1-2 (manual configuration)

---

## USER ROLES & APPLICATIONS

### User Roles

| Role | Persona | Primary Tasks |
|------|---------|---------------|
| **Platform Admin** | IT Administrator | System config, user management, integrations |
| **Code Manager** | Data Analyst | Manage billing codes, imports, updates |
| **Product Manager** | Product Designer | Create products, design benefits, configure plans |
| **Actuarial Analyst** | Actuary | Configure rates, run scenarios, financial modeling |
| **Compliance Officer** | Regulatory Specialist | Validate compliance, manage rules, audit trail |
| **Publishing Manager** | Operations Manager | Publish products, manage channels, track status |
| **Analytics User** | Executive/Analyst | View dashboards, run reports, monitor performance |

### Applications (Main UI Modules)

We'll have **5 Main Applications**, each with its own navigation:

1. **Platform Admin Console** (System-wide settings)
2. **Code Management Studio** (Epics 1, 4, 5)
3. **Product Design Studio** (Epics 6, 7, 8)
4. **Rating & Compliance Workbench** (Epics 9, 10)
5. **Publishing & Analytics Dashboard** (Epics 11, 12)

---

## APPLICATION 1: PLATFORM ADMIN CONSOLE

**User Role:** Platform Admin  
**Purpose:** System-wide configuration and administration  
**Epic Alignment:** Foundation (supports all epics)

### Navigation Structure

```
PLATFORM ADMIN CONSOLE
│
├── 🏠 Dashboard
│   └── System health, recent activity, alerts
│
├── 👥 User Management
│   ├── Users List
│   ├── Add/Edit User
│   ├── Roles & Permissions
│   └── Audit Log (user actions)
│
├── 🏢 Organization Settings
│   ├── Company Profile
│   ├── Lines of Business (LOB)
│   ├── Service Areas (states, counties)
│   └── Plan Years (2024, 2025, etc.)
│
├── 🔌 Integrations
│   ├── Data Sources
│   │   ├── CMS Code Sets (CPT, ICD-10, etc.)
│   │   ├── Claims System
│   │   └── Enrollment System
│   ├── API Connections
│   │   ├── Healthcare.gov API
│   │   ├── SERFF API
│   │   └── Third-Party APIs
│   └── Webhooks & Events
│
├── ⚙️ System Configuration
│   ├── Feature Flags
│   ├── Environment Settings (Dev, Staging, Prod)
│   └── Security Settings (SSO, MFA)
│
└── 📊 System Monitoring
    ├── Performance Metrics
    ├── Error Logs
    └── API Usage Stats
```

### Key Screens

#### 1.1 Dashboard (Home)
- System health indicators
- Recent activity feed
- Quick actions (shortcuts)
- Alerts & notifications

#### 1.2 Users List
- Table: Name, Email, Role, Status, Last Login
- Actions: Add User, Edit, Deactivate, Reset Password
- Filters: Role, Status, Date Range
- Search: By name or email

#### 1.3 Add/Edit User
- Form fields:
  - First Name, Last Name
  - Email
  - Role (dropdown)
  - Permissions (checkboxes)
  - Status (Active/Inactive)
- Save/Cancel buttons

#### 1.4 Organization Settings
- Company Profile (name, logo, address)
- Lines of Business (Commercial, MA, Medicaid)
- Service Areas (multi-select states/counties)
- Plan Years (add/edit effective dates)

#### 1.5 Data Source Configuration
- Connect to CMS for code updates
- Configure claims data integration
- Set up enrollment data feed
- Test connection, sync frequency

---

## APPLICATION 2: CODE MANAGEMENT STUDIO

**User Role:** Code Manager  
**Purpose:** Manage billing codes and code-to-benefit mappings  
**Epic Alignment:** Epics 1, 2, 3, 4, 5

### Navigation Structure

```
CODE MANAGEMENT STUDIO
│
├── 🏠 Dashboard
│   └── Code set summary, recent updates, import status
│
├── 📚 Code Libraries (Epic 1, 4)
│   ├── CPT Codes
│   │   ├── Browse/Search
│   │   ├── Code Detail
│   │   └── Version History
│   ├── HCPCS Codes
│   ├── ICD-10 Diagnosis
│   ├── NDC Drugs
│   ├── CDT Dental
│   ├── DRG Codes
│   ├── Revenue Codes
│   ├── Place of Service (POS)
│   ├── Modifiers
│   ├── Type of Bill (TOB)
│   └── Provider Taxonomy
│
├── 🗂️ Code Set Management (Epic 1, 4)
│   ├── Import Codes
│   │   ├── Upload File (CSV, Excel)
│   │   ├── Connect to CMS
│   │   └── Import History
│   ├── Code Updates
│   │   ├── Pending Updates
│   │   ├── Schedule Updates
│   │   └── Update History
│   └── Code Analytics
│       ├── Usage Reports
│       ├── Most Used Codes
│       └── Unmapped Codes
│
├── 🔗 Code Mappings (Epic 2)
│   ├── Mapping Dashboard
│   ├── Create Mapping
│   │   ├── Select Code Type
│   │   ├── Map to Benefit Segment
│   │   ├── Configure Cost-Sharing
│   │   └── Set Requirements (auth, referral)
│   ├── Mapping Library
│   │   ├── Browse Mappings
│   │   ├── Edit Mapping
│   │   └── Duplicate Mapping
│   ├── Bulk Operations
│   │   ├── Import Mappings (CSV)
│   │   ├── Export Mappings
│   │   └── Bulk Edit
│   └── Mapping Hierarchies
│       └── Configure code precedence
│
├── ✅ Validation & Testing (Epic 3)
│   ├── Validation Dashboard
│   ├── Run Validation
│   │   ├── Select Product
│   │   ├── Run Test Scenarios
│   │   └── View Results
│   ├── Test Scenarios Library
│   │   ├── Pre-built Scenarios
│   │   ├── Create Custom Scenario
│   │   └── Edit Scenario
│   └── Validation History
│       └── Past validation results
│
└── 🎨 Custom Codes (Epic 5)
    ├── Custom Code Library
    ├── Create Custom Code
    │   ├── Code Details (ID, description)
    │   ├── Category
    │   └── Map to Standard Code
    ├── Custom Code Templates
    │   ├── Telehealth Services
    │   ├── Wellness Programs
    │   └── Care Coordination
    └── Code Marketplace (Future)
        ├── Browse Shared Codes
        ├── Download Code
        └── Share My Codes
```

### Key Screens

#### 2.1 Code Library - Browse/Search
- **Layout:** Table view with filters
- **Columns:** Code, Description, Type, Status, Last Updated
- **Filters:**
  - Code Type (CPT, ICD-10, etc.)
  - Category (Office Visits, Hospital, etc.)
  - Status (Active, Inactive)
  - Date Range
- **Search:** By code or description
- **Actions:** View Details, Map to Benefit, Export

#### 2.2 Code Detail View
- **Code Information:**
  - Code ID
  - Description (short & long)
  - Effective dates
  - Status
  - Version history
- **Related Mappings:** List of benefit segments this code is mapped to
- **Usage Statistics:** How often this code appears in claims (future)
- **Actions:** Edit, Map to Benefit, View History

#### 2.3 Import Codes Wizard
**Step 1: Select Source**
- Upload file (CSV, Excel)
- Connect to CMS API
- Manual entry

**Step 2: Map Columns**
- Map CSV columns to system fields
- Preview data
- Validate format

**Step 3: Review & Confirm**
- Show import summary
- Preview records (first 10)
- Confirm import

**Step 4: Import Status**
- Progress bar
- Success/Error counts
- Error log (downloadable)

#### 2.4 Create Code Mapping
**Screen Layout:** Split view (left: code selection, right: mapping config)

**Left Panel: Select Code**
- Code type dropdown (CPT, NDC, etc.)
- Search/browse codes
- Selected code display

**Right Panel: Configure Mapping**
- **Benefit Segment:** Dropdown (Office Visits, Hospital, Rx, etc.)
- **Cost-Sharing:**
  - Deductible applies? (Yes/No)
  - Copay amount ($)
  - Coinsurance (%)
  - Out-of-pocket applies? (Yes/No)
- **Requirements:**
  - Prior authorization? (Yes/No)
  - Referral required? (Yes/No)
  - Step therapy? (Yes/No)
- **Effective Dates:** Start/End
- **Save/Cancel buttons**

#### 2.5 Mapping Library - Browse View
- **Table View:**
  - Code, Code Type, Benefit Segment, Cost-Sharing, Status, Actions
- **Filters:**
  - Code Type
  - Benefit Segment
  - Has Prior Auth
  - Status (Active/Draft)
- **Bulk Actions:**
  - Select multiple → Edit, Delete, Export

#### 2.6 Validation Dashboard
- **Summary Cards:**
  - Total Validations Run
  - Pass Rate (%)
  - Pending Validations
  - Failed Validations
- **Recent Validations:** Table with status, date, product
- **Quick Actions:** Run New Validation

#### 2.7 Run Validation Wizard
**Step 1: Select Product**
- Dropdown: Select product to validate

**Step 2: Select Test Scenarios**
- Checkboxes: Pre-built scenarios
  - ☑️ Office Visit ($25 copay)
  - ☑️ Emergency Room ($250 copay)
  - ☑️ Hospital Inpatient (deductible applies)
  - ☑️ Preventive Care (100% covered)
  - ☑️ Prescription Drug (tier-based)
  - ☑️ Specialist Visit (referral required)
- Button: Add Custom Scenario

**Step 3: Run Tests**
- Progress indicator
- Real-time results

**Step 4: View Results**
- Pass/Fail summary
- Detailed results table
- Error messages
- Export report (PDF)

#### 2.8 Create Custom Code
- **Form Fields:**
  - Custom Code ID (auto-generated or manual)
  - Description (short & long)
  - Category (dropdown)
  - Map to Standard Code (optional)
  - Effective dates
  - Status (Active/Draft)
- **Save/Cancel**

---

## APPLICATION 3: PRODUCT DESIGN STUDIO

**User Role:** Product Manager  
**Purpose:** Create and design products, benefits, and plans  
**Epic Alignment:** Epics 6, 7, 8

### Navigation Structure

```
PRODUCT DESIGN STUDIO
│
├── 🏠 Dashboard
│   └── Product summary, drafts, recent activity
│
├── 📦 Product Catalog (Epic 6)
│   ├── Products List
│   │   ├── All Products (table view)
│   │   ├── Filters (LOB, market, status, year)
│   │   └── Search
│   ├── Create Product
│   │   ├── Product Setup Wizard
│   │   └── Quick Create
│   ├── Product Detail
│   │   ├── Overview Tab
│   │   ├── Plans Tab
│   │   ├── Benefits Tab
│   │   ├── Documents Tab
│   │   └── History Tab
│   ├── Product Versions
│   │   ├── View Versions
│   │   ├── Create New Version
│   │   └── Compare Versions
│   └── Product Search
│       └── Advanced search & filters
│
├── 🎨 Benefit Design Studio (Epic 7)
│   ├── Design Canvas
│   │   ├── Visual Designer (drag-and-drop)
│   │   ├── Component Library (sidebar)
│   │   └── Cost Preview (right panel)
│   ├── Benefit Components
│   │   ├── Medical Benefits
│   │   │   ├── Office Visits
│   │   │   ├── Preventive Care
│   │   │   ├── Emergency Services
│   │   │   ├── Hospital Inpatient
│   │   │   ├── Hospital Outpatient
│   │   │   ├── Specialist Visits
│   │   │   ├── Urgent Care
│   │   │   ├── Mental Health
│   │   │   └── Lab & Imaging
│   │   ├── Prescription Drugs
│   │   │   ├── Formulary Tiers
│   │   │   ├── Tier Cost-Sharing
│   │   │   └── Specialty Drugs
│   │   ├── Dental Benefits
│   │   ├── Vision Benefits
│   │   └── Supplemental Benefits
│   │       ├── Wellness Programs
│   │       ├── Telemedicine
│   │       ├── Fitness Membership
│   │       └── Care Coordination
│   ├── Cost Modeling
│   │   ├── Real-Time Cost Preview
│   │   ├── What-If Analysis
│   │   └── Cost Impact Calculator
│   └── Benefit Comparison
│       ├── Side-by-Side View (up to 4)
│       ├── Difference Highlighting
│       └── Export Comparison
│
├── 📋 Templates & Accelerators (Epic 8)
│   ├── Template Library
│   │   ├── Browse Templates
│   │   │   ├── By Metal Tier (Bronze, Silver, Gold, Platinum)
│   │   │   ├── By LOB (Commercial, MA, Medicaid)
│   │   │   ├── By Market (Individual, Small Group, Large Group)
│   │   │   └── By State
│   │   ├── Template Preview
│   │   └── Use Template
│   ├── Create from Template
│   │   ├── Select Template
│   │   ├── Customize
│   │   └── Save as Product
│   ├── Save as Template
│   │   └── Save current product as reusable template
│   ├── Import/Export
│   │   ├── Import Product (Excel, CSV)
│   │   ├── Export Product (Excel, PDF)
│   │   └── Import from Legacy System
│   └── Configuration Wizards
│       ├── ACA Marketplace Wizard
│       ├── Medicare Advantage Wizard
│       └── Medicaid Wizard
│
└── 📊 Product Management
    ├── Product Lifecycle
    │   ├── Draft Products
    │   ├── In Review
    │   ├── Active Products
    │   └── Retired Products
    ├── Approval Workflows
    │   ├── Submit for Review
    │   ├── Approval Queue
    │   └── Approval History
    └── Product Analytics
        ├── Product Performance Summary
        ├── Enrollment by Product
        └── Cost Analysis
```

### Key Screens

#### 3.1 Products List (Catalog View)
- **Layout:** Table with cards option
- **Table Columns:**
  - Product Name
  - Product ID
  - LOB (Commercial, MA, Medicaid)
  - Market (Individual, Small Group, Large Group)
  - Status (Draft, Active, Retired)
  - Effective Date
  - Plans (count)
  - Actions (View, Edit, Duplicate, Archive)
- **Filters (Left Sidebar):**
  - Line of Business (checkboxes)
  - Market Type (checkboxes)
  - Status (checkboxes)
  - Plan Year (dropdown)
  - State (multi-select)
- **Top Actions:**
  - Create Product (primary button)
  - Import Products
  - Export List
- **Search:** Product name or ID

#### 3.2 Create Product Wizard
**Step 1: Product Information**
- Product Name (text)
- Product ID (auto-generated, editable)
- Line of Business (dropdown: Commercial, MA, Medicaid)
- Market Type (dropdown: Individual, Small Group, Large Group)
- Description (textarea)

**Step 2: Market & Geography**
- Plan Year (dropdown: 2025, 2026)
- Effective Date (date picker)
- End Date (date picker, optional)
- States (multi-select)
- Counties/Service Areas (multi-select, based on states)

**Step 3: Product Structure**
- Number of Plans (1-10)
- Metal Tier (for ACA: Bronze, Silver, Gold, Platinum)
- Plan Names (auto-generated, editable)

**Step 4: Template Selection (Optional)**
- Use Template? (Yes/No)
- If Yes: Browse templates → Select

**Step 5: Review & Create**
- Summary of selections
- Create Product (button)

**Result:** Product created, redirect to Product Detail page

#### 3.3 Product Detail Page
**Tab Structure:** Overview | Plans | Benefits | Documents | History

**Overview Tab:**
- **Product Summary Card:**
  - Product Name, ID
  - LOB, Market Type
  - Status badge
  - Effective dates
  - Edit Product Info (button)
- **Quick Stats:**
  - Number of Plans
  - Enrollment (future)
  - MLR (future)
- **Quick Actions:**
  - Add Plan
  - Design Benefits
  - Run Rating
  - Validate Compliance
  - Duplicate Product
  - Archive Product

**Plans Tab:**
- Table of plans under this product
- Columns: Plan Name, Plan ID, Status, Benefits Configured?, Rated?, Compliant?
- Actions: View, Edit, Duplicate, Delete

**Benefits Tab:**
- List of configured benefit packages
- For each benefit package:
  - Benefit Package Name
  - Summary (deductible, OOP max, key copays)
  - Edit Benefits (opens Design Studio)
  - View Benefit Summary (PDF)

**Documents Tab:**
- Generated documents:
  - Summary of Benefits & Coverage (SBC)
  - Evidence of Coverage (EOC)
  - Rate Filing
  - Compliance Report
- Upload additional documents (button)

**History Tab:**
- Audit trail
- Table: Date, User, Action, Details
- Example: "2025-01-15 | John Smith | Created Product | Initial setup"

#### 3.4 Benefit Design Studio (Canvas View)
**Layout:** Three panels

**Left Panel: Component Library**
- Accordion sections:
  - 📄 Deductibles & OOP Max
  - 🏥 Medical Benefits
  - 💊 Prescription Drugs
  - 🦷 Dental
  - 👁️ Vision
  - ➕ Supplemental
- Each component is draggable
- Hover shows preview

**Center Panel: Design Canvas**
- Visual representation of benefit package
- Dropped components appear here
- Click component to configure
- Drag to reorder
- Delete button on each component

**Right Panel: Configuration & Preview**
- **When component selected:**
  - Configuration form (copay, coinsurance, etc.)
  - Save/Cancel
- **When no component selected:**
  - Real-time cost preview
    - Projected PMPM
    - Estimated Premium
    - MLR projection
    - Actuarial Value
  - Cost Impact: "Increase copay $5 → saves $X/year"

**Top Bar:**
- Product Name (breadcrumb)
- Save Draft
- Save & Validate
- Preview Benefit Summary
- Close (back to product)

#### 3.5 Component Configuration (Example: Office Visits)
**Popup/Modal when component is clicked:**

**Title:** Configure Office Visits

**Form Fields:**
- **Deductible Applies?** (Yes/No toggle)
- **Cost-Sharing Type:**
  - ○ Copay (radio)
  - ○ Coinsurance (radio)
  - ○ No Cost-Sharing (radio)
- **If Copay:**
  - Copay Amount: $____ (number input)
- **If Coinsurance:**
  - Coinsurance: ____% (number input)
- **Requirements:**
  - ☑ Prior Authorization Required (checkbox)
  - ☑ Referral Required (checkbox)
- **Network Tiers (if applicable):**
  - In-Network: [above settings]
  - Out-of-Network: [separate settings]

**Buttons:** Save, Cancel

#### 3.6 Template Library
- **Grid View (Cards):**
  - Template thumbnail/icon
  - Template name
  - Description
  - Tags (Bronze, ACA, California, etc.)
  - Use Template (button)
- **Filters (Left Sidebar):**
  - Metal Tier
  - LOB
  - Market Type
  - State
  - Custom (my saved templates)
- **Preview (Click template):**
  - Full template details
  - Benefit summary
  - Sample premium
  - Use Template, Cancel

#### 3.7 Import Products (Wizard)
**Step 1: Upload File**
- Drag & drop area
- Or browse files
- Supported: Excel (.xlsx), CSV

**Step 2: Map Columns**
- Table: File Column → System Field
- Auto-detect common mappings
- Manual dropdown for each column
- Preview data

**Step 3: Validation**
- Validate data format
- Show errors/warnings
- Fix errors (edit inline or download error report)

**Step 4: Import**
- Confirm import
- Progress bar
- Success summary
- View imported products

---

## APPLICATION 4: RATING & COMPLIANCE WORKBENCH

**User Role:** Actuarial Analyst, Compliance Officer  
**Purpose:** Configure rating, run scenarios, validate compliance  
**Epic Alignment:** Epics 9, 10

### Navigation Structure

```
RATING & COMPLIANCE WORKBENCH
│
├── 🏠 Dashboard
│   └── Rating summary, compliance status, recent activity
│
├── 💰 Rating Engine (Epic 9)
│   ├── Rating Configuration
│   │   ├── Rating Factors Setup
│   │   │   ├── Age Curves
│   │   │   ├── Area Factors
│   │   │   ├── Tobacco Surcharge
│   │   │   └── Family Composition
│   │   ├── Rating Methodology
│   │   │   ├── Community Rating
│   │   │   ├── Experience Rating
│   │   │   └── Manual Rates
│   │   └── Actuarial Assumptions
│   │       ├── Medical Trend
│   │       ├── Utilization Assumptions
│   │       └── Unit Costs
│   ├── Calculate Rates
│   │   ├── Select Product
│   │   ├── Enter Demographics (age, geography, etc.)
│   │   ├── Calculate Premium
│   │   └── View Rate Breakdown
│   ├── Actuarial Modeling
│   │   ├── Cost Projections
│   │   │   ├── Claims Cost (PMPM)
│   │   │   ├── Medical Trend
│   │   │   └── Utilization Forecast
│   │   ├── Financial Modeling
│   │   │   ├── MLR Target
│   │   │   ├── Admin Costs
│   │   │   ├── Profit Margin
│   │   │   └── Reserves (IBNR)
│   │   └── Risk Adjustment
│   │       ├── HCC/RAF Scores
│   │       ├── Risk Corridor
│   │       └── Reinsurance Impact
│   ├── Scenario Testing
│   │   ├── What-If Analysis
│   │   │   ├── Create Scenario
│   │   │   ├── Run Scenario
│   │   │   └── Compare Scenarios
│   │   ├── Monte Carlo Simulation
│   │   │   ├── Configure Parameters
│   │   │   ├── Run Simulation (1,000+ iterations)
│   │   │   └── View Results (probability distribution)
│   │   └── Sensitivity Analysis
│   │       └── Test impact of variable changes
│   ├── Competitive Analysis
│   │   ├── Compare Rates to Competitors
│   │   ├── Market Positioning
│   │   └── Price Elasticity Analysis
│   └── Rate Filing
│       ├── Generate Rate Filing Documentation
│       ├── Actuarial Memorandum
│       ├── Rate Tables (export)
│       └── Justification Narrative
│
└── ✅ Compliance & Validation (Epic 10)
    ├── Compliance Dashboard
    │   ├── Compliance Summary by Product
    │   ├── Open Issues
    │   └── Recent Rule Changes
    ├── Run Compliance Check
    │   ├── Select Product
    │   ├── Select Rules to Check
    │   │   ├── Federal (ACA, CMS)
    │   │   ├── State-Specific
    │   │   └── Medicare/Medicaid
    │   ├── Run Validation
    │   └── View Results
    ├── Compliance Rules Library
    │   ├── Federal Rules
    │   │   ├── ACA Essential Health Benefits
    │   │   ├── Actuarial Value Requirements
    │   │   ├── OOP Maximum Limits
    │   │   ├── Preventive Care (100% coverage)
    │   │   └── Network Adequacy
    │   ├── State Rules (by state)
    │   │   ├── State-Mandated Benefits
    │   │   ├── Provider Type Requirements
    │   │   └── Balance Billing Protections
    │   ├── Medicare Advantage Rules
    │   └── Medicaid Rules
    ├── Compliance Results
    │   ├── Issues List
    │   │   ├── Critical Errors (must fix)
    │   │   ├── Warnings (review required)
    │   │   └── Passed Checks
    │   ├── Issue Detail
    │   │   ├── Description
    │   │   ├── Rule Reference
    │   │   ├── Suggested Fix
    │   │   └── Auto-Fix (if available)
    │   └── Apply Fix
    ├── Compliance Reports
    │   ├── Generate Compliance Report
    │   ├── Export (PDF)
    │   └── Audit Trail
    └── Rule Management (Admin)
        ├── View Rules
        ├── Update Rules (annual regulatory changes)
        └── Rule Version History
```

### Key Screens

#### 4.1 Rating Configuration - Age Curves
- **Screen:** Table of age-based rating factors
- **Columns:** Age, Factor, Actions (Edit)
- **Upload Age Curve (CSV)**
- **Preview Chart** (visualize age curve)
- **Save/Reset**

#### 4.2 Rating Configuration - Area Factors
- **Geographic Rating Factors**
- **View by:** State → County → ZIP
- **Table:** Area, Factor, Actions
- **Import Area Factors (CSV)**
- **Map View** (future: color-coded by factor)

#### 4.3 Calculate Rates (Simple Calculator)
**Form Layout:**

**Input Section:**
- **Product:** Dropdown (select product)
- **Demographics:**
  - Age: ___ (number)
  - Geography: State (dropdown) → County (dropdown)
  - Tobacco: Yes/No (toggle)
  - Family Type: Dropdown (Individual, Couple, Family, etc.)
- **Effective Date:** Date picker

**Calculate Button** (primary)

**Output Section:**
- **Monthly Premium:** $XXX.XX (large, bold)
- **Breakdown:**
  - Base Premium: $XXX
  - Age Factor: X.XX (±$XX)
  - Area Factor: X.XX (±$XX)
  - Tobacco Surcharge: $XX (if applicable)
- **Actuarial Metrics:**
  - MLR: XX%
  - Actuarial Value: XX%

#### 4.4 Actuarial Modeling - Cost Projections
**Tab View:** Claims Cost | Financial | Risk Adjustment

**Claims Cost Tab:**
- **Input Parameters:**
  - Medical Trend: ___% (number)
  - Utilization Change: ___% (number)
  - Unit Cost Change: ___% (number)
- **Calculate Button**
- **Results:**
  - Projected PMPM: $XXX
  - Annual Cost per Member: $X,XXX
  - Total Cost (if enrollment known): $X,XXX,XXX
- **Chart:** Projected cost over 5 years (line chart)

**Financial Tab:**
- **Input Parameters:**
  - MLR Target: ___% (number, default 80%)
  - Admin Cost: ___% or $____ per member
  - Profit Margin: ___%
  - Reserves (IBNR): ___%
- **Calculate Button**
- **Results:**
  - Required Premium: $XXX PMPM
  - Profit Margin ($): $XX PMPM
  - MLR: XX.X%
- **Chart:** Premium breakdown (pie chart)

**Risk Adjustment Tab:**
- **HCC/RAF Configuration**
- **Input:** Average RAF Score: X.XX
- **Risk Corridor:** Configure bands
- **Results:** Adjusted premium

#### 4.5 Scenario Testing - What-If Analysis
**Layout:** Table of scenarios

**Create Scenario:**
- Scenario Name: (text)
- Base Product: (dropdown)
- Changes to Test:
  - ☑ Increase Deductible $500
  - ☑ Increase Copay $5
  - ☑ Medical Trend +1%
  - (more checkboxes/inputs)
- Save Scenario

**Run Scenario:**
- Select scenario(s) to run
- Run button
- Results table:
  - Scenario Name, Premium, MLR, Savings, Actions

**Compare Scenarios:**
- Select 2-4 scenarios
- Side-by-side comparison table
- Highlight differences
- Export comparison

#### 4.6 Compliance Dashboard
**Summary Cards (Top Row):**
- Total Products: XX
- Compliant: XX (green)
- Issues Found: XX (yellow)
- Critical Errors: XX (red)

**Products with Issues (Table):**
- Product Name, LOB, Issues (count), Severity, Last Check, Actions

**Recent Rule Changes (Feed):**
- Date, Rule, Description, Affected Products

**Quick Actions:**
- Run Compliance Check
- View All Rules
- Generate Report

#### 4.7 Run Compliance Check
**Step 1: Select Product**
- Dropdown: Select product

**Step 2: Select Rules**
- Checkboxes (organized by category):
  - ☑ Federal - ACA Requirements (all)
  - ☑ State - California Mandates (all)
  - ☑ Network Adequacy
  - (expand/collapse categories)
- Or: Select All

**Step 3: Run Validation**
- Progress bar
- "Checking XXX rules..."

**Step 4: View Results**
- Redirect to Compliance Results page

#### 4.8 Compliance Results
**Summary (Top):**
- ✅ Passed: XX checks
- ⚠️ Warnings: XX issues
- ❌ Errors: XX critical issues

**Issues List (Table):**
- Severity (icon), Rule, Description, Suggested Fix, Actions

**Issue Detail (Click row to expand):**
- **Rule:** ACA Essential Health Benefits - Missing Autism Coverage
- **Severity:** ❌ Critical Error (must fix)
- **Description:** Plan does not include required autism coverage (Colorado mandate)
- **Affected Benefit:** Mental Health Services
- **Suggested Fix:** Add CPT codes 97151-97158 (autism behavior therapy)
- **Actions:**
  - Auto-Fix (button) - if available
  - Manual Fix (button) - opens benefit designer
  - Mark as Exception (button) - if allowed

**Auto-Fix (Click):**
- Modal: "Apply suggested fix?"
- Details: "Add autism coverage with $25 copay (default)"
- Confirm / Cancel
- If confirmed: Apply fix, re-run validation, update results

#### 4.9 Compliance Report (Generated)
**PDF Export:**
- Header: Product Name, Compliance Check Date
- **Summary:**
  - Compliance Status: ✅ Compliant / ⚠️ Issues Found
  - Rules Checked: XXX
  - Passed: XXX, Warnings: XX, Errors: XX
- **Detailed Results:**
  - List of all rules checked
  - Pass/Fail status
  - For failures: Description, suggested fix
- **Audit Trail:**
  - Who ran the check
  - When
  - Product version
- **Sign-Off Section:**
  - Compliance Officer signature line
  - Date

---

## APPLICATION 5: PUBLISHING & ANALYTICS DASHBOARD

**User Role:** Publishing Manager, Analytics User, Executives  
**Purpose:** Publish products, monitor performance, view analytics  
**Epic Alignment:** Epics 11, 12

### Navigation Structure

```
PUBLISHING & ANALYTICS DASHBOARD
│
├── 🏠 Dashboard (Home)
│   └── Executive summary, key metrics, recent activity
│
├── 🚀 Publishing (Epic 11)
│   ├── Publishing Dashboard
│   │   ├── Publishing Status by Product
│   │   ├── Recent Publications
│   │   └── Publishing Errors
│   ├── Publish Product
│   │   ├── Select Product
│   │   ├── Select Channels
│   │   │   ├── ☑ Healthcare.gov (Federal Exchange)
│   │   │   ├── ☑ State Exchanges (select states)
│   │   │   ├── ☑ Broker Portals (select brokers)
│   │   │   ├── ☑ Health Plan Website
│   │   │   └── ☑ Marketing Materials
│   │   ├── Generate Documents
│   │   │   ├── Summary of Benefits & Coverage (SBC)
│   │   │   ├── Evidence of Coverage (EOC)
│   │   │   └── Rate Filing (SERFF)
│   │   ├── Preview & Validate
│   │   └── Publish (one-click)
│   ├── SERFF Filing
│   │   ├── Generate SERFF Filing
│   │   ├── Review Filing
│   │   ├── Upload to SERFF
│   │   └── Track Filing Status
│   ├── Product Feeds
│   │   ├── Generate Broker Feed (XML/JSON)
│   │   ├── API Endpoint Config
│   │   └── Webhook Settings
│   ├── Marketing Materials
│   │   ├── Generate SBC (PDF)
│   │   ├── Generate EOC (PDF)
│   │   ├── Generate Brochures
│   │   └── Download All Materials
│   └── Publishing History
│       ├── Past Publications (table)
│       ├── Unpublish Product
│       └── Rollback Publication
│
└── 📊 Performance Analytics (Epic 12)
    ├── Executive Dashboard
    │   ├── Key Metrics (cards)
    │   │   ├── Total Enrollment
    │   │   ├── MLR (Medical Loss Ratio)
    │   │   ├── Profit Margin
    │   │   └── Member Retention
    │   ├── Enrollment Trends (chart)
    │   ├── Financial Performance (chart)
    │   └── Top/Bottom Products (table)
    ├── Product Performance
    │   ├── Performance by Product (table)
    │   ├── Product Detail (drill-down)
    │   │   ├── Enrollment Metrics
    │   │   ├── Financial Metrics
    │   │   ├── Utilization Metrics
    │   │   └── Member Satisfaction
    │   └── Compare Products
    ├── Enrollment Analytics
    │   ├── Enrollment by Channel
    │   │   ├── Exchange Enrollment
    │   │   ├── Broker Enrollment
    │   │   └── Direct Enrollment
    │   ├── Enrollment by Demographics
    │   │   ├── By Age
    │   │   ├── By Geography
    │   │   └── By Family Type
    │   ├── Enrollment Forecasting
    │   │   ├── Projected Enrollment (12 months)
    │   │   └── Seasonality Analysis
    │   └── Disenrollment Analysis
    │       ├── Churn Rate
    │       ├── Reasons for Disenrollment
    │       └── At-Risk Members
    ├── Financial Analytics
    │   ├── MLR Tracking
    │   │   ├── MLR by Product
    │   │   ├── MLR Trends
    │   │   └── MLR vs. Target
    │   ├── Claims Analytics
    │   │   ├── Claims Cost (PMPM)
    │   │   ├── High-Cost Claimants
    │   │   ├── Cost Drivers
    │   │   └── Cost Trends
    │   └── Profitability
    │       ├── Profit/Loss by Product
    │       ├── ROI by Product
    │       └── Break-Even Analysis
    ├── Utilization Analytics
    │   ├── Benefit Utilization
    │   │   ├── Office Visits (per 1,000)
    │   │   ├── Hospital Admissions (per 1,000)
    │   │   ├── ER Visits (per 1,000)
    │   │   ├── Prescription Fills
    │   │   └── Preventive Care Usage
    │   ├── High-Value vs. Low-Value Benefits
    │   └── Underutilized Benefits
    ├── AI-Powered Recommendations (Future)
    │   ├── Cost Reduction Opportunities
    │   ├── Enrollment Growth Strategies
    │   ├── Competitive Positioning Insights
    │   └── Benefit Optimization Ideas
    ├── Competitive Intelligence
    │   ├── Competitor Products (table)
    │   ├── Competitor Premium Changes
    │   ├── Market Share Trends
    │   └── Competitive Alerts
    └── Reports
        ├── Standard Reports
        │   ├── Executive Summary (monthly)
        │   ├── MLR Report (quarterly)
        │   ├── Enrollment Report
        │   └── Utilization Report
        ├── Custom Reports
        │   ├── Create Custom Report
        │   └── Saved Reports
        └── Export
            ├── Export to Excel
            ├── Export to PDF
            └── Schedule Report (email)
```

### Key Screens

#### 5.1 Executive Dashboard (Home)
**Layout:** Cards + Charts

**Top Row - Key Metric Cards:**
- **Total Enrollment:** XX,XXX members (↑ X% vs. last month)
- **Average MLR:** XX.X% (target: 80%)
- **Profit Margin:** X.X% (↑ X.X% vs. last quarter)
- **Member Retention:** XX% (↓ X% vs. last year)

**Charts (2 columns):**
- **Left Column:**
  - **Enrollment Trends:** Line chart (12 months, by product)
  - **Enrollment by Channel:** Donut chart (Exchange, Broker, Direct)
- **Right Column:**
  - **Financial Performance:** Stacked bar chart (Revenue, Claims Cost, Admin, Profit)
  - **MLR by Product:** Horizontal bar chart (color-coded: green <80%, yellow 80-85%, red >85%)

**Bottom - Tables:**
- **Top Products:** (by enrollment)
  - Product Name, Enrollment, MLR, Profit, Actions
- **Products Needing Attention:** (high churn, poor MLR)
  - Product Name, Issue, Recommendation, Actions

**Quick Actions (Top Right):**
- View All Products
- Run Analytics
- Download Report

#### 5.2 Publishing Dashboard
**Summary Cards:**
- Products Published: XX
- Pending Publications: XX
- Publishing Errors: XX
- Last Published: Date/Time

**Recent Publications (Table):**
- Product Name, Channel(s), Published Date, Published By, Status, Actions

**Publishing Errors (Table - if any):**
- Product Name, Channel, Error Message, Date, Actions (Retry, View Details)

**Quick Actions:**
- Publish Product (primary button)
- View All Publications
- Manage Channels

#### 5.3 Publish Product (Wizard)
**Step 1: Select Product**
- Dropdown: Select product to publish
- Show product summary (name, LOB, plans, status)
- Check: Is product ready?
  - ✅ Benefits configured
  - ✅ Rates calculated
  - ✅ Compliance validated
  - ❌ Not ready (show issues)

**Step 2: Select Channels**
- Checkboxes:
  - ☑ **Healthcare.gov** (Federal Exchange)
  - ☑ **State Exchanges** (expand to select specific states)
    - ☑ California (Covered California)
    - ☑ New York (NY State of Health)
    - (more states...)
  - ☑ **Broker Portals** (expand to select brokers)
    - ☑ eHealth
    - ☑ GoHealth
    - (more brokers...)
  - ☑ **Health Plan Website**
  - ☑ **Marketing Materials** (SBC, EOC, Brochures)

**Step 3: Generate Documents**
- Auto-generate required documents
- Progress indicators:
  - ⏳ Generating SBC...
  - ⏳ Generating EOC...
  - ⏳ Generating Rate Filing...
- **Preview Documents:** Links to preview each document (PDF)

**Step 4: Preview & Validate**
- **Preview Publishing Package:**
  - Product details summary
  - Channel list
  - Documents list
- **Validation Checks:**
  - ✅ All required documents generated
  - ✅ Product passes compliance
  - ✅ Rates finalized
  - ✅ Channels configured
- **Warning Messages (if any):**
  - ⚠️ "Product not yet published to Healthcare.gov (first time setup required)"

**Step 5: Confirm & Publish**
- **Review Summary**
- **Publish Now / Schedule Publish** (date picker)
- **Confirm Button** (primary)

**Step 6: Publishing Status**
- Progress indicators for each channel:
  - Healthcare.gov: ⏳ Publishing... (progress bar)
  - California: ✅ Published
  - Website: ✅ Published
  - Brokers: ⏳ Publishing... (progress bar)
- **Overall Status:** X of Y channels published
- **Errors (if any):** Show error messages, Retry button
- **Done Button** (when complete)

#### 5.4 Generate SBC (Auto)
**Background Process:**
- Template: Use CMS SBC template (PDF)
- Auto-populate fields from product data:
  - Plan name, ID
  - Coverage period
  - Deductibles, OOP max
  - Copays/coinsurance (by service type)
  - Covered benefits (table)
  - Examples (common medical events)
- Generate PDF
- Store in Documents

**User Action:**
- Preview SBC (PDF viewer)
- Download SBC
- Regenerate (if changes made)

#### 5.5 Product Performance - Detail View
**Product Header:**
- Product Name, ID
- Status badge
- Effective dates
- Tabs: Enrollment | Financial | Utilization | Satisfaction

**Enrollment Tab:**
- **Key Metrics (Cards):**
  - Total Enrollment: X,XXX
  - New Enrollments (this month): XXX
  - Disenrollments (this month): XX
  - Net Change: +XXX
  - Churn Rate: X.X%
- **Enrollment Trends (Chart):**
  - Line chart: Enrollment over time (12 months)
- **Enrollment by Demographics (Charts):**
  - Age distribution (bar chart)
  - Geography (map or table)
  - Family type (pie chart)
- **Enrollment by Channel (Table):**
  - Channel, Enrollment, % of Total

**Financial Tab:**
- **Key Metrics (Cards):**
  - Total Premium Revenue: $X,XXX,XXX
  - Total Claims Cost: $X,XXX,XXX
  - MLR: XX.X%
  - Profit: $XXX,XXX
  - Profit Margin: X.X%
- **MLR Trend (Chart):**
  - Line chart: MLR over time (12 months)
  - Target line (80%)
- **Claims Cost (Chart):**
  - Bar chart: Claims by category (hospital, Rx, office visits, etc.)
- **Financial Summary (Table):**
  - Month, Premium, Claims, MLR, Profit

**Utilization Tab:**
- **Key Metrics (Cards):**
  - Office Visits: XXX per 1,000 members
  - Hospital Admissions: XX per 1,000
  - ER Visits: XX per 1,000
  - Prescription Fills: XXX per member
- **Utilization Trends (Chart):**
  - Line charts: Trends over time
- **Benefit Utilization (Table):**
  - Benefit Type, Utilization, Cost, % of Total Cost
- **High-Cost Services:**
  - Top 10 services by cost

**Satisfaction Tab (Future):**
- Member satisfaction scores
- NPS (Net Promoter Score)
- CAHPS survey results (if available)
- Member feedback

#### 5.6 AI-Powered Recommendations (Future Phase)
**Layout:** Cards with recommendations

**Example Recommendation Card:**
- **Title:** 💡 Cost Reduction Opportunity
- **Recommendation:** "Increase office visit copay from $25 to $30"
- **Estimated Savings:** $1.2M/year
- **Confidence:** 87%
- **Impact:**
  - Enrollment: -2% (low impact)
  - Member Satisfaction: -3% (low impact)
  - Competitive Positioning: Neutral
- **Actions:**
  - Apply Recommendation (button)
  - Run Scenario (button)
  - Dismiss

**Other Recommendation Examples:**
- "Add telemedicine benefit → saves $800K/year"
- "Lower deductible $250 → 15% more enrollment"
- "Premium $20 too high vs. competitors"

#### 5.7 Reports - Standard Report (Monthly Executive Summary)
**PDF Generated Report:**

**Header:**
- Company logo
- Report title: "Monthly Executive Summary - October 2025"
- Generated date

**Contents:**
1. **Executive Summary** (1-2 paragraphs)
   - Overall performance
   - Key highlights
   - Concerns

2. **Key Metrics (Table)**
   - Metric, This Month, Last Month, Change, YTD
   - Enrollment, MLR, Profit, Retention, etc.

3. **Enrollment Summary**
   - Total enrollment by product (table)
   - Enrollment trends (chart)
   - New vs. disenrollments

4. **Financial Summary**
   - Premium revenue by product (table)
   - MLR by product (table)
   - Profitability (table)

5. **Top Products & Bottom Products**
   - Top 5 by enrollment (table)
   - Products needing attention (table)

6. **Recommendations**
   - List of actions to take

**Footer:**
- Page numbers
- Generated by: Products & Benefits Platform

**Download Options:**
- PDF
- Excel (data tables)

---

## GLOBAL UI ELEMENTS

### Common to All Applications

#### Top Navigation Bar
```
[Logo] [App Selector] | [Search] | [Notifications] [Help] [User Menu]
```

- **Logo:** Click to return to home
- **App Selector:** Dropdown to switch between applications
  - Platform Admin Console
  - Code Management Studio
  - Product Design Studio
  - Rating & Compliance Workbench
  - Publishing & Analytics Dashboard
- **Global Search:** Search across all products, codes, users
- **Notifications:** Bell icon with badge (unread count)
- **Help:** Link to documentation, support, tutorials
- **User Menu:** 
  - Profile
  - Settings
  - Logout

#### Left Sidebar (Within Each Application)
- Collapsible navigation menu
- Icons + labels
- Active section highlighted
- Expand/collapse toggle

#### Breadcrumbs (Top of Content Area)
```
Home > Products > Product Detail > Edit Benefits
```
- Click any level to navigate back

#### Action Buttons (Standard)
- **Primary Action:** Blue button (e.g., "Create Product", "Save", "Publish")
- **Secondary Action:** Gray outline button (e.g., "Cancel", "Back")
- **Destructive Action:** Red button (e.g., "Delete", "Archive")

#### Data Tables (Standard Patterns)
- **Columns:** Sortable (click header)
- **Actions Column:** Right-most, icon buttons (View, Edit, Delete, etc.)
- **Bulk Actions:** Checkboxes in first column, bulk action bar appears when selected
- **Pagination:** Bottom, show "Showing X-Y of Z" and page numbers
- **Export:** Button above table (Export to CSV/Excel)

#### Forms (Standard Patterns)
- **Required Fields:** Red asterisk (*)
- **Field Validation:** Real-time (invalid = red border + error message)
- **Help Text:** Gray text below field
- **Save Actions:** Save (primary), Save & Continue, Cancel

#### Modals/Dialogs
- **Confirmation Dialogs:** "Are you sure?" with Yes/Cancel
- **Form Modals:** For quick edits or adds
- **Full-Screen Modals:** For complex workflows (e.g., wizards)

#### Notifications/Toasts
- **Success:** Green toast, top-right, auto-dismiss (3s)
- **Error:** Red toast, top-right, manual dismiss
- **Info:** Blue toast
- **Warning:** Yellow toast

---

## USER WORKFLOWS (Key Scenarios)

### Workflow 1: Create New Product from Scratch
1. Navigate: Product Design Studio > Product Catalog > Create Product
2. Wizard: Enter product info → Select geography → Configure structure
3. Result: Product created (Draft status)
4. Navigate: Product Detail > Benefits Tab > Design Benefits
5. Design Studio: Drag components → Configure cost-sharing → Save
6. Navigate: Rating & Compliance > Calculate Rates
7. Enter demographics → Calculate → Review premium
8. Navigate: Rating & Compliance > Run Compliance Check
9. Select product → Run validation → Review results → Fix issues
10. Navigate: Product Detail > Submit for Approval
11. Result: Product status → In Review

### Workflow 2: Import Products from Excel
1. Navigate: Product Design Studio > Product Catalog > Import Products
2. Wizard: Upload file → Map columns → Validate → Import
3. Result: Products created (Draft status)
4. Navigate: Products List → Select imported product → Review details
5. Navigate: Product Detail > Design Benefits (if needed)
6. Continue with rating, compliance, approval workflow

### Workflow 3: Publish Approved Product
1. Navigate: Publishing Dashboard > Publish Product
2. Wizard: Select product → Select channels → Generate documents → Preview → Publish
3. Monitor: Publishing status (real-time progress)
4. Result: Product published to all channels
5. Navigate: Publishing History → View published product

### Workflow 4: Monitor Product Performance
1. Navigate: Publishing & Analytics > Executive Dashboard
2. Review: Key metrics, enrollment trends, financial performance
3. Navigate: Product Performance > Select product
4. Review: Enrollment, financial, utilization tabs
5. Identify: Issues or opportunities
6. Navigate: Product Design Studio > Edit product (if changes needed)

### Workflow 5: Run "What-If" Rate Scenario
1. Navigate: Rating & Compliance > Actuarial Modeling > Scenario Testing
2. Create Scenario: Name scenario → Select base product → Define changes
3. Run Scenario: Calculate new premium, MLR, savings
4. Compare: Side-by-side comparison with base product
5. Decision: Apply changes or discard scenario

---

## RESPONSIVE DESIGN NOTES

### Desktop (Primary)
- All screens optimized for desktop (1920x1080 or 1440x900)
- Three-panel layouts (left sidebar, center content, right preview)
- Data tables with many columns

### Tablet (Optional)
- Collapsible sidebars
- Stacked panels (center content full-width, right panel below)
- Simplified tables (fewer columns)

### Mobile (Future - Not Phase 1)
- Mobile apps for field users (brokers, agents)
- Simplified workflows
- Read-only dashboards

---

## UI TECHNOLOGY STACK (Recommendations)

### Frontend Framework
- **React** (with TypeScript)
- **Next.js** (for SSR and routing)

### UI Component Library
- **Material-UI (MUI)** or **Ant Design** (comprehensive component set)
- **Tailwind CSS** (for custom styling)

### Data Visualization
- **Recharts** or **Chart.js** (charts and graphs)
- **React Data Grid** or **AG Grid** (data tables)

### Drag-and-Drop
- **React DnD** or **dnd-kit** (for Design Studio canvas)

### Forms
- **React Hook Form** (form state management)
- **Yup** or **Zod** (validation)

### State Management
- **React Query** (server state)
- **Zustand** or **Redux Toolkit** (client state)

### Backend API Pattern
- **RESTful APIs** (primary)
- **GraphQL** (for complex queries - Design Studio)
- **WebSockets** (for real-time updates - Publishing status)

---

## SUMMARY

### Total UI Screens Estimated: 150+ screens

**Breakdown by Application:**
- Platform Admin Console: ~20 screens
- Code Management Studio: ~40 screens
- Product Design Studio: ~45 screens
- Rating & Compliance Workbench: ~30 screens
- Publishing & Analytics Dashboard: ~25 screens

### Design System Needed:
- Component library (buttons, forms, tables, cards, etc.)
- Color palette (primary, secondary, success, error, etc.)
- Typography (fonts, sizes, weights)
- Spacing & layout grid
- Icon set

### Next Steps:
1. **Create wireframes** for key screens (20-30 priority screens)
2. **Design mockups** (high-fidelity designs for 5-10 screens)
3. **Build design system** (reusable components)
4. **Prototype** key workflows (clickable prototype)
5. **User testing** (validate with target users)

---

## QUESTIONS FOR YOU

1. **UI Complexity:** Is this the right level of detail, or too much?
2. **Design System:** Do you want me to create a design system (colors, typography, components)?
3. **Wireframes:** Should I create wireframes for priority screens?
4. **Navigation:** Does this navigation structure make sense?
5. **Missing UIs:** Are there any screens or workflows I'm missing?

---

**Does this help separate the UI from the APIs and give you a clearer picture of the user experience?** 🎯
