# COMPLETE UI PAGE INVENTORY
## Products & Benefits Platform - All Screens Documented

**Total Screens:** 160+ screens  
**Applications:** 5 main applications  
**Document Purpose:** Complete list of every page/screen with its purpose

---

## TABLE OF CONTENTS

1. [Platform Admin Console](#1-platform-admin-console) - 20 screens
2. [Code Management Studio](#2-code-management-studio) - 40 screens
3. [Product Design Studio](#3-product-design-studio) - 45 screens
4. [Rating & Compliance Workbench](#4-rating--compliance-workbench) - 30 screens
5. [Publishing & Analytics Dashboard](#5-publishing--analytics-dashboard) - 25 screens
6. [Shared/Common Screens](#6-sharedcommon-screens) - 10 screens
7. [Mobile App Screens](#7-mobile-app-screens) - 15 screens (Future)

---

## GLOBAL NAVIGATION

**Every application includes these global elements:**

### Top Navigation Bar (Present on ALL screens)
- **Logo** - Click to return home
- **App Switcher** - Dropdown to change applications
- **Global Search** - Search across products, codes, users
- **Notifications** - Bell icon with badge
- **Help** - Documentation and tutorials
- **User Menu** - Profile, settings, logout

### Common Dialogs/Modals (Reusable)
1. **Confirmation Dialog** - "Are you sure?" prompts
2. **Error Dialog** - Display error messages
3. **Success Toast** - Action confirmation
4. **Loading Overlay** - Processing indicator
5. **Help Sidebar** - Contextual help panel

---

## 1. PLATFORM ADMIN CONSOLE

**User Role:** Platform Administrator  
**Purpose:** System-wide configuration and user management  
**Total Screens:** 20

### 1.1 Dashboard & Overview (3 screens)

#### PA-001: Admin Dashboard
**Purpose:** System health overview and quick actions  
**Components:**
- System health cards (uptime, performance, errors)
- Recent activity feed
- Quick action buttons
- Alert summary
- User activity chart
**Key Actions:** View alerts, navigate to sections

#### PA-002: System Status
**Purpose:** Detailed system health monitoring  
**Components:**
- Service status table (database, API, storage, etc.)
- Performance metrics (CPU, memory, disk)
- Recent incidents log
- Uptime statistics
**Key Actions:** Refresh status, view logs

#### PA-003: Audit Log Viewer
**Purpose:** View all system activity  
**Components:**
- Filterable log table (date, user, action, entity)
- Search functionality
- Export options
**Key Actions:** Search, filter, export logs

---

### 1.2 User Management (5 screens)

#### PA-004: Users List
**Purpose:** View and manage all users  
**Components:**
- Users table (name, email, role, status, last login)
- Filters (role, status, organization)
- Search bar
- Bulk actions (activate, deactivate, delete)
**Key Actions:** Add user, edit user, view details

#### PA-005: Add/Edit User
**Purpose:** Create or modify user account  
**Components:**
- User profile form (name, email, phone)
- Organization selector
- Role selector (admin, product manager, actuarial, etc.)
- Status toggle (active/inactive)
- Permission checkboxes
**Key Actions:** Save, cancel

#### PA-006: User Detail
**Purpose:** View complete user information  
**Components:**
- User profile (tabs: Overview, Permissions, Activity, Audit)
- Recent activity log
- Assigned products
- Permission summary
**Key Actions:** Edit, deactivate, reset password

#### PA-007: Roles & Permissions
**Purpose:** Configure role-based access control  
**Components:**
- Roles list (predefined + custom)
- Permission matrix (role × feature)
- Create custom role form
**Key Actions:** Create role, edit permissions

#### PA-008: User Activity Dashboard
**Purpose:** Monitor user engagement  
**Components:**
- Active users chart (daily/weekly/monthly)
- Top users table (by activity)
- Login frequency chart
- Feature usage heatmap
**Key Actions:** View details, export report

---

### 1.3 Organization Settings (4 screens)

#### PA-009: Company Profile
**Purpose:** Configure organization details  
**Components:**
- Company info form (name, address, contact)
- Logo upload
- Branding settings (colors, themes)
- Regulatory info (NAIC number, licenses)
**Key Actions:** Save, upload logo

#### PA-010: Lines of Business
**Purpose:** Configure available LOBs  
**Components:**
- LOB list (Commercial, Medicare, Medicaid)
- Enable/disable toggles
- LOB-specific settings
**Key Actions:** Enable LOB, configure

#### PA-011: Service Areas
**Purpose:** Define geographic coverage  
**Components:**
- States table (checkboxes to enable)
- County selector per state
- Service area maps (visual)
**Key Actions:** Add states, configure counties

#### PA-012: Plan Years
**Purpose:** Manage plan year configurations  
**Components:**
- Plan years list (2024, 2025, etc.)
- Active year indicator
- Add new year form (effective dates)
**Key Actions:** Add year, set active year

---

### 1.4 Integrations (4 screens)

#### PA-013: Data Sources
**Purpose:** Configure external data sources  
**Components:**
- Data sources list (CMS, SERFF, X12)
- Connection status indicators
- Test connection button
- Sync frequency settings
**Key Actions:** Add source, test connection, sync

#### PA-014: CMS Code Sets Configuration
**Purpose:** Configure CMS code set updates  
**Components:**
- Code set list (CPT, ICD-10, HCPCS, etc.)
- Last updated timestamp
- Auto-update settings
- Manual import button
**Key Actions:** Import codes, configure auto-update

#### PA-015: API Keys Management
**Purpose:** Manage API credentials  
**Components:**
- API keys table (name, key, created, last used)
- Create key form
- Revoke button
- Usage statistics
**Key Actions:** Generate key, revoke key

#### PA-016: Webhooks Configuration
**Purpose:** Configure event webhooks  
**Components:**
- Webhook list (endpoint, events)
- Create webhook form
- Test webhook button
- Event log
**Key Actions:** Add webhook, test, delete

---

### 1.5 System Configuration (4 screens)

#### PA-017: Global Settings
**Purpose:** System-wide preferences  
**Components:**
- General settings (timezone, currency, date format)
- Security settings (password policy, MFA)
- Notification settings (email, SMS)
- Feature flags (beta features)
**Key Actions:** Update settings

#### PA-018: Backup & Restore
**Purpose:** Database backup management  
**Components:**
- Backup schedule settings
- Backup history table
- Manual backup button
- Restore functionality
**Key Actions:** Backup now, restore from backup

#### PA-019: Email Templates
**Purpose:** Configure system emails  
**Components:**
- Email templates list (welcome, password reset, etc.)
- Email editor (WYSIWYG)
- Variable insertion ({{user.name}})
- Preview button
**Key Actions:** Edit template, preview, save

#### PA-020: System Logs
**Purpose:** View detailed system logs  
**Components:**
- Log viewer (filterable by level, date, source)
- Real-time log streaming toggle
- Download logs button
**Key Actions:** Filter, download, clear old logs

---

## 2. CODE MANAGEMENT STUDIO

**User Role:** Code Manager, Data Analyst  
**Purpose:** Manage healthcare billing codes and mappings  
**Total Screens:** 40

### 2.1 Code Library (8 screens)

#### CM-001: Code Library Dashboard
**Purpose:** Overview of code library status  
**Components:**
- Code set statistics cards (total codes, last updated)
- Update notifications
- Quick search
- Recent activity
**Key Actions:** Navigate to code sets

#### CM-002: Code Sets List
**Purpose:** View all available code sets  
**Components:**
- Code sets table (name, type, version, date)
- Status indicators (current, outdated)
- Update available badges
**Key Actions:** View codes, update set, import

#### CM-003: CPT Code Browser
**Purpose:** Browse and search CPT codes  
**Components:**
- CPT codes table (code, description, category, status)
- Hierarchical category tree (left sidebar)
- Advanced filters (category, status, date range)
- Search with autocomplete
**Key Actions:** View details, filter, search

#### CM-004: ICD-10 Code Browser
**Purpose:** Browse and search ICD-10 codes  
**Components:**
- ICD-10 codes table (code, description, type)
- Chapter/section navigation tree
- Search functionality
- Related codes suggestions
**Key Actions:** View details, search, filter

#### CM-005: HCPCS Code Browser
**Purpose:** Browse HCPCS/Level II codes  
**Components:**
- HCPCS codes table
- Level I vs Level II tabs
- Category filters
**Key Actions:** View, search, filter

#### CM-006: NDC Drug Browser
**Purpose:** Browse National Drug Codes  
**Components:**
- NDC table (code, drug name, manufacturer)
- Drug class filters
- Formulary status column
**Key Actions:** View details, filter by class

#### CM-007: Code Detail View
**Purpose:** View complete code information  
**Components:**
- Code information (tabs: Overview, Mappings, History, Related)
- Code metadata (effective dates, status)
- Related codes section
- Mapping summary
**Key Actions:** Edit, map to benefits, view history

#### CM-008: Code Version History
**Purpose:** View code change history  
**Components:**
- Version timeline
- Changes table (date, user, field changed, old/new value)
- Restore version button
**Key Actions:** View changes, restore version

---

### 2.2 Code Import & Export (6 screens)

#### CM-009: Import Wizard - Step 1 (Source Selection)
**Purpose:** Choose import source  
**Components:**
- Source options (CMS, file upload, API)
- File format selector (CSV, Excel, XML)
- Template download link
**Key Actions:** Select source, next

#### CM-010: Import Wizard - Step 2 (File Upload)
**Purpose:** Upload code set file  
**Components:**
- Drag-and-drop file uploader
- File validation preview
- Field mapping interface
**Key Actions:** Upload file, map fields, next

#### CM-011: Import Wizard - Step 3 (Preview & Validation)
**Purpose:** Review import before saving  
**Components:**
- Preview table (first 50 rows)
- Validation errors/warnings list
- Row count summary
**Key Actions:** Fix errors, back, import

#### CM-012: Import Wizard - Step 4 (Confirmation)
**Purpose:** Import complete confirmation  
**Components:**
- Import summary (success, errors, warnings)
- View imported codes button
- Import log download
**Key Actions:** View codes, close, import another

#### CM-013: Export Wizard
**Purpose:** Export code sets  
**Components:**
- Code set selector (checkboxes)
- Export format selector (CSV, Excel, JSON)
- Filter options (date range, status)
**Key Actions:** Select sets, configure, export

#### CM-014: Bulk Code Update
**Purpose:** Update multiple codes at once  
**Components:**
- Code selector (search + filter)
- Bulk update form (field, new value)
- Preview changes table
**Key Actions:** Select codes, update, confirm

---

### 2.3 Code-to-Benefit Mapping (8 screens)

#### CM-015: Mappings Library
**Purpose:** View all code-to-benefit mappings  
**Components:**
- Mappings table (code, benefit segment, copay, coinsurance)
- Filters (benefit segment, LOB, status)
- Search functionality
**Key Actions:** Create mapping, edit, delete

#### CM-016: Create Mapping - Manual Entry
**Purpose:** Manually map code to benefit  
**Components:**
- Code search & select
- Benefit segment selector
- Cost-sharing form (copay, coinsurance, deductible)
- Network configuration (in/out)
- Authorization rules
**Key Actions:** Save mapping, cancel

#### CM-017: Create Mapping - Wizard Mode
**Purpose:** Guided mapping creation  
**Components:**
- Step 1: Select code(s)
- Step 2: Choose benefit segment
- Step 3: Configure cost-sharing
- Step 4: Set authorization rules
- Step 5: Review & save
**Key Actions:** Navigate steps, save

#### CM-018: Bulk Mapping Tool
**Purpose:** Create multiple mappings at once  
**Components:**
- Code selection (bulk import or search)
- Benefit segment selector
- Apply same rules to all toggle
- Preview table
**Key Actions:** Select codes, apply rules, save

#### CM-019: Mapping Template Library
**Purpose:** Save and reuse mapping configurations  
**Components:**
- Templates list (name, LOB, benefit segment)
- Create template from existing mapping
- Apply template to codes
**Key Actions:** Create template, apply, edit

#### CM-020: Mapping Detail View
**Purpose:** View complete mapping configuration  
**Components:**
- Mapping information (tabs: Overview, Rules, History)
- Cost-sharing display
- Authorization requirements
- Effective dates
**Key Actions:** Edit, duplicate, delete

#### CM-021: Mapping Conflicts Resolver
**Purpose:** Resolve conflicting mappings  
**Components:**
- Conflicts table (code, conflicting rules)
- Side-by-side comparison
- Resolution options (keep, merge, replace)
**Key Actions:** Resolve conflicts, save

#### CM-022: Mapping Dependencies Viewer
**Purpose:** View mapping relationships  
**Components:**
- Dependency graph (visual)
- Affected products list
- Impact analysis
**Key Actions:** View details, export

---

### 2.4 Code Validation & Testing (6 screens)

#### CM-023: Validation Dashboard
**Purpose:** Overview of validation status  
**Components:**
- Validation summary cards (passed, failed, warnings)
- Recent validations list
- Quick actions
**Key Actions:** Run validation, view results

#### CM-024: Run Validation Wizard
**Purpose:** Configure and run validation  
**Components:**
- Scope selector (all codes, specific set, mappings)
- Validation rules checklist
- Schedule options (now, scheduled)
**Key Actions:** Configure, run, schedule

#### CM-025: Validation Results
**Purpose:** Display validation findings  
**Components:**
- Results table (code, issue, severity, suggested fix)
- Filter by severity (error, warning, info)
- Export results
- Bulk fix options
**Key Actions:** View details, auto-fix, export

#### CM-026: Code Testing Sandbox
**Purpose:** Test code mappings with sample claims  
**Components:**
- Test claim form (code, member, date)
- Benefit calculation display
- Expected vs actual comparison
**Key Actions:** Run test, save test case

#### CM-027: Test Scenarios Library
**Purpose:** Save and reuse test scenarios  
**Components:**
- Test scenarios list (name, codes, expected result)
- Run scenario button
- Results history
**Key Actions:** Create scenario, run, edit

#### CM-028: Validation Rules Configuration
**Purpose:** Configure validation rules  
**Components:**
- Rules list (enabled/disabled toggle)
- Rule details (criteria, severity)
- Custom rules editor
**Key Actions:** Enable/disable, edit, create custom

---

### 2.5 Code Set Management UI (6 screens)

#### CM-029: Code Search
**Purpose:** Advanced code search interface  
**Components:**
- Multi-field search form
- Search filters (code type, category, status)
- Results table with relevance scoring
- Save search button
**Key Actions:** Search, filter, save search

#### CM-030: Code Compare
**Purpose:** Compare multiple codes side-by-side  
**Components:**
- Code selector (up to 5 codes)
- Comparison table (attribute rows)
- Highlight differences toggle
**Key Actions:** Add codes, compare, export

#### CM-031: Code Hierarchy Viewer
**Purpose:** Visual code hierarchy navigation  
**Components:**
- Tree view (expandable nodes)
- Breadcrumb navigation
- Parent/child relationship display
**Key Actions:** Expand/collapse, navigate

#### CM-032: Code Usage Analytics
**Purpose:** View code utilization statistics  
**Components:**
- Usage charts (frequency, volume, trends)
- Top codes table
- Unused codes list
**Key Actions:** View details, filter dates

#### CM-033: Code Sunset Manager
**Purpose:** Manage deprecated/retired codes  
**Components:**
- Sunset codes list (code, retire date, replacement)
- Impact analysis (products affected)
- Replacement suggestions
**Key Actions:** Set sunset date, map replacement

#### CM-034: Code Documentation
**Purpose:** View and edit code documentation  
**Components:**
- Code description (rich text editor)
- Clinical guidelines
- Coding tips
- Related documentation links
**Key Actions:** Edit, save, attach files

---

### 2.6 Custom/Proprietary Codes (6 screens)

#### CM-035: Custom Codes Library
**Purpose:** View organization-specific codes  
**Components:**
- Custom codes table
- Category organization
- Status indicators
**Key Actions:** Create code, edit, activate

#### CM-036: Create Custom Code
**Purpose:** Add proprietary code  
**Components:**
- Code form (code, description, category)
- Pricing information
- Authorization requirements
**Key Actions:** Save, cancel

#### CM-037: Custom Code Marketplace
**Purpose:** Browse/share custom codes (future)  
**Components:**
- Marketplace grid (code packages)
- Search and filters
- Install button
**Key Actions:** Browse, install, share

#### CM-038: Custom Code Templates
**Purpose:** Create code templates  
**Components:**
- Template form
- Reusable fields
- Apply to multiple codes
**Key Actions:** Create, apply, edit

#### CM-039: Custom Code Approval Workflow
**Purpose:** Review/approve custom codes  
**Components:**
- Pending approval queue
- Code details view
- Approve/reject buttons
**Key Actions:** Review, approve, reject

#### CM-040: Custom Code Usage Report
**Purpose:** Analytics for custom codes  
**Components:**
- Usage statistics
- Adoption rates
- Financial impact
**Key Actions:** View details, export

---

## 3. PRODUCT DESIGN STUDIO

**User Role:** Product Manager, Benefit Designer  
**Purpose:** Design and configure insurance products  
**Total Screens:** 45

### 3.1 Product Catalog (8 screens)

#### PD-001: Product Catalog Dashboard
**Purpose:** Overview of all products  
**Components:**
- Product statistics cards (active, draft, retired)
- Products by LOB chart
- Recent activity
- Quick actions
**Key Actions:** Create product, view products

#### PD-002: Products List
**Purpose:** Browse all products  
**Components:**
- Products table (name, LOB, market, state, status)
- Advanced filters (LOB, market, state, status, year)
- Search functionality
- Bulk actions
**Key Actions:** View product, create, edit, duplicate

#### PD-003: Product Detail View
**Purpose:** Complete product information  
**Components:**
- Product tabs (Overview, Plans, Benefits, Documents, History)
- Product metadata
- Associated plans list
- Status workflow
**Key Actions:** Edit, version, duplicate, retire

#### PD-004: Create Product - Wizard Step 1 (Basic Info)
**Purpose:** Product identification  
**Components:**
- Product name field
- LOB selector (Commercial, Medicare, Medicaid)
- Market type (Individual, Small Group, Large Group)
- State selector
**Key Actions:** Next, cancel

#### PD-005: Create Product - Wizard Step 2 (Geography)
**Purpose:** Geographic coverage  
**Components:**
- State checkbox list
- County selector per state
- Service area map visualization
**Key Actions:** Back, next, cancel

#### PD-006: Create Product - Wizard Step 3 (Dates & Metadata)
**Purpose:** Product lifecycle dates  
**Components:**
- Effective date picker
- End date picker (optional)
- Plan year selector
- Product tags
**Key Actions:** Back, next, cancel

#### PD-007: Create Product - Wizard Step 4 (Summary & Confirm)
**Purpose:** Review before creation  
**Components:**
- Product summary display
- All entered information review
- Edit any step link
**Key Actions:** Back, create product, cancel

#### PD-008: Product Comparison
**Purpose:** Compare products side-by-side  
**Components:**
- Product selector (up to 4 products)
- Comparison table (all attributes)
- Benefit differences highlighting
**Key Actions:** Select products, export comparison

---

### 3.2 Product Lifecycle Management (5 screens)

#### PD-009: Product Version Manager
**Purpose:** Manage product versions  
**Components:**
- Version timeline
- Version list (version, date, status, changes)
- Create new version button
- Rollback functionality
**Key Actions:** Create version, view changes, rollback

#### PD-010: Product Amendment Wizard
**Purpose:** Create mid-year product changes  
**Components:**
- Amendment type selector
- Effective date
- Changes form
- Impact analysis
**Key Actions:** Create amendment, save, cancel

#### PD-011: Product Renewal Wizard
**Purpose:** Create annual renewal version  
**Components:**
- Base product selector
- New plan year
- Rate updates form
- Benefit changes checklist
**Key Actions:** Create renewal, save, cancel

#### PD-012: Product Approval Workflow
**Purpose:** Route product for approvals  
**Components:**
- Approval queue (pending, approved, rejected)
- Approvers list (actuarial, compliance, executive)
- Comments/feedback section
- Approve/reject buttons
**Key Actions:** Submit for approval, approve, reject

#### PD-013: Product Status Dashboard
**Purpose:** Track product status  
**Components:**
- Products by status chart
- Status transition history
- Workflow timeline
**Key Actions:** View details, change status

---

### 3.3 Benefit Package Management (7 screens)

#### PD-014: Benefit Packages List
**Purpose:** View product benefit packages  
**Components:**
- Packages table (name, type, plan count)
- Package types (Medical, Rx, Dental, Vision)
- Quick create buttons
**Key Actions:** Create package, edit, duplicate

#### PD-015: Create Benefit Package
**Purpose:** Add new benefit package  
**Components:**
- Package name field
- Type selector (Medical, Rx, Dental, Vision)
- Description field
- Template selector (optional)
**Key Actions:** Create, apply template, cancel

#### PD-016: Benefit Package Detail
**Purpose:** View package configuration  
**Components:**
- Package tabs (Benefits, Networks, Documents, History)
- Benefits list
- Cost-sharing summary
**Key Actions:** Add benefit, edit, delete

#### PD-017: Medical Benefits Configuration
**Purpose:** Configure medical benefits  
**Components:**
- Benefit categories (Office Visits, Hospital, Surgery, etc.)
- Add benefit button
- Benefits table
**Key Actions:** Add category, configure benefits

#### PD-018: Pharmacy Benefits Configuration
**Purpose:** Configure drug coverage  
**Components:**
- Formulary selector
- Tier structure (1-4 tiers)
- Cost-sharing by tier
- Prior authorization rules
**Key Actions:** Select formulary, configure tiers

#### PD-019: Dental Benefits Configuration
**Purpose:** Configure dental coverage  
**Components:**
- Benefit categories (Preventive, Basic, Major)
- Annual maximum field
- Waiting periods
**Key Actions:** Configure benefits, set limits

#### PD-020: Vision Benefits Configuration
**Purpose:** Configure vision coverage  
**Components:**
- Exam frequency
- Materials allowance
- Network restrictions
**Key Actions:** Configure benefits

---

### 3.4 Benefit Design Studio (Canvas) (10 screens)

#### PD-021: Design Studio Canvas
**Purpose:** Visual benefit design workspace  
**Components:**
- 3-panel layout (Library | Canvas | Configuration)
- Drag-and-drop components
- Real-time cost preview
**Key Actions:** Drag components, configure, save

#### PD-022: Component Library Panel
**Purpose:** Available benefit components  
**Components:**
- Component categories (Copay, Coinsurance, Deductible, etc.)
- Search components
- Component preview cards
**Key Actions:** Drag to canvas

#### PD-023: Canvas Workspace
**Purpose:** Main design area  
**Components:**
- Drop zones for components
- Component hierarchy tree
- Zoom/pan controls
**Key Actions:** Drop components, arrange, connect

#### PD-024: Configuration Panel
**Purpose:** Configure selected component  
**Components:**
- Dynamic form based on component type
- Validation rules
- Preview result
**Key Actions:** Edit values, validate, save

#### PD-025: Cost Preview Panel
**Purpose:** Real-time cost modeling  
**Components:**
- Member cost scenarios
- Premium impact display
- MLR calculation
**Key Actions:** Toggle scenarios, refresh

#### PD-026: Benefit Segment Builder
**Purpose:** Create benefit segment  
**Components:**
- Segment name field
- Code mappings selector
- Cost-sharing rules
**Key Actions:** Create segment, add codes

#### PD-027: Deductible Designer
**Purpose:** Configure deductible structure  
**Components:**
- Individual/family amounts
- Embedded vs non-embedded toggle
- In-network vs out-network
- Deductible types (medical, pharmacy, combined)
**Key Actions:** Configure, save

#### PD-028: Out-of-Pocket Maximum Designer
**Purpose:** Configure OOP max structure  
**Components:**
- Individual/family amounts
- Embedded vs non-embedded
- What counts toward OOP
**Key Actions:** Configure, save

#### PD-029: Network Configuration
**Purpose:** Configure network tiers  
**Components:**
- Network tier selector (Tier 1, 2, 3)
- Provider directory integration
- Cost-sharing by tier
**Key Actions:** Add tier, configure

#### PD-030: Prior Authorization Builder
**Purpose:** Configure PA rules  
**Components:**
- Service selector
- PA required toggle
- Criteria builder
- Alternative services
**Key Actions:** Add rule, configure criteria

---

### 3.5 Benefit Templates & Libraries (5 screens)

#### PD-031: Template Library
**Purpose:** Browse benefit templates  
**Components:**
- Templates grid (ACA Bronze, Silver, Gold, Platinum)
- Template preview
- Use template button
**Key Actions:** Preview, use template, create custom

#### PD-032: Create Template
**Purpose:** Save benefit configuration as template  
**Components:**
- Template name field
- Description
- Save from existing product
- Template visibility (private/shared)
**Key Actions:** Save template, cancel

#### PD-033: Compliance Library
**Purpose:** Pre-configured compliant benefits  
**Components:**
- ACA minimum essential coverage
- State-mandated benefits
- Medicare Advantage requirements
**Key Actions:** View requirements, apply

#### PD-034: Market Benchmarks
**Purpose:** View competitor benefit designs  
**Components:**
- Benchmark data table (by LOB, market, state)
- Cost-sharing comparison
- Coverage comparison
**Key Actions:** View benchmarks, compare

#### PD-035: Best Practices Library
**Purpose:** Benefit design recommendations  
**Components:**
- Recommended configurations
- Cost optimization tips
- Member satisfaction data
**Key Actions:** View recommendations, apply

---

### 3.6 Product Documentation (5 screens)

#### PD-036: Document Manager
**Purpose:** Manage product documents  
**Components:**
- Documents list (SBC, EOC, marketing materials)
- Upload document button
- Generate document button
**Key Actions:** Upload, generate, download

#### PD-037: Generate Summary of Benefits & Coverage (SBC)
**Purpose:** Auto-generate ACA-compliant SBC  
**Components:**
- Template selector
- Product selector
- Preview SBC
**Key Actions:** Generate, download, edit

#### PD-038: Generate Evidence of Coverage (EOC)
**Purpose:** Auto-generate EOC document  
**Components:**
- Template selector
- Sections checklist
- Preview EOC
**Key Actions:** Generate, download, customize

#### PD-039: Marketing Materials Generator
**Purpose:** Create marketing collateral  
**Components:**
- Material type selector (brochure, flyer, web)
- Branding options
- Preview
**Key Actions:** Generate, download

#### PD-040: Document Version Control
**Purpose:** Track document versions  
**Components:**
- Version history
- Compare versions
- Restore version
**Key Actions:** View versions, compare, restore

---

### 3.7 Product Management (5 screens)

#### PD-041: Product Search
**Purpose:** Advanced product search  
**Components:**
- Multi-field search form
- Saved searches
- Search results
**Key Actions:** Search, save search

#### PD-042: Product Tags Manager
**Purpose:** Organize products with tags  
**Components:**
- Tags list
- Create tag form
- Apply tags to products
**Key Actions:** Create tag, apply, filter

#### PD-043: Product Hierarchy Viewer
**Purpose:** View product relationships  
**Components:**
- Hierarchy tree (master → regional → employer)
- Visual diagram
**Key Actions:** Navigate hierarchy, edit

#### PD-044: Product Duplication Wizard
**Purpose:** Copy existing product  
**Components:**
- Source product selector
- New product name
- What to copy checklist (benefits, rates, etc.)
**Key Actions:** Duplicate, customize, save

#### PD-045: Product Retirement Wizard
**Purpose:** Retire product gracefully  
**Components:**
- Retirement date picker
- Member migration plan
- Replacement product selector
**Key Actions:** Schedule retirement, notify members

---

## 4. RATING & COMPLIANCE WORKBENCH

**User Role:** Actuarial Analyst, Compliance Officer  
**Purpose:** Rate products and ensure regulatory compliance  
**Total Screens:** 30

### 4.1 Rating Configuration (8 screens)

#### RC-001: Rating Dashboard
**Purpose:** Overview of rating configurations  
**Components:**
- Rate tables summary
- Recent rate changes
- Rating factors summary
**Key Actions:** Configure rates, view tables

#### RC-002: Rating Factors Configuration
**Purpose:** Configure all rating factors  
**Components:**
- Factor categories (Age, Gender, Geography, Tobacco)
- Factor values table
- Effective dates
**Key Actions:** Edit factors, save

#### RC-003: Age Rating Curve Builder
**Purpose:** Define age-based rating  
**Components:**
- Age curve graph (interactive)
- Age bands table
- Ratio to base age
- ACA compliance indicator
**Key Actions:** Edit curve, validate, save

#### RC-004: Geographic Rating Configurator
**Purpose:** Define area factors  
**Components:**
- State/county selector
- Geographic area groups
- Area factors table
- Map visualization
**Key Actions:** Create areas, set factors

#### RC-005: Tobacco Rating
**Purpose:** Configure tobacco surcharge  
**Components:**
- Tobacco multiplier field
- State-specific overrides
- Effective dates
**Key Actions:** Set multiplier, save

#### RC-006: Rate Table Manager
**Purpose:** Manage all rate tables  
**Components:**
- Rate tables list (product, effective date)
- Create rate table button
- Import/export functionality
**Key Actions:** Create, edit, import, export

#### RC-007: Create Rate Table
**Purpose:** Build new rate table  
**Components:**
- Product selector
- Plan selector
- Rating methodology selector
- Rate input grid (age × area)
**Key Actions:** Input rates, calculate, save

#### RC-008: Rate Table Comparison
**Purpose:** Compare rate tables  
**Components:**
- Table selector (up to 3 tables)
- Side-by-side rate comparison
- Difference highlighting
- Change percentage display
**Key Actions:** Select tables, compare, export

---

### 4.2 Actuarial Modeling (7 screens)

#### RC-009: Actuarial Modeling Dashboard
**Purpose:** Cost projection overview  
**Components:**
- Financial summary cards (premium, claims, MLR)
- Projection charts
- Model inputs summary
**Key Actions:** Run model, view results

#### RC-010: Create Actuarial Model
**Purpose:** Configure cost model  
**Components:**
- Model name and description
- Input assumptions (trend, utilization, unit cost)
- Member projection
- Experience data selector
**Key Actions:** Configure inputs, run model

#### RC-011: Model Results Viewer
**Purpose:** Display model outputs  
**Components:**
- Financial summary table (premium, claims, expenses, profit)
- MLR calculation
- Trend analysis charts
- Sensitivity analysis
**Key Actions:** Export results, adjust inputs

#### RC-012: Premium Calculator
**Purpose:** Calculate individual premium  
**Components:**
- Product selector
- Member details (age, zip, tobacco)
- Premium display (by coverage level)
**Key Actions:** Calculate, recalculate

#### RC-013: Experience Data Analyzer
**Purpose:** Analyze historical claims  
**Components:**
- Experience period selector
- Claims summary statistics
- Trend analysis charts
- Outlier detection
**Key Actions:** Analyze, export, use in model

#### RC-014: Financial Projection Builder
**Purpose:** Multi-year financial projections  
**Components:**
- Projection period selector (1-5 years)
- Assumptions by year
- Projected financial statements
**Key Actions:** Build projection, save, export

#### RC-015: Profitability Analysis
**Purpose:** Product profitability insights  
**Components:**
- Profit by product table
- Profit drivers breakdown
- Target vs actual comparison
**Key Actions:** View details, drill down

---

### 4.3 Scenario Testing (5 screens)

#### RC-016: Scenario Testing Dashboard
**Purpose:** Manage test scenarios  
**Components:**
- Saved scenarios list
- Recent test results
- Quick create scenario button
**Key Actions:** Create scenario, run, view results

#### RC-017: Create Scenario Wizard
**Purpose:** Define what-if scenario  
**Components:**
- Scenario name and description
- Base product selector
- Changes form (rates, benefits, assumptions)
**Key Actions:** Configure, save, run

#### RC-018: Scenario Comparison
**Purpose:** Compare scenario results  
**Components:**
- Scenario selector (up to 4 scenarios)
- Side-by-side financial comparison
- Difference highlighting
- Recommendation indicator
**Key Actions:** Select scenarios, compare, export

#### RC-019: Sensitivity Analysis
**Purpose:** Test assumption variations  
**Components:**
- Variable selector (trend, utilization, etc.)
- Range slider (±X%)
- Tornado chart visualization
**Key Actions:** Adjust variables, run analysis

#### RC-020: Scenario Results Archive
**Purpose:** Historical scenario results  
**Components:**
- Results history table
- Filters (date, scenario type)
- View details button
**Key Actions:** View past results, export

---

### 4.4 Compliance Management (10 screens)

#### RC-021: Compliance Dashboard
**Purpose:** Compliance status overview  
**Components:**
- Compliance score card
- Violations summary (critical, warning, info)
- Recent validations
- Upcoming filing deadlines
**Key Actions:** Run validation, view violations

#### RC-022: Run Compliance Validation
**Purpose:** Execute compliance checks  
**Components:**
- Validation scope selector (product, plan, all)
- Rule set selector (ACA, state, Medicare)
- Run button
**Key Actions:** Configure, run validation

#### RC-023: Compliance Results Viewer
**Purpose:** Display validation findings  
**Components:**
- Results table (violation, severity, product, recommendation)
- Filter by severity
- Auto-fix button (where applicable)
**Key Actions:** View details, auto-fix, export

#### RC-024: Violation Detail View
**Purpose:** Detailed violation information  
**Components:**
- Violation description
- Affected products
- Regulatory citation
- Suggested fix
- Manual fix form
**Key Actions:** View citation, fix manually, resolve

#### RC-025: Compliance Rules Library
**Purpose:** Manage compliance rules  
**Components:**
- Rules list (Federal, State, LOB-specific)
- Rule details (criteria, severity)
- Enable/disable toggle
**Key Actions:** View rules, enable/disable, edit

#### RC-026: ACA Compliance Checker
**Purpose:** ACA-specific validation  
**Components:**
- ACA requirements checklist
- Essential Health Benefits check
- Actuarial value calculator
- Out-of-pocket limits check
**Key Actions:** Validate, view details

#### RC-027: State Compliance Checker
**Purpose:** State-specific regulations  
**Components:**
- State selector
- State requirements list
- Mandate compliance status
**Key Actions:** Select state, validate

#### RC-028: Medicare Advantage Compliance
**Purpose:** CMS requirements validation  
**Components:**
- CMS requirements checklist
- Bid validation
- Star ratings alignment
**Key Actions:** Validate, view requirements

#### RC-029: Compliance Reports Generator
**Purpose:** Create compliance reports  
**Components:**
- Report type selector
- Date range
- Products selector
- Generate button
**Key Actions:** Configure, generate, download

#### RC-030: Filing Deadlines Calendar
**Purpose:** Track regulatory filings  
**Components:**
- Calendar view (monthly/yearly)
- Filing deadline alerts
- Submission status tracking
**Key Actions:** View calendar, add deadline

---

## 5. PUBLISHING & ANALYTICS DASHBOARD

**User Role:** Publishing Manager, Analyst, Executive  
**Purpose:** Publish products and monitor performance  
**Total Screens:** 25

### 5.1 Publishing Management (8 screens)

#### PA-001: Publishing Dashboard
**Purpose:** Publication status overview  
**Components:**
- Products by publication status
- Recent publications
- Pending approvals
- Channel status
**Key Actions:** Publish product, view status

#### PA-002: Publish Product Wizard - Step 1 (Select Product)
**Purpose:** Choose product to publish  
**Components:**
- Product selector
- Product status check
- Compliance validation status
**Key Actions:** Select product, next

#### PA-003: Publish Product Wizard - Step 2 (Select Channels)
**Purpose:** Choose publication channels  
**Components:**
- Channel checkboxes (CMS, Healthcare.gov, State Exchange, Internal, Broker Portal)
- Channel requirements display
- Prerequisites check
**Key Actions:** Select channels, next

#### PA-004: Publish Product Wizard - Step 3 (Generate Documents)
**Purpose:** Create required documents  
**Components:**
- Document checklist (SBC, EOC, Rate Filing)
- Auto-generate buttons
- Document preview
**Key Actions:** Generate, preview, next

#### PA-005: Publish Product Wizard - Step 4 (Review & Publish)
**Purpose:** Final review before publishing  
**Components:**
- Publication summary
- All information review
- Publish confirmation
**Key Actions:** Back, publish, cancel

#### PA-006: Publication Status Tracker
**Purpose:** Monitor publication progress  
**Components:**
- Publications list (product, channels, status)
- Status indicators (pending, in progress, published, failed)
- Error log
**Key Actions:** View details, retry, cancel

#### PA-007: Channel Configuration
**Purpose:** Configure publication channels  
**Components:**
- Channels list (name, type, status)
- Channel settings (API keys, URLs)
- Test connection button
**Key Actions:** Add channel, configure, test

#### PA-008: Publication History
**Purpose:** Historical publications  
**Components:**
- Publications archive table
- Filters (date, product, channel)
- Republish button
**Key Actions:** View history, republish

---

### 5.2 SERFF Filing (4 screens)

#### PA-009: SERFF Filing Dashboard
**Purpose:** SERFF submissions overview  
**Components:**
- Filings by state chart
- Filing status summary
- Upcoming deadlines
**Key Actions:** Create filing, view filings

#### PA-010: Create SERFF Filing
**Purpose:** Generate SERFF submission  
**Components:**
- State selector
- Filing type selector (Rate, Form, Product)
- Product/rate selector
- Filing details form
**Key Actions:** Generate filing, upload to SERFF

#### PA-011: SERFF Filing Detail
**Purpose:** View filing information  
**Components:**
- Filing metadata
- Submission status
- Objection letters (if any)
- Response history
**Key Actions:** View status, respond to objections

#### PA-012: SERFF Rate Filing Generator
**Purpose:** Create actuarial memorandum  
**Components:**
- Product selector
- Experience data summary
- Rate development summary
- Supporting exhibits
**Key Actions:** Generate memo, preview, download

---

### 5.3 Executive Dashboard (5 screens)

#### PA-013: Executive Dashboard
**Purpose:** High-level business metrics  
**Components:**
- Key metrics cards (enrollment, revenue, MLR, profit)
- Enrollment trends chart
- Financial performance chart
- Product mix chart
- Alerts/notifications
**Key Actions:** View details, drill down, export

#### PA-014: Enrollment Dashboard
**Purpose:** Enrollment analytics  
**Components:**
- Total enrollment by product
- New vs disenrollments
- Enrollment trends
- Geographic distribution map
**Key Actions:** View details, filter dates

#### PA-015: Financial Dashboard
**Purpose:** Financial performance  
**Components:**
- Premium revenue by product
- Claims costs
- MLR by product
- Profit/loss statement
**Key Actions:** View details, drill down

#### PA-016: Product Performance Dashboard
**Purpose:** Individual product analytics  
**Components:**
- Product selector
- Product tabs (Enrollment, Financial, Utilization, Satisfaction)
- Performance charts
**Key Actions:** Select product, view tabs, export

#### PA-017: KPI Dashboard
**Purpose:** Custom KPI tracking  
**Components:**
- KPI cards (configurable)
- Targets vs actuals
- Trend indicators
**Key Actions:** Configure KPIs, view trends

---

### 5.4 Product Performance Analytics (4 screens)

#### PA-018: Product Enrollment Analysis
**Purpose:** Deep-dive enrollment analytics  
**Components:**
- Enrollment by product table
- Trend analysis
- Demographic breakdown
- Market share comparison
**Key Actions:** View details, export, filter

#### PA-019: Financial Performance Analysis
**Purpose:** Product profitability analysis  
**Components:**
- Premium vs claims table
- MLR analysis
- Profit margin trends
- Cost drivers breakdown
**Key Actions:** Drill down, export

#### PA-020: Utilization Analysis
**Purpose:** Service utilization patterns  
**Components:**
- Utilization by service category
- High-cost claimants
- Frequency vs severity analysis
**Key Actions:** View patterns, export

#### PA-021: Member Satisfaction Analysis
**Purpose:** Product satisfaction metrics  
**Components:**
- NPS scores by product
- Satisfaction drivers
- Complaint analysis
- Retention rates
**Key Actions:** View details, export

---

### 5.5 AI Recommendations (Future) (4 screens)

#### PA-022: AI Recommendations Dashboard
**Purpose:** AI-driven insights  
**Components:**
- Recommendations cards (cost reduction, growth, retention)
- Priority sorting
- Savings potential
**Key Actions:** View recommendation, apply, dismiss

#### PA-023: Cost Reduction Recommendations
**Purpose:** Identify savings opportunities  
**Components:**
- Recommendations list
- Estimated savings
- Implementation difficulty
- Apply button
**Key Actions:** View details, apply

#### PA-024: Growth Opportunities
**Purpose:** Market expansion recommendations  
**Components:**
- Opportunity cards
- Market analysis
- Competitive positioning
**Key Actions:** View details, explore

#### PA-025: Competitive Intelligence
**Purpose:** Competitor tracking  
**Components:**
- Competitor product comparison
- Market share trends
- Pricing comparison
**Key Actions:** View competitors, compare

---

## 6. SHARED/COMMON SCREENS

**Screens used across multiple applications**  
**Total Screens:** 10

### SC-001: Global Dashboard (Home)
**Purpose:** Universal landing page after login  
**Components:**
- Welcome message
- Recent activity feed
- Quick actions by role
- Notifications summary
**Key Actions:** Navigate to apps

### SC-002: Universal Search Results
**Purpose:** Display global search results  
**Components:**
- Results grouped by entity type
- Relevance scoring
- Filters
**Key Actions:** View result, refine search

### SC-003: User Profile
**Purpose:** User account management  
**Components:**
- Profile information form
- Change password
- Notification preferences
- Security settings (MFA)
**Key Actions:** Update profile, change password

### SC-004: Notifications Center
**Purpose:** View all notifications  
**Components:**
- Notifications list (unread/read)
- Filter by type
- Mark as read button
**Key Actions:** View notification, mark read, clear

### SC-005: Help Center
**Purpose:** Documentation and support  
**Components:**
- Search documentation
- Video tutorials
- FAQ
- Contact support
**Key Actions:** Search, watch videos, contact

### SC-006: What's New / Release Notes
**Purpose:** Product updates and new features  
**Components:**
- Release notes list
- Feature highlights
- Known issues
**Key Actions:** View details, dismiss

### SC-007: Feedback Form
**Purpose:** Submit feedback or bug reports  
**Components:**
- Feedback type selector (bug, feature request, feedback)
- Description text area
- Screenshot upload
**Key Actions:** Submit, cancel

### SC-008: Settings
**Purpose:** User-specific settings  
**Components:**
- General preferences (timezone, language, date format)
- Notification preferences
- Default views
**Key Actions:** Update settings, save

### SC-009: My Tasks / To-Do List
**Purpose:** Personal task management  
**Components:**
- Tasks list (assigned to me)
- Due dates
- Priority indicators
- Complete button
**Key Actions:** View task, complete, add task

### SC-010: Keyboard Shortcuts Reference
**Purpose:** Show all keyboard shortcuts  
**Components:**
- Shortcuts table (key combination, action)
- Searchable
**Key Actions:** View shortcuts, close

---

## 7. MOBILE APP SCREENS (Future Phase)

**Platform:** iOS and Android  
**Purpose:** Field access for brokers and agents  
**Total Screens:** 15 (Simplified subset of web)

### Mobile - Authentication (2 screens)
- M-001: Login Screen
- M-002: Biometric Authentication

### Mobile - Home (2 screens)
- M-003: Mobile Dashboard
- M-004: Quick Actions Menu

### Mobile - Products (4 screens)
- M-005: Products List (Mobile)
- M-006: Product Detail (Mobile)
- M-007: Product Search (Mobile)
- M-008: Product Comparison (Mobile)

### Mobile - Premium Calculator (2 screens)
- M-009: Quick Premium Calculator
- M-010: Premium Results Display

### Mobile - Documents (2 screens)
- M-011: Documents Library (Mobile)
- M-012: Document Viewer (PDF)

### Mobile - Support (3 screens)
- M-013: Help & Support
- M-014: Contact Support
- M-015: My Profile (Mobile)

---

## SUMMARY STATISTICS

### Total Screen Count by Application

| Application | Screens | Complexity |
|-------------|---------|------------|
| Platform Admin Console | 20 | Medium |
| Code Management Studio | 40 | High |
| Product Design Studio | 45 | Very High |
| Rating & Compliance | 30 | High |
| Publishing & Analytics | 25 | Medium |
| Shared/Common | 10 | Low |
| Mobile (Future) | 15 | Medium |
| **TOTAL** | **185** | - |

### Screen Complexity Distribution

- **Simple** (Forms, Lists): 70 screens (38%)
- **Medium** (Tables with filters, Dashboards): 65 screens (35%)
- **Complex** (Wizards, Visual Builders): 35 screens (19%)
- **Very Complex** (Canvas Designer, Real-time): 15 screens (8%)

### Priority for Phase 1 (MVP)

#### Must Build First (Week 1-6) - 30 screens
1. Platform Admin - User Management (5 screens)
2. Code Library Browser (8 screens)
3. Product Catalog Basic (8 screens)
4. Basic Benefit Configuration (6 screens)
5. Shared/Common (3 screens)

#### Build Second (Week 7-12) - 40 screens
1. Code Mapping Tools (10 screens)
2. Product Design Studio (15 screens)
3. Benefit Design Canvas (10 screens)
4. Rating Basic (5 screens)

#### Build Third (Week 13-20) - 50 screens
1. Full Rating & Compliance (20 screens)
2. Publishing Workflow (10 screens)
3. Analytics & Dashboards (15 screens)
4. Advanced Features (5 screens)

---

## UI COMPONENT LIBRARY NEEDED

To build these 185 screens efficiently, you'll need:

### Core Components (40 components)
- Buttons (5 variants)
- Form inputs (15 types)
- Tables (3 variants)
- Cards (5 variants)
- Modals/Dialogs (4 types)
- Tabs
- Breadcrumbs
- Badges
- Tooltips
- Dropdowns/Selects
- Date pickers
- File uploaders

### Complex Components (10 components)
- Data tables (sortable, filterable, paginated)
- Charts (line, bar, pie, donut, area)
- Drag-and-drop canvas
- Code editor
- Rich text editor
- Tree view
- Timeline
- Stepper (wizard progress)
- Calendar
- Map visualization

### Layout Components (5 components)
- Top navigation bar
- Left sidebar navigation
- Breadcrumb trail
- Footer
- 3-panel layout (Design Studio)

---

## DEVELOPMENT RECOMMENDATIONS

### Build Order Strategy

**Phase 1: Foundation (Weeks 1-6)**
- Build component library first
- Implement 30 core screens
- Focus on CRUD operations
- Get feedback early

**Phase 2: Workflows (Weeks 7-12)**
- Build wizards and multi-step forms
- Implement code mapping tools
- Add benefit design studio
- User testing

**Phase 3: Advanced (Weeks 13-20)**
- Build canvas designer
- Implement rating engine
- Add analytics dashboards
- Polish and optimize

### Design System Recommendations

**Use existing component library:**
- Material-UI (MUI) - Comprehensive, well-maintained
- Ant Design - Great for enterprise apps
- Tailwind UI - Modern, customizable

**Or build custom with:**
- Headless UI (accessible components)
- Tailwind CSS (styling)
- React Hook Form (forms)
- Recharts (charts)

---

## QUESTIONS TO CONSIDER

1. **Complexity:** Is this too many screens? Can we consolidate?
2. **Mobile:** Should mobile be part of Phase 1 or defer?
3. **Wizards:** Multi-step wizards vs single-page forms?
4. **Canvas:** Build custom canvas designer or use existing library?
5. **Dashboards:** How many custom dashboards do executives need?

---

**This inventory gives you a complete picture of the UI scope. Each screen has a clear purpose and can be estimated for development time.**

**Next Steps:**
1. Prioritize which screens to build first
2. Create wireframes for top 20 screens
3. Build component library
4. Start with simplest screens (lists, forms)
5. Progressively add complexity

Would you like me to:
- Create wireframes for specific screens?
- Build a detailed component library specification?
- Estimate development time for each screen?
- Create a phased build plan?
