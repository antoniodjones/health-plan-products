# QA Quick Checklist - Interactive Elements

## 🎯 Quick Test Guide
Test the most critical interactive elements first.

---

## ✅ CRITICAL PATH TESTS (Do These First)

### 1. Navigation (5 min)
- [ ] Click all 8 sidebar menu items
- [ ] Verify each page loads without errors
- [ ] Check active state highlights correct item
- [ ] Test collapse/expand sidebar button

### 2. Code Library - Core Features (10 min)
- [ ] Statistics cards show: 58 total, 58 active, 0 inactive, 3 types
- [ ] Search for "83036" - should find codes
- [ ] Search for "hemoglobin" - should find codes
- [ ] Click "Next" button - goes to page 2
- [ ] Click "Previous" button - goes back to page 1
- [ ] Click "Refresh" - reloads data
- [ ] Clear search - shows all codes again

### 3. Quality Measures - Modal Test (5 min)
- [ ] Click any measure card/row
- [ ] Modal opens with measure details
- [ ] Click "Overview" tab - shows data
- [ ] Click "Measure Logic" tab - shows logic
- [ ] Click "Products" tab - shows products
- [ ] Click "Billing Codes" tab - shows codes
- [ ] Click "Edit Logic" button - action occurs
- [ ] Click X or outside modal - closes

### 4. Code Mappings - Tabs & Dialog (10 min)
- [ ] "Benefit Mappings" tab is active by default
- [ ] Click "Equivalency Mappings" tab - switches
- [ ] Statistics show 3 equivalencies
- [ ] Table shows 3 rows
- [ ] Click "Create Equivalency" button
- [ ] Dialog opens
- [ ] Fill in Name field
- [ ] Select Category dropdown
- [ ] Drag Confidence slider
- [ ] Search for Source Code (type "83036")
- [ ] Select a code from dropdown
- [ ] Search for Target Code
- [ ] Select a code
- [ ] Select Relationship
- [ ] Toggle Bidirectional checkbox
- [ ] Click "Cancel" - dialog closes
- [ ] Open again and click "Create" with empty fields - shows error

### 5. Value Sets - Code Editor (5 min)
- [ ] Click any value set
- [ ] Modal opens
- [ ] Shows list of codes
- [ ] Click "Add Code" button
- [ ] Search for codes
- [ ] Select a code
- [ ] Code appears in list
- [ ] Click remove icon on a code
- [ ] Code is removed
- [ ] Click "Close"

---

## 🔍 SECONDARY TESTS (Do After Critical Path)

### Dashboard
- [ ] All 4 stat cards display
- [ ] Click "Export Report" button
- [ ] Click "Quick Action" button
- [ ] Click all 4 quick action cards
- [ ] Click "Review Codes" in alert
- [ ] Click "View All" buttons

### Products
- [ ] Stats show 0 (no seed data)
- [ ] Empty state message displays
- [ ] Click "Create Product" button
- [ ] Click "Import" button
- [ ] Click "Export" button
- [ ] Click "Refresh" button

### Analytics
- [ ] Page loads without errors
- [ ] Charts render
- [ ] Hover over chart - tooltip appears
- [ ] Click legend items - toggles data

---

## 🐛 CONSOLE CHECK

### Every Page
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Navigate through all pages
- [ ] **Should see NO red errors**
- [ ] Yellow warnings are OK (some expected)

---

## 📱 RESPONSIVE CHECK (Quick)

### Desktop (> 1024px)
- [ ] Sidebar fully visible
- [ ] Stats cards in grid (4 columns)
- [ ] Tables display properly

### Tablet (768px - 1024px)
- [ ] Resize browser window
- [ ] Sidebar still visible or collapsible
- [ ] Stats cards in 2-3 columns
- [ ] Tables scrollable

### Mobile (< 768px)
- [ ] Resize to mobile width
- [ ] Sidebar becomes hamburger menu or collapses
- [ ] Stats cards stack vertically
- [ ] Tables scroll horizontally

---

## ⚡ PERFORMANCE CHECK

### Load Times
- [ ] /codes loads in < 3 seconds
- [ ] Search results appear in < 500ms
- [ ] Modals open in < 300ms
- [ ] Page transitions are smooth

---

## 🚨 KNOWN ISSUES TO VERIFY

### Expected Behavior (Not Bugs)
1. **Products page is empty** - No products seeded yet (OK)
2. **Benefit Mappings tab is empty** - No mappings created yet (OK)
3. **Some buttons say "not implemented"** - Placeholder functionality (OK)

### Potential Issues to Watch For
1. **Search not working** - Should filter results
2. **Modals not opening** - Should appear on click
3. **Pagination not working** - Should change pages
4. **Console errors** - Should be none (red errors)
5. **Buttons doing nothing** - Should show feedback

---

## 📋 QUICK TEST RESULTS

**Tester:** _______________  
**Date:** _______________  
**Time:** _______________

### Results
- [ ] ✅ All critical tests passed
- [ ] ⚠️ Some issues found (list below)
- [ ] ❌ Critical issues blocking usage

### Issues Found
1. ________________________________
2. ________________________________
3. ________________________________

### Screenshots
- Attach screenshots of any issues

---

## 🎯 PRIORITY FIXES NEEDED

If you find issues, prioritize:

1. **🔴 CRITICAL** - Blocks core functionality
   - Navigation broken
   - Pages won't load
   - Console errors preventing use

2. **🟡 HIGH** - Important feature not working
   - Search not filtering
   - Modals not opening
   - Buttons not responding

3. **🟢 MEDIUM** - Minor issue
   - Styling issues
   - Slow performance
   - Missing tooltips

4. **🔵 LOW** - Nice to have
   - Cosmetic issues
   - Better error messages
   - Enhanced UX

---

## ⏱️ ESTIMATED TIME

- **Critical Path:** 35 minutes
- **Secondary Tests:** 20 minutes
- **Console Check:** 5 minutes
- **Responsive Check:** 10 minutes
- **Performance Check:** 5 minutes

**Total:** ~75 minutes for complete testing

---

## 📞 NEED HELP?

If you find issues:
1. Take a screenshot
2. Note the exact steps to reproduce
3. Check browser console for errors
4. Document what you expected vs what happened
5. Share findings for immediate fix

---

**Ready to test? Start with the Critical Path Tests above!** 🚀

