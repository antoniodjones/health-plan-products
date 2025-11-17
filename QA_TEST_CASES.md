# QA Test Cases - Interactive Elements

## Overview
Test all buttons, components, modals, and forms across the application to ensure functionality before seeding additional data.

---

## 🧪 Test Environment
- **URL:** http://localhost:3000
- **Browser:** Chrome/Safari/Firefox
- **User:** Admin (no auth required currently)

---

# 1. DASHBOARD PAGE (`/dashboard`)

## 1.1 Navigation & Layout
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| D-001 | Left sidebar visible | Navigate to /dashboard | Sidebar shows all menu items | ⬜ |
| D-002 | Dashboard is active | Check sidebar | "Dashboard" is highlighted | ⬜ |
| D-003 | Page header displays | Check top of page | "Dashboard" title visible | ⬜ |

## 1.2 Buttons
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| D-004 | Export Report button | Click "Export Report" | Action occurs or shows "not implemented" | ⬜ |
| D-005 | Quick Action button | Click "Quick Action" | Action occurs or shows "not implemented" | ⬜ |
| D-006 | View All (Alerts) | Click "View All" in Alerts section | Navigates or shows modal | ⬜ |
| D-007 | View All (Activity) | Click "View All" in Activity section | Navigates or shows modal | ⬜ |
| D-008 | Review Codes button | Click "Review Codes" in alert | Navigates to codes page | ⬜ |
| D-009 | Improve Coverage button | Click "Improve Coverage" | Action occurs | ⬜ |
| D-010 | Review Suggestions button | Click "Review Suggestions" | Action occurs | ⬜ |

## 1.3 Quick Action Cards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| D-011 | Create Product card | Click "Create Product" card | Navigates or opens modal | ⬜ |
| D-012 | Import Codes card | Click "Import Codes" card | Navigates or opens modal | ⬜ |
| D-013 | Create Mapping card | Click "Create Mapping" card | Navigates or opens modal | ⬜ |
| D-014 | View Analytics card | Click "View Analytics" card | Navigates to analytics page | ⬜ |

## 1.4 Recent Activity
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| D-015 | Activity item click | Click arrow icon on any activity | Navigates to detail view | ⬜ |

---

# 2. CODE LIBRARY PAGE (`/codes`)

## 2.1 Statistics Cards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| C-001 | Total Codes displays | Navigate to /codes | Shows "58" | ✅ |
| C-002 | Active Codes displays | Check Active card | Shows "58" | ✅ |
| C-003 | Inactive Codes displays | Check Inactive card | Shows "0" | ✅ |
| C-004 | Code Types displays | Check Code Types card | Shows "3" | ✅ |

## 2.2 Search Functionality
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| C-005 | Search input visible | Check search bar | Input field with placeholder visible | ⬜ |
| C-006 | Search by code | Type "83036" in search | Filters to matching codes | ⬜ |
| C-007 | Search by description | Type "hemoglobin" in search | Filters to matching codes | ⬜ |
| C-008 | Clear search | Clear search input | Shows all codes again | ⬜ |
| C-009 | Search debounce | Type quickly | Waits 300ms before searching | ⬜ |

## 2.3 Buttons
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| C-010 | Refresh button | Click "Refresh" button | Reloads code list | ⬜ |
| C-011 | Previous page button | Click "Previous" on page 2 | Goes to page 1 | ⬜ |
| C-012 | Next page button | Click "Next" on page 1 | Goes to page 2 | ⬜ |
| C-013 | Previous disabled | On page 1, check "Previous" | Button is disabled | ⬜ |
| C-014 | Next disabled | On last page, check "Next" | Button is disabled | ⬜ |

## 2.4 Table Display
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| C-015 | Table headers visible | Check table | Shows Code, Type, Description, Category, Status | ⬜ |
| C-016 | Code values display | Check first row | Code displays in monospace font | ⬜ |
| C-017 | Type badge displays | Check Type column | Shows badge (CPT, HCPCS, etc.) | ⬜ |
| C-018 | Status badge displays | Check Status column | Shows green "Active" or red "Inactive" | ⬜ |
| C-019 | Row hover effect | Hover over row | Row background changes | ⬜ |
| C-020 | Pagination info | Check bottom of table | Shows "Page X of Y" | ⬜ |

## 2.5 Loading States
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| C-021 | Initial loading | Refresh page | Shows spinner with "Loading codes..." | ⬜ |
| C-022 | Search loading | Type in search | Brief loading state | ⬜ |

## 2.6 Empty States
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| C-023 | No results found | Search for "ZZZZZ" | Shows "No Codes Found" message | ⬜ |

---

# 3. PRODUCTS PAGE (`/products`)

## 3.1 Statistics Cards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| P-001 | Total Products displays | Navigate to /products | Shows "0" (no seed data) | ⬜ |
| P-002 | Active Products displays | Check Active card | Shows "0" | ⬜ |
| P-003 | Draft Products displays | Check Draft card | Shows "0" | ⬜ |
| P-004 | Published displays | Check Published card | Shows "0" | ⬜ |

## 3.2 Buttons
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| P-005 | Refresh button | Click "Refresh" | Reloads product list | ⬜ |
| P-006 | Export button | Click "Export" | Downloads or shows modal | ⬜ |
| P-007 | Import button | Click "Import" | Opens import modal/wizard | ⬜ |
| P-008 | Create Product button | Click "Create Product" | Opens creation form/modal | ⬜ |

## 3.3 Empty State
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| P-009 | Empty products message | Check page content | Shows "No products found" or similar | ⬜ |
| P-010 | Create first product CTA | Check empty state | Shows call-to-action button | ⬜ |

---

# 4. QUALITY MEASURES PAGE (`/quality-measures`)

## 4.1 Statistics Cards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| Q-001 | Total Measures displays | Navigate to /quality-measures | Shows "5" or actual count | ⬜ |
| Q-002 | Active Measures displays | Check Active card | Shows count | ⬜ |
| Q-003 | HEDIS Measures displays | Check HEDIS card | Shows count | ⬜ |
| Q-004 | Avg Target Rate displays | Check Avg Target card | Shows percentage | ⬜ |

## 4.2 Search & Filters
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| Q-005 | Search input works | Type measure name | Filters measures | ⬜ |
| Q-006 | Advanced Filters button | Click "Advanced Filters" | Opens filter panel/modal | ⬜ |

## 4.3 Buttons
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| Q-007 | Refresh button | Click "Refresh" | Reloads measures | ⬜ |
| Q-008 | Export button | Click "Export" | Downloads data | ⬜ |
| Q-009 | Create Custom Measure | Click "Create Custom Measure" | Opens creation form | ⬜ |

## 4.4 Measure Cards/List
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| Q-010 | Measure displays | Check list | Shows measure cards/rows | ⬜ |
| Q-011 | View Details button | Click "View Details" on measure | Opens details modal | ⬜ |
| Q-012 | Program badge displays | Check measure | Shows HEDIS/MIPS badge | ⬜ |
| Q-013 | Domain badge displays | Check measure | Shows domain badge | ⬜ |

## 4.5 Measure Details Modal
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| Q-014 | Modal opens | Click measure | Modal appears with details | ⬜ |
| Q-015 | Overview tab | Check tabs | "Overview" tab is active | ⬜ |
| Q-016 | Measure Logic tab | Click "Measure Logic" tab | Shows logic details | ⬜ |
| Q-017 | Products tab | Click "Products" tab | Shows linked products | ⬜ |
| Q-018 | Billing Codes tab | Click "Billing Codes" tab | Shows associated codes | ⬜ |
| Q-019 | Edit Logic button | Click "Edit Logic" | Opens logic editor or navigates | ⬜ |
| Q-020 | Close modal | Click X or outside modal | Modal closes | ⬜ |

---

# 5. VALUE SETS PAGE (`/value-sets`)

## 5.1 Statistics Cards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| V-001 | Total Value Sets displays | Navigate to /value-sets | Shows count | ⬜ |
| V-002 | Total Codes displays | Check Total Codes card | Shows count | ⬜ |
| V-003 | Avg Codes per Set displays | Check Avg card | Shows average | ⬜ |

## 5.2 Buttons
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| V-004 | Refresh button | Click "Refresh" | Reloads value sets | ⬜ |
| V-005 | Export button | Click "Export" | Downloads data | ⬜ |
| V-006 | Create Value Set button | Click "Create Value Set" | Opens creation form | ⬜ |

## 5.3 Value Set Details Modal
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| V-007 | Modal opens | Click value set | Modal appears | ⬜ |
| V-008 | Code list displays | Check modal | Shows associated codes | ⬜ |
| V-009 | Add Code button | Click "Add Code" | Opens code selector | ⬜ |
| V-010 | Remove Code button | Click remove icon on code | Removes code from set | ⬜ |
| V-011 | Search codes in modal | Type in code search | Filters available codes | ⬜ |
| V-012 | Close modal | Click X or outside | Modal closes | ⬜ |

---

# 6. CODE MAPPINGS PAGE (`/mappings`)

## 6.1 Tab Navigation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| M-001 | Tabs visible | Navigate to /mappings | Shows "Benefit Mappings" and "Equivalency Mappings" tabs | ⬜ |
| M-002 | Default tab | Check active tab | "Benefit Mappings" is active by default | ⬜ |
| M-003 | Switch to Equivalency | Click "Equivalency Mappings" tab | Tab switches, content changes | ⬜ |
| M-004 | Switch back to Benefit | Click "Benefit Mappings" tab | Tab switches back | ⬜ |

## 6.2 Benefit Mappings Tab
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| M-005 | Statistics display | Check Benefit tab | Shows mapping statistics | ⬜ |
| M-006 | Search input | Type in search | Filters mappings | ⬜ |
| M-007 | Refresh button | Click "Refresh" | Reloads mappings | ⬜ |
| M-008 | Bulk Map Codes button | Click "Bulk Map Codes" | Opens bulk mapping interface | ⬜ |
| M-009 | Create Mapping button | Click "Create Mapping" | Opens creation dialog | ⬜ |
| M-010 | Empty state | Check content (no data) | Shows "No mappings found" | ⬜ |

## 6.3 Equivalency Mappings Tab
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| M-011 | Statistics display | Check Equivalency tab | Shows 3 equivalencies stats | ⬜ |
| M-012 | Search input | Type in search | Filters equivalencies | ⬜ |
| M-013 | Refresh button | Click "Refresh" | Reloads equivalencies | ⬜ |
| M-014 | Create Equivalency button | Click "Create Equivalency" | Opens creation dialog | ⬜ |
| M-015 | Equivalency table | Check table | Shows 3 equivalencies | ⬜ |
| M-016 | View Details button | Click eye icon | Opens details modal | ⬜ |
| M-017 | Delete button | Click trash icon | Shows confirmation dialog | ⬜ |

## 6.4 Create Equivalency Dialog
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| M-018 | Dialog opens | Click "Create Equivalency" | Dialog appears | ⬜ |
| M-019 | Name field | Type in Name field | Text appears | ⬜ |
| M-020 | Description field | Type in Description | Text appears | ⬜ |
| M-021 | Category dropdown | Click Category dropdown | Shows options (Laboratory, Procedure, etc.) | ⬜ |
| M-022 | Source dropdown | Click Source dropdown | Shows Manual, AI Suggested, System Generated | ⬜ |
| M-023 | Confidence slider | Drag slider | Value changes (0-100%) | ⬜ |
| M-024 | Source Code search | Type in Source Code field | Shows code suggestions | ⬜ |
| M-025 | Select source code | Click a code from results | Code is selected | ⬜ |
| M-026 | Target Code search | Type in Target Code field | Shows code suggestions | ⬜ |
| M-027 | Select target code | Click a code from results | Code is selected | ⬜ |
| M-028 | Relationship dropdown | Click Relationship | Shows Exact, Broader, Narrower, Related | ⬜ |
| M-029 | Bidirectional checkbox | Click checkbox | Toggles on/off | ⬜ |
| M-030 | Cancel button | Click "Cancel" | Dialog closes without saving | ⬜ |
| M-031 | Create button (empty) | Click "Create" with empty fields | Shows validation error | ⬜ |
| M-032 | Create button (valid) | Fill all fields and click "Create" | Creates equivalency, closes dialog | ⬜ |

## 6.5 Equivalency Details Modal
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| M-033 | Modal opens | Click eye icon on equivalency | Modal appears | ⬜ |
| M-034 | Details display | Check modal content | Shows name, description, category, source, confidence | ⬜ |
| M-035 | Mappings list | Check mappings section | Shows source → target code mappings | ⬜ |
| M-036 | Code badges | Check mapping items | Shows code type badges | ⬜ |
| M-037 | Relationship badge | Check mapping items | Shows relationship (Exact, etc.) | ⬜ |
| M-038 | Close button | Click "Close" | Modal closes | ⬜ |

---

# 7. ANALYTICS PAGE (`/analytics`)

## 7.1 Page Load
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A-001 | Page loads | Navigate to /analytics | Page displays without errors | ⬜ |
| A-002 | Charts render | Check page | Charts/graphs are visible | ⬜ |

## 7.2 Filters & Controls
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A-003 | Date range picker | Click date range | Opens date picker | ⬜ |
| A-004 | Filter dropdown | Click filter dropdown | Shows filter options | ⬜ |
| A-005 | Refresh button | Click "Refresh" | Reloads analytics data | ⬜ |
| A-006 | Export button | Click "Export" | Downloads report | ⬜ |

## 7.3 Charts & Visualizations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A-007 | Chart tooltips | Hover over chart data | Shows tooltip with details | ⬜ |
| A-008 | Chart legend | Check chart legend | Legend is visible and clickable | ⬜ |
| A-009 | Toggle legend item | Click legend item | Hides/shows data series | ⬜ |

---

# 8. GLOBAL NAVIGATION

## 8.1 Sidebar Navigation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| N-001 | Sidebar visible | Check any page | Left sidebar is visible | ⬜ |
| N-002 | Dashboard link | Click "Dashboard" | Navigates to /dashboard | ⬜ |
| N-003 | Products link | Click "Products" | Navigates to /products | ⬜ |
| N-004 | Code Library link | Click "Code Library" | Navigates to /codes | ⬜ |
| N-005 | Quality Measures link | Click "Quality Measures" | Navigates to /quality-measures | ⬜ |
| N-006 | Value Sets link | Click "Value Sets" | Navigates to /value-sets | ⬜ |
| N-007 | Code Mappings link | Click "Code Mappings" | Navigates to /mappings | ⬜ |
| N-008 | Analytics link | Click "Analytics" | Navigates to /analytics | ⬜ |
| N-009 | Settings link | Click "Settings" | Navigates to /settings | ⬜ |
| N-010 | Support link | Click "Support" | Navigates to /support | ⬜ |
| N-011 | Users link | Click "Users" | Navigates to /users | ⬜ |
| N-012 | Active state | Navigate to page | Corresponding sidebar item is highlighted | ⬜ |
| N-013 | Collapse sidebar | Click collapse button | Sidebar collapses to icons only | ⬜ |
| N-014 | Expand sidebar | Click expand button | Sidebar expands to full width | ⬜ |

## 8.2 Top Bar
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| N-015 | Page title displays | Check top bar | Shows current page name | ⬜ |
| N-016 | Notifications icon | Click bell icon | Shows notifications dropdown | ⬜ |
| N-017 | Notification badge | Check bell icon | Shows "3" badge | ⬜ |
| N-018 | User profile icon | Click user icon | Shows profile dropdown/menu | ⬜ |

---

# 9. FORMS & VALIDATION

## 9.1 General Form Behavior
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| F-001 | Required field validation | Submit form with empty required field | Shows error message | ⬜ |
| F-002 | Field focus | Click in input field | Field gets focus, shows border highlight | ⬜ |
| F-003 | Field blur | Click outside field | Field loses focus | ⬜ |
| F-004 | Cancel button | Click "Cancel" on any form | Form closes without saving | ⬜ |
| F-005 | Form reset | Open and close form | Form fields are cleared | ⬜ |

---

# 10. ERROR HANDLING

## 10.1 API Errors
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| E-001 | Network error | Disconnect internet, refresh page | Shows error message | ⬜ |
| E-002 | 500 error | Trigger server error | Shows error message | ⬜ |
| E-003 | 404 error | Navigate to /nonexistent | Shows 404 page | ⬜ |

## 10.2 Console Errors
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| E-004 | Console clean | Navigate through all pages | No console errors | ⬜ |
| E-005 | Console warnings | Check console | No warnings (or only expected ones) | ⬜ |

---

# 11. RESPONSIVE DESIGN

## 11.1 Mobile View (< 768px)
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| R-001 | Sidebar on mobile | Resize to mobile | Sidebar collapses or becomes hamburger menu | ⬜ |
| R-002 | Tables on mobile | Check table on mobile | Table is scrollable or stacks | ⬜ |
| R-003 | Cards on mobile | Check stat cards on mobile | Cards stack vertically | ⬜ |

## 11.2 Tablet View (768px - 1024px)
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| R-004 | Layout on tablet | Resize to tablet | Layout adjusts appropriately | ⬜ |
| R-005 | Sidebar on tablet | Check sidebar | Sidebar is visible or collapsible | ⬜ |

---

# 12. PERFORMANCE

## 12.1 Load Times
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| PERF-001 | Initial page load | Navigate to /codes | Page loads in < 3 seconds | ⬜ |
| PERF-002 | Search response | Type in search | Results appear in < 500ms | ⬜ |
| PERF-003 | Modal open | Click to open modal | Modal appears in < 300ms | ⬜ |

---

# TEST SUMMARY TEMPLATE

## Test Results Summary

**Date:** ___________  
**Tester:** ___________  
**Environment:** http://localhost:3000

### Overall Results
- **Total Tests:** 200+
- **Passed:** ___
- **Failed:** ___
- **Blocked:** ___
- **Not Tested:** ___

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

## How to Use This Document

1. **Print or open in split screen**
2. **Go through each test case systematically**
3. **Mark status:** ✅ Pass | ❌ Fail | ⚠️ Issue | ⬜ Not Tested
4. **Document any issues with screenshots**
5. **Report critical issues immediately**
6. **Complete summary at the end**

---

## Priority Legend

- 🔴 **Critical:** Blocks core functionality
- 🟡 **High:** Important feature not working
- 🟢 **Medium:** Minor issue, workaround exists
- 🔵 **Low:** Cosmetic or nice-to-have

---

**Good luck with testing!** 🧪

