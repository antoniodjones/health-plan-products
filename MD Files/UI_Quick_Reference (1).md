# UI/UX QUICK REFERENCE
## Products & Benefits Platform

**Date:** November 3, 2025  
**Purpose:** Quick visual reference for UI structure

---

## 5 MAIN APPLICATIONS

### 1️⃣ PLATFORM ADMIN CONSOLE
**Users:** IT Administrators  
**Purpose:** System configuration and user management

**Main Sections:**
- Dashboard (system health)
- User Management (users, roles, permissions)
- Organization Settings (company, LOB, service areas)
- Integrations (CMS, exchanges, APIs)
- System Configuration (settings, security)
- Monitoring (logs, metrics)

**~20 screens total**

---

### 2️⃣ CODE MANAGEMENT STUDIO
**Users:** Code Managers, Data Analysts  
**Purpose:** Manage billing codes and mappings  
**Epics:** 1, 2, 3, 4, 5

**Main Sections:**
- 📚 **Code Libraries** (Browse CPT, ICD-10, NDC, etc.)
- 🗂️ **Code Set Management** (Import, update, analytics)
- 🔗 **Code Mappings** (Map codes to benefits)
- ✅ **Validation & Testing** (Test mappings)
- 🎨 **Custom Codes** (Create proprietary codes)

**Key Workflows:**
1. Import codes from CMS
2. Browse/search code libraries
3. Create code-to-benefit mappings
4. Validate mappings
5. Create custom codes

**~40 screens total**

---

### 3️⃣ PRODUCT DESIGN STUDIO
**Users:** Product Managers, Benefit Designers  
**Purpose:** Create products and design benefits  
**Epics:** 6, 7, 8

**Main Sections:**
- 📦 **Product Catalog** (Create, manage products)
- 🎨 **Benefit Design Studio** (Visual benefit builder)
- 📋 **Templates** (Pre-built templates, import/export)
- 📊 **Product Management** (Lifecycle, approvals)

**Key Workflows:**
1. Create new product (wizard)
2. Design benefits visually (drag-and-drop)
3. Use templates to accelerate
4. Import products from Excel
5. Manage product lifecycle (draft → active)

**Star Screens:**
- **Product List:** Table of all products
- **Product Detail:** Tabs (overview, plans, benefits, docs)
- **Design Canvas:** Visual benefit builder (3-panel layout)
- **Template Library:** Browse and use templates

**~45 screens total**

---

### 4️⃣ RATING & COMPLIANCE WORKBENCH
**Users:** Actuaries, Compliance Officers  
**Purpose:** Calculate rates and validate compliance  
**Epics:** 9, 10

**Main Sections:**
- 💰 **Rating Engine** (Configure rates, calculate premiums)
- 📊 **Actuarial Modeling** (Cost projections, scenarios)
- 🧪 **Scenario Testing** (What-if analysis, Monte Carlo)
- 🏆 **Competitive Analysis** (Compare to competitors)
- ✅ **Compliance** (Run checks, view results, apply fixes)
- 📑 **Rule Library** (Federal, state, Medicare/Medicaid rules)

**Key Workflows:**
1. Configure rating factors (age, geography)
2. Calculate premium for a product
3. Run actuarial scenarios (what-if)
4. Run compliance validation
5. Fix compliance issues (auto-fix or manual)
6. Generate rate filing documentation

**Star Screens:**
- **Rate Calculator:** Simple form to calculate premium
- **Actuarial Modeling:** Cost projections and financial modeling
- **Scenario Testing:** What-if analysis and comparison
- **Compliance Results:** Issues list with auto-fix options

**~30 screens total**

---

### 5️⃣ PUBLISHING & ANALYTICS DASHBOARD
**Users:** Publishing Managers, Analysts, Executives  
**Purpose:** Publish products and monitor performance  
**Epics:** 11, 12

**Main Sections:**
- 🚀 **Publishing** (Publish to channels, generate docs)
- 📄 **SERFF Filing** (Generate and upload filings)
- 📊 **Executive Dashboard** (Key metrics, trends)
- 📈 **Product Performance** (Enrollment, financial, utilization)
- 💡 **AI Recommendations** (Cost reduction, growth opportunities)
- 🏆 **Competitive Intelligence** (Track competitors)
- 📑 **Reports** (Standard and custom reports)

**Key Workflows:**
1. Publish product (one-click to all channels)
2. Generate marketing materials (SBC, EOC)
3. Create SERFF filing
4. Monitor product performance
5. View executive dashboard
6. Run custom reports

**Star Screens:**
- **Executive Dashboard:** Cards + charts (enrollment, MLR, profit)
- **Publish Wizard:** Select channels, generate docs, publish
- **Product Performance:** Tabs (enrollment, financial, utilization)
- **AI Recommendations:** Cards with savings opportunities

**~25 screens total**

---

## NAVIGATION PATTERN

### Global Top Bar (All Apps)
```
[Logo] [App Switcher ▼] | [Search] | [🔔] [?] [User ▼]
```

**App Switcher Dropdown:**
1. Platform Admin Console
2. Code Management Studio
3. Product Design Studio
4. Rating & Compliance Workbench
5. Publishing & Analytics Dashboard

### Left Sidebar (Within Each App)
- Collapsible menu
- Icons + labels
- Active section highlighted
- Example (Product Design Studio):
  ```
  🏠 Dashboard
  📦 Product Catalog
  🎨 Benefit Design Studio
  📋 Templates
  📊 Product Management
  ```

---

## KEY SCREEN TYPES

### 1. List/Table Views
**Purpose:** Browse and search entities (products, codes, etc.)

**Components:**
- Table with sortable columns
- Filters (left sidebar or top)
- Search bar
- Bulk actions (when rows selected)
- Pagination (bottom)
- Actions column (right): View, Edit, Delete icons

**Examples:**
- Products List
- Code Library
- Mappings Library
- Compliance Results

---

### 2. Detail/Edit Views
**Purpose:** View and edit entity details

**Layout:** 
- Tabs (Overview, Plans, Benefits, Documents, History)
- Or: Form with sections

**Components:**
- Header (entity name, status badge, actions)
- Content area (tabs or sections)
- Save/Cancel buttons (sticky footer)

**Examples:**
- Product Detail
- Code Detail
- User Profile

---

### 3. Wizards (Multi-Step Forms)
**Purpose:** Guide users through complex workflows

**Layout:**
- Steps indicator (top)
- Step content (center)
- Back/Next/Cancel buttons (bottom)

**Components:**
- Progress indicator (1 of 4)
- Form fields (per step)
- Validation (per step)
- Summary (final step)

**Examples:**
- Create Product Wizard
- Import Codes Wizard
- Publish Product Wizard
- Run Validation Wizard

---

### 4. Visual Builders/Designers
**Purpose:** Drag-and-drop configuration

**Layout:** 3-panel
- Left: Component library (sidebar)
- Center: Canvas (main)
- Right: Configuration/preview (sidebar)

**Components:**
- Draggable components
- Drop zones
- Configuration forms (when component selected)
- Real-time preview

**Examples:**
- Benefit Design Studio (Canvas)

---

### 5. Dashboards
**Purpose:** At-a-glance metrics and trends

**Layout:**
- Cards (top row - key metrics)
- Charts (2-3 columns)
- Tables (bottom - details)

**Components:**
- Metric cards (value, change indicator, sparkline)
- Charts (line, bar, pie, donut)
- Quick action buttons
- Filters/date range selector

**Examples:**
- Executive Dashboard
- Publishing Dashboard
- Compliance Dashboard

---

### 6. Reports/Results Views
**Purpose:** Display analysis results

**Layout:**
- Summary (top)
- Detailed results (table or cards)
- Actions (export, save, share)

**Components:**
- Summary stats
- Results table or list
- Filters
- Export buttons (PDF, Excel)

**Examples:**
- Validation Results
- Compliance Results
- Scenario Comparison
- Product Performance Report

---

## UI vs. API SEPARATION

### ✅ WHAT THIS DOCUMENT COVERS (UI LAYER)
- Screen layouts
- Navigation structure
- User workflows
- Form fields
- Button labels
- Tables and charts
- Modals and dialogs
- User interactions

### ❌ WHAT THIS DOCUMENT DOESN'T COVER (API LAYER)
- Backend services
- Database schemas
- API endpoints
- Authentication/authorization
- Business logic
- Data validation (backend)
- Integrations
- Infrastructure

**Note:** APIs will be defined in separate technical specifications per epic.

---

## DESIGN SYSTEM NEEDED

### Components to Build:
- ✅ Buttons (primary, secondary, destructive)
- ✅ Forms (text, number, dropdown, checkbox, radio, date)
- ✅ Tables (sortable, filterable, paginated)
- ✅ Cards (metric, summary, action)
- ✅ Charts (line, bar, pie, donut)
- ✅ Modals (dialog, form, full-screen)
- ✅ Toasts/Notifications
- ✅ Tabs
- ✅ Breadcrumbs
- ✅ Badges (status indicators)
- ✅ Progress indicators (spinner, bar, stepper)
- ✅ Drag-and-drop (components, reorder)

### Style Decisions Needed:
- Primary color (brand)
- Secondary colors
- Success/Error/Warning colors
- Font family
- Font sizes (H1-H6, body, small)
- Spacing scale (4px, 8px, 16px, 24px, 32px)
- Border radius (0, 4px, 8px, 16px)
- Shadows (elevation)

---

## ESTIMATED SCREEN COUNT

| Application | Screens | Epic Alignment |
|-------------|---------|----------------|
| Platform Admin Console | ~20 | Foundation |
| Code Management Studio | ~40 | Epics 1-5 |
| Product Design Studio | ~45 | Epics 6-8 |
| Rating & Compliance | ~30 | Epics 9-10 |
| Publishing & Analytics | ~25 | Epics 11-12 |
| **TOTAL** | **~160** | **All Epics** |

---

## DEVELOPMENT PHASES

### Phase 1: Foundation UI (Epics 1-5)
**Build:**
- Platform Admin Console (basic setup)
- Code Management Studio (all screens)

**Screens:** ~60 screens

---

### Phase 2: Product Management UI (Epics 6-8)
**Build:**
- Product Design Studio (all screens)
- Benefit Design Canvas (3-panel visual builder)
- Template library

**Screens:** ~45 screens

---

### Phase 3: Rating & Compliance UI (Epics 9-10)
**Build:**
- Rating & Compliance Workbench (all screens)
- Rate calculator
- Scenario testing
- Compliance validation

**Screens:** ~30 screens

---

### Phase 4: Publishing & Analytics UI (Epics 11-12)
**Build:**
- Publishing & Analytics Dashboard (all screens)
- Publishing wizard
- Executive dashboard
- Performance analytics

**Screens:** ~25 screens

---

## QUICK START: 10 Priority Screens

If you need to prioritize, build these 10 screens first:

1. **Platform Admin - User Management** (manage users)
2. **Code Library - Browse View** (browse CPT codes)
3. **Create Code Mapping** (map code to benefit)
4. **Product List** (table of products)
5. **Create Product Wizard** (create new product)
6. **Benefit Design Canvas** (visual benefit builder) ⭐
7. **Rate Calculator** (calculate premium)
8. **Compliance Results** (validation results)
9. **Publish Wizard** (publish product)
10. **Executive Dashboard** (key metrics)

---

## NEXT STEPS

**Option A: Design System First**
1. Define color palette
2. Create component library
3. Build design tokens (CSS variables)
4. Document patterns

**Option B: Wireframes First**
1. Create wireframes for 10 priority screens
2. Get feedback
3. Iterate
4. Build design system from wireframes

**Option C: Prototype First**
1. Build clickable prototype (Figma or code)
2. User testing
3. Refine based on feedback
4. Then build for real

**My Recommendation:** Option A (Design System First) for consistency, then Option B (Wireframes) for validation.

---

## QUESTIONS?

Let me know if you need:
- ✅ Wireframes for specific screens
- ✅ Design system (colors, typography)
- ✅ More detailed screen layouts
- ✅ User workflow diagrams
- ✅ Component specifications
- ✅ Anything else!

**Is this clearer?** 🎯
