# Jira Import Instructions - Health Plan Products Platform

**Complete Traceability Implementation Guide**

---

## 📋 Overview

This guide provides step-by-step instructions for importing all traceability artifacts into your Jira instance, creating end-to-end traceability from Features → Epics → Stories → Tests → Implementation.

---

## 🗂️ Files to Import (in order)

1. `JIRA_BUSINESS_PROJECT_HLPR.csv` - Features & Epics (Business Project)
2. `JIRA_PRODUCT_PROJECT_LLPR.csv` - Stories with Gherkin (Product Project)
3. `JIRA_QA_TEST_CASES_V2.csv` - Test Cases (QA Project)
4. `JIRA_ENGINEERING_PROJECT_ILPR.csv` - Implementation Stories (Engineering Project)
5. `JIRA_ISSUE_LINKS.csv` - Issue Links (Traceability)

---

## 🎯 Prerequisites

### 1. Jira Projects Setup

Ensure you have 4 Jira projects created:

| Project Key | Project Name | Project Type | Description |
|-------------|--------------|--------------|-------------|
| **HPBIZ** (or your key) | Business Requirements | Business | Features and Epics (HLPR) |
| **HPPROD** (or your key) | Product Requirements | Software | Stories with Gherkin (LLPR) |
| **HPQA** (or your key) | QA Test Cases | Test Management | Test Cases (X-ray) |
| **HPENG** (or your key) | Engineering | Software | Implementation Stories (ILPR) |

**Note:** Replace `HPBIZ`, `HPPROD`, `HPQA`, `HPENG` with your actual project keys throughout this guide.

### 2. Custom Fields (if needed)

Verify these fields exist in your Jira instance:

- **Business Project:** Epic Name, Epic Link
- **Product Project:** Story Points, Acceptance Criteria, Business Value, KPIs
- **QA Project:** Test Type, Precondition, Test Steps, Expected Results, Link (Tests)
- **Engineering Project:** Technical Approach

**If fields are missing:**
- Go to Jira Settings → Issues → Custom Fields
- Create missing fields with appropriate field types

### 3. Issue Link Types

Verify these link types exist:

- `contains` (Feature contains Epic, Epic contains Story)
- `is implemented by` (Epic is implemented by Story, Story is implemented by Implementation)
- `is tested by` (Story is tested by Test)
- `relates to` (General relationship)

**If link types are missing:**
- Go to Jira Settings → Issues → Issue Linking
- Create missing link types

### 4. X-ray Test Management (for QA Project)

If using X-ray for test management:
- Install X-ray Test Management app from Atlassian Marketplace
- Configure X-ray in your QA project

---

## 📥 Import Process

### **STEP 1: Import Business Project (Features & Epics)**

**File:** `JIRA_BUSINESS_PROJECT_HLPR.csv`

**Project:** HPBIZ (Business Requirements)

**Instructions:**

1. Navigate to your Business project (HPBIZ)
2. Go to **Project Settings → Import**
3. Select **CSV** as import source
4. Upload `JIRA_BUSINESS_PROJECT_HLPR.csv`
5. Map CSV columns to Jira fields:

| CSV Column | Jira Field |
|------------|------------|
| Summary | Summary |
| Issue Type | Issue Type |
| Description | Description |
| Epic Name | Epic Name (for Features only) |
| Epic Link | Epic Link (for Epics only) |
| Components | Components |
| Labels | Labels |
| Priority | Priority |

6. Click **Begin Import**
7. Wait for import to complete
8. **Verify:** You should see 8 Features and 22 Epics

**Validation JQL:**
```jql
project = HPBIZ AND issuetype = Feature
```
Expected: 8 results

```jql
project = HPBIZ AND issuetype = Epic
```
Expected: 22 results

---

### **STEP 2: Update CSV Files with Real Issue Keys**

**CRITICAL:** After importing Business Project, you need to update the other CSV files with the **real Jira issue keys** that were created.

**Instructions:**

1. Export all issues from Business project:
   - Go to HPBIZ project
   - Issues → Search for Issues
   - Search: `project = HPBIZ ORDER BY created ASC`
   - Export as CSV
   
2. Create a mapping of placeholder keys to real keys:

| Placeholder | Real Key | Summary |
|-------------|----------|---------|
| FEATURE-1 | HPBIZ-1 | Code Management System |
| EPIC-1 | HPBIZ-2 | Code Library & Search |
| EPIC-2 | HPBIZ-3 | Code Import & Export |
| ... | ... | ... |

3. **Find & Replace** in remaining CSV files:
   - Open `JIRA_PRODUCT_PROJECT_LLPR.csv`
   - Replace `EPIC-1` with `HPBIZ-2` (or your actual key)
   - Replace `EPIC-2` with `HPBIZ-3`
   - Continue for all Epics
   
4. Repeat for:
   - `JIRA_QA_TEST_CASES_V2.csv` (update `Link (Tests)` column with STORY keys)
   - `JIRA_ENGINEERING_PROJECT_ILPR.csv` (update `Parent Link` column with STORY keys)
   - `JIRA_ISSUE_LINKS.csv` (update all keys)

**Tip:** Use a spreadsheet tool (Excel, Google Sheets) for bulk find & replace.

---

### **STEP 3: Import Product Project (Stories with Gherkin)**

**File:** `JIRA_PRODUCT_PROJECT_LLPR.csv` (with updated Epic keys)

**Project:** HPPROD (Product Requirements)

**Instructions:**

1. Navigate to your Product project (HPPROD)
2. Go to **Project Settings → Import**
3. Select **CSV** as import source
4. Upload `JIRA_PRODUCT_PROJECT_LLPR.csv`
5. Map CSV columns to Jira fields:

| CSV Column | Jira Field |
|------------|------------|
| Summary | Summary |
| Issue Type | Issue Type |
| Description | Description |
| Epic Link | Epic Link |
| Story Points | Story Points |
| Components | Components |
| Labels | Labels |
| Priority | Priority |
| Acceptance Criteria | Acceptance Criteria (custom field) |
| Business Value | Business Value (custom field) |
| KPIs | KPIs (custom field) |

6. Click **Begin Import**
7. Wait for import to complete
8. **Verify:** You should see 25 Stories

**Validation JQL:**
```jql
project = HPPROD AND issuetype = Story
```
Expected: 25 results

**Verify Epic Links:**
```jql
project = HPPROD AND "Epic Link" is EMPTY
```
Expected: 0 results (all stories should be linked to epics)

---

### **STEP 4: Update CSV Files with Story Keys**

**Instructions:**

1. Export all stories from Product project:
   - Go to HPPROD project
   - Search: `project = HPPROD ORDER BY created ASC`
   - Export as CSV
   
2. Create a mapping of placeholder keys to real keys:

| Placeholder | Real Key | Summary |
|-------------|----------|---------|
| STORY-1 | HPPROD-1 | Medical Code Search |
| STORY-2 | HPPROD-2 | Code Pagination |
| ... | ... | ... |

3. **Find & Replace** in remaining CSV files:
   - Open `JIRA_QA_TEST_CASES_V2.csv`
   - Replace `STORY-1` with `HPPROD-1`
   - Continue for all Stories
   
4. Repeat for:
   - `JIRA_ENGINEERING_PROJECT_ILPR.csv` (update `Parent Link` column)
   - `JIRA_ISSUE_LINKS.csv` (update all STORY keys)

---

### **STEP 5: Import QA Test Cases**

**File:** `JIRA_QA_TEST_CASES_V2.csv` (with updated Story keys)

**Project:** HPQA (QA Test Cases)

**Instructions:**

1. Navigate to your QA project (HPQA)
2. Go to **Project Settings → Import**
3. Select **CSV** as import source
4. Upload `JIRA_QA_TEST_CASES_V2.csv`
5. Map CSV columns to Jira fields:

| CSV Column | Jira Field |
|------------|------------|
| Summary | Summary |
| Issue Type | Issue Type (Test) |
| Priority | Priority |
| Component | Components |
| Description | Description |
| Labels | Labels |
| Test Type | Test Type (X-ray field) |
| Precondition | Precondition (X-ray field) |
| Test Steps | Test Steps (X-ray field) |
| Expected Results | Expected Results (X-ray field) |
| Link (Tests) | Link (Tests) - X-ray link field |
| Acceptance Criteria | Acceptance Criteria |

6. Click **Begin Import**
7. Wait for import to complete
8. **Verify:** You should see 130 Test Cases

**Validation JQL:**
```jql
project = HPQA AND issuetype = Test
```
Expected: 130 results

**Verify Story Links (if X-ray supports):**
```jql
project = HPQA AND issueFunction not in linkedIssuesOf("project = HPPROD")
```
Expected: 0 results (all tests should be linked to stories)

---

### **STEP 6: Import Engineering Implementation Stories**

**File:** `JIRA_ENGINEERING_PROJECT_ILPR.csv` (with updated Story keys)

**Project:** HPENG (Engineering)

**Instructions:**

1. Navigate to your Engineering project (HPENG)
2. Go to **Project Settings → Import**
3. Select **CSV** as import source
4. Upload `JIRA_ENGINEERING_PROJECT_ILPR.csv`
5. Map CSV columns to Jira fields:

| CSV Column | Jira Field |
|------------|------------|
| Summary | Summary |
| Issue Type | Issue Type |
| Description | Description |
| Parent Link | Parent Link (or Epic Link) |
| Story Points | Story Points |
| Components | Components |
| Labels | Labels |
| Priority | Priority |
| Technical Approach | Technical Approach (custom field) |

6. Click **Begin Import**
7. Wait for import to complete
8. **Verify:** You should see 28 Implementation Stories

**Validation JQL:**
```jql
project = HPENG AND issuetype = Story
```
Expected: 28 results

**Verify Parent Links:**
```jql
project = HPENG AND "Parent Link" is EMPTY
```
Expected: 5 results (only infrastructure stories without parents)

---

### **STEP 7: Update Issue Links CSV with All Real Keys**

**Instructions:**

1. Create a complete mapping of all placeholder keys to real keys:

| Placeholder Type | Placeholder | Real Key |
|------------------|-------------|----------|
| Feature | FEATURE-1 | HPBIZ-1 |
| Epic | EPIC-1 | HPBIZ-2 |
| Story | STORY-1 | HPPROD-1 |
| Test | TEST-C-001 | HPQA-1 |
| Implementation | IMPL-1 | HPENG-1 |

2. Open `JIRA_ISSUE_LINKS.csv`
3. Replace ALL placeholder keys with real keys
4. Save the updated file

---

### **STEP 8: Import Issue Links (Traceability)**

**File:** `JIRA_ISSUE_LINKS.csv` (with all real keys)

**Instructions:**

1. Go to **Jira Settings → System → Import & Export → CSV**
2. Select **Import issues from CSV**
3. Upload `JIRA_ISSUE_LINKS.csv`
4. Select **Link existing issues** (not create new issues)
5. Map columns:

| CSV Column | Jira Field |
|------------|------------|
| Source Issue Key | Source Issue Key |
| Link Type | Link Type |
| Target Issue Key | Target Issue Key |

6. Click **Begin Import**
7. Wait for import to complete
8. **Verify:** All links should be created

**Validation JQL:**

Check for orphaned Features (no Epics):
```jql
project = HPBIZ AND issuetype = Feature AND issueFunction not in hasLinks()
```
Expected: 0 results

Check for orphaned Epics (no Stories):
```jql
project = HPBIZ AND issuetype = Epic AND issueFunction not in linkedIssuesOf("project = HPPROD")
```
Expected: 0 results

Check for Stories without Tests:
```jql
project = HPPROD AND issuetype = Story AND issueFunction not in linkedIssuesOf("project = HPQA AND issuetype = Test")
```
Expected: 5 results (stories without tests yet)

Check for Stories without Implementation:
```jql
project = HPPROD AND issuetype = Story AND issueFunction not in linkedIssuesOf("project = HPENG")
```
Expected: 0 results

---

## ✅ Validation & Verification

### 1. Verify Issue Counts

| Project | Issue Type | Expected Count |
|---------|------------|----------------|
| HPBIZ | Feature | 8 |
| HPBIZ | Epic | 22 |
| HPPROD | Story | 25 |
| HPQA | Test | 130 |
| HPENG | Story | 28 |
| **Total** | | **213** |

### 2. Verify Traceability

Run this JQL to find complete traceability chains:

```jql
project = HPPROD AND issuetype = Story AND issueFunction in linkedIssuesOf("project = HPBIZ AND issuetype = Epic") AND issueFunction in linkedIssuesOf("project = HPQA AND issuetype = Test") AND issueFunction in linkedIssuesOf("project = HPENG")
```

Expected: 18 results (stories with full traceability)

### 3. Verify Coverage

**Test Coverage:**
```jql
project = HPPROD AND issuetype = Story AND issueFunction in linkedIssuesOf("project = HPQA AND issuetype = Test")
```
Expected: 18 results (72% test coverage)

**Implementation Coverage:**
```jql
project = HPPROD AND issuetype = Story AND issueFunction in linkedIssuesOf("project = HPENG")
```
Expected: 23 results (92% implementation coverage)

### 4. Verify Labels

Check that all issues have appropriate labels:

```jql
project = HPBIZ AND labels = HLPR
```
Expected: 30 results (8 Features + 22 Epics)

```jql
project = HPPROD AND labels = LLPR
```
Expected: 25 results (all Stories)

```jql
project = HPQA AND labels = TestCase
```
Expected: 130 results (all Tests)

```jql
project = HPENG AND labels = ILPR
```
Expected: 28 results (all Implementation Stories)

---

## 🔗 Traceability Matrix

After import, you can view the traceability matrix by importing `TRACEABILITY_MATRIX.csv` into a spreadsheet tool or creating a Jira dashboard with custom filters.

**Key Metrics:**
- **Total Stories:** 25
- **Stories with Tests:** 18 (72%)
- **Stories with Implementation:** 23 (92%)
- **Stories with Full Traceability:** 18 (72%)

**Gaps:**
- 5 stories need test cases (Import, Custom Codes, Measure Logic, Accessibility, plus infrastructure)
- 2 stories need implementation (none currently, all implemented)

---

## 🎨 Jira Dashboard Setup (Optional)

Create a dashboard to visualize traceability:

### Widget 1: Feature Progress
```jql
project = HPBIZ AND issuetype = Feature
```
Chart Type: Pie Chart (by Status)

### Widget 2: Story Coverage
```jql
project = HPPROD AND issuetype = Story
```
Chart Type: Bar Chart (by Test Coverage)

### Widget 3: Test Execution Status
```jql
project = HPQA AND issuetype = Test
```
Chart Type: Pie Chart (by Test Status)

### Widget 4: Implementation Progress
```jql
project = HPENG AND issuetype = Story
```
Chart Type: Pie Chart (by Status)

---

## 🛠️ Git Integration Setup

### 1. Connect Jira to GitHub

1. Go to **Jira Settings → Applications → GitHub**
2. Click **Add GitHub organization**
3. Authorize Jira to access your GitHub account
4. Select your repository: `health-plan-products`

### 2. Branch Naming Convention

Use this format for all branches:
```
feature/HPENG-123-short-description
bugfix/HPENG-124-short-description
hotfix/HPENG-125-short-description
```

### 3. Commit Message Convention

Use this format for all commits:
```
[HPENG-123] Implement code search API endpoint

- Add GET /api/codes endpoint
- Add Prisma search logic
- Add Zod validation
```

### 4. Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Jira Ticket
[HPENG-123] Implement code search API endpoint
https://yourcompany.atlassian.net/browse/HPENG-123

## Related Issues
- Implements: HPPROD-1
- Tested by: HPQA-5, HPQA-6, HPQA-7

## Changes Made
- Added GET /api/codes endpoint
- Implemented Prisma search logic
- Added Zod validation

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

## Deployment Notes
- No special deployment requirements
```

### 5. Jira Automation Rules

**Rule 1: Auto-transition on PR Creation**
- Trigger: Pull request created
- Condition: PR title contains issue key
- Action: Transition issue to "In Review"

**Rule 2: Auto-transition on PR Merge**
- Trigger: Pull request merged
- Condition: PR title contains issue key
- Action: Transition issue to "Done"

**Rule 3: Link Commits to Issue**
- Trigger: Commit message contains issue key
- Action: Add commit as development information

---

## 📊 Reporting & Analytics

### Coverage Report

Run this JQL to generate a coverage report:

```jql
project = HPPROD AND issuetype = Story ORDER BY key ASC
```

Export to CSV and add columns:
- Test Coverage: Count of linked tests
- Implementation Coverage: Count of linked implementations
- Status: Complete / In Progress / Not Started

### Gap Analysis

Find stories without tests:
```jql
project = HPPROD AND issuetype = Story AND issueFunction not in linkedIssuesOf("project = HPQA AND issuetype = Test")
```

Find stories without implementation:
```jql
project = HPPROD AND issuetype = Story AND issueFunction not in linkedIssuesOf("project = HPENG")
```

### Traceability Report

Create a Jira filter with this JQL:
```jql
project = HPPROD AND issuetype = Story AND issueFunction in linkedIssuesOf("project = HPBIZ") AND issueFunction in linkedIssuesOf("project = HPQA") AND issueFunction in linkedIssuesOf("project = HPENG")
```

Subscribe to this filter to receive weekly traceability reports.

---

## 🚨 Troubleshooting

### Issue: CSV Import Fails

**Solution:**
- Check CSV format (UTF-8 encoding)
- Verify all required columns are present
- Check for special characters in data
- Ensure issue keys are valid

### Issue: Links Not Created

**Solution:**
- Verify link types exist in Jira
- Check that source and target issue keys are correct
- Ensure issues exist before creating links
- Check permissions (user must have link permission)

### Issue: Custom Fields Not Mapping

**Solution:**
- Create custom fields in Jira first
- Use exact field names in CSV
- Check field types match (text, number, etc.)
- Verify field is available in project

### Issue: Epic Links Not Working

**Solution:**
- Ensure Epic Link field is enabled in project
- Verify Epic exists before linking
- Check that Epic is in the same project or linked project
- Use correct Epic key format

---

## 📝 Best Practices

1. **Import in Order:** Always import in the order specified (Business → Product → QA → Engineering → Links)
2. **Verify After Each Step:** Run validation JQL after each import
3. **Backup First:** Export existing issues before importing
4. **Test in Sandbox:** Test import process in a sandbox project first
5. **Update Keys:** Always update placeholder keys with real keys before next import
6. **Document Mapping:** Keep a mapping document of placeholder → real keys
7. **Review Links:** Manually review a sample of links to ensure correctness
8. **Train Team:** Train team on traceability conventions and Git integration

---

## 🎯 Success Criteria

After completing all imports, you should have:

✅ 8 Features in Business project  
✅ 22 Epics in Business project  
✅ 25 Stories in Product project  
✅ 130 Test Cases in QA project  
✅ 28 Implementation Stories in Engineering project  
✅ 160+ issue links connecting all items  
✅ Full traceability from Feature to Test to Implementation  
✅ Git integration with branch/commit conventions  
✅ Jira automation rules for PR transitions  

---

## 📞 Support

If you encounter issues during import:

1. Check this guide's Troubleshooting section
2. Review Jira's CSV import documentation
3. Contact your Jira administrator
4. Reach out to the project team

---

**Import Date:** _____________  
**Imported By:** _____________  
**Jira Instance:** _____________  
**Projects Created:** HPBIZ, HPPROD, HPQA, HPENG  
**Total Issues Imported:** 213  
**Total Links Created:** 160+  

---

**End of Import Instructions**

