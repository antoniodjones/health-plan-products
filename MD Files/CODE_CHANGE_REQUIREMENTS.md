# Code Change Requirements

## Overview
All code changes must have full traceability from business requirements to implementation. This ensures accountability, proper documentation, and alignment between business needs and technical delivery.

## Mandatory Requirements

### 1. Jira Ticket Requirement
**Every code change request MUST include a valid Jira ticket reference.**

#### Validation Criteria
The agent must verify:
- [ ] A Jira ticket ID is provided (format: `PROJECT-1234`)
- [ ] The ticket is accessible and exists in the Jira system
- [ ] The ticket status is valid for code changes (not Closed, Cancelled, or Resolved)

#### Rejection Criteria
**The agent MUST reject the code change request if:**
- No Jira ticket is referenced
- The Jira ticket ID is invalid or cannot be found
- The ticket format is incorrect
- The ticket is in a closed/cancelled state

---

### 2. Gherkin Requirements
**All Jira tickets must contain product requirements written in Gherkin format.**

#### Required Gherkin Structure
```gherkin
Feature: [Feature name]
  As a [role]
  I want [goal]
  So that [business value]

Scenario: [Scenario name]
  Given [precondition]
  When [action]
  Then [expected result]
```

#### Validation Criteria
The agent must verify:
- [ ] The Jira ticket contains a structured Gherkin specification
- [ ] At minimum: Feature, Scenario, Given/When/Then statements are present
- [ ] Requirements clearly define acceptance criteria

#### Rejection Criteria
**The agent MUST reject if:**
- Jira ticket lacks Gherkin-formatted requirements
- Requirements are vague or incomplete
- No clear acceptance criteria are defined

---

### 3. EPIC Linkage
**All Jira tickets must be linked to a specific EPIC.**

#### Validation Criteria
The agent must verify:
- [ ] The Jira ticket has an EPIC link/parent
- [ ] The EPIC is active and valid
- [ ] The change aligns with the EPIC's scope

#### Rejection Criteria
**The agent MUST reject if:**
- No EPIC is associated with the ticket
- EPIC link is broken or invalid
- Ticket is orphaned without parent hierarchy

---

### 4. GitHub Repository Linkage
**All code changes must be linked to the associated GitHub repository.**

#### Validation Criteria
The agent must verify:
- [ ] GitHub repository URL is specified
- [ ] Repository exists and is accessible
- [ ] Branch/PR reference is included (when applicable)

#### Rejection Criteria
**The agent MUST reject if:**
- No GitHub repository is linked
- Repository link is invalid or inaccessible
- Required repository metadata is missing

---

## Traceability Chain

The complete traceability must be established:

```
Business Need (EPIC)
    ↓
Product Requirement (Jira Ticket + Gherkin)
    ↓
Code Implementation (GitHub Repository)
    ↓
Verification (Test Results)
```

---

## Applicability

### This applies to:
1. **Feature Development** - New functionality or enhancements
2. **Bug Fixes** - Defects found in production or testing
3. **Technical Debt** - Refactoring or optimization work
4. **Configuration Changes** - Infrastructure or deployment changes

### This does NOT apply to:
- Emergency hotfixes (must create ticket immediately after)
- Documentation-only updates (unless part of feature delivery)
- Automated dependency updates (unless part of a tracked initiative)

---

## Agent Enforcement Rules

### Pre-Change Validation Checklist
Before accepting any code change request, the agent MUST validate:

1. **Jira Ticket Exists**
   - Prompt: "Please provide the Jira ticket ID for this change"
   - Verify: Ticket exists and is accessible
   - Action: Reject if not provided or invalid

2. **Gherkin Requirements Present**
   - Check: Jira ticket contains Gherkin specifications
   - Action: Reject if requirements are missing or poorly formatted

3. **EPIC Association**
   - Check: Ticket is linked to an EPIC
   - Action: Reject if no EPIC association exists

4. **GitHub Linkage**
   - Check: Repository information is present
   - Action: Reject if GitHub link is missing

### Rejection Response Template
When rejecting a request, the agent should respond:

```
❌ Code Change Request Rejected

Reason: [Specific validation failure]

Required Information Missing:
- [ ] Jira Ticket: [Status]
- [ ] Gherkin Requirements: [Status]
- [ ] EPIC Association: [Status]  
- [ ] GitHub Repository: [Status]

Next Steps:
1. [Specific action needed]
2. [Specific action needed]

Please provide the missing information and resubmit your request.
```

---

## Examples

### ✅ Valid Request
```
Change Request: Add user authentication feature
Jira Ticket: PROJ-1234
EPIC: PROJ-100 (User Management Epic)
GitHub Repo: https://github.com/company/app-backend
Branch: feature/PROJ-1234-user-auth

Gherkin in Jira:
Feature: User Authentication
  As a user
  I want to log in securely
  So that I can access my account

Scenario: Successful login
  Given I am on the login page
  When I enter valid credentials
  Then I should be redirected to the dashboard
```

### ❌ Invalid Request (No Jira)
```
Change Request: Fix login bug
Description: Login button doesn't work

REJECTED: No Jira ticket provided
```

### ❌ Invalid Request (Missing Gherkin)
```
Change Request: Update dashboard
Jira Ticket: PROJ-1235
GitHub: https://github.com/company/app

REJECTED: Jira ticket PROJ-1235 does not contain Gherkin requirements
```

### ❌ Invalid Request (No EPIC)
```
Change Request: Refactor database queries
Jira Ticket: PROJ-1236 (orphaned, no EPIC)
GitHub: https://github.com/company/app

REJECTED: Jira ticket PROJ-1236 is not linked to any EPIC
```

---

## Enforcement Policy

**Zero Exceptions**: The agent must enforce these requirements consistently for all code changes. No bypasses are permitted without explicit override from authorized personnel.

**Audit Trail**: All rejections should be logged with:
- Timestamp
- Requester
- Reason for rejection
- Missing requirements

---

## Benefits

This process ensures:
- **Traceability**: Clear path from business need to code
- **Accountability**: Every change has an owner and justification
- **Quality**: Requirements are documented before implementation
- **Compliance**: Audit trail for regulatory requirements
- **Planning**: Better project tracking and velocity metrics

---

## Questions & Exceptions

For questions about these requirements or to request an exception, contact:
- Product Owner: [Name/Contact]
- Engineering Lead: [Name/Contact]
- Process Questions: [Team/Channel]

---

*Last Updated: [Date]*
*Version: 1.0*
