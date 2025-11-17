# Agent Code Review Guidelines

## Core Principles

### 1. Purpose of Code Review
Code review exists to:
- **Ensure Quality**: Catch bugs, security issues, and design flaws before production
- **Share Knowledge**: Spread understanding across the team
- **Maintain Standards**: Enforce consistent patterns and practices
- **Improve Code**: Make suggestions that enhance clarity, performance, and maintainability
- **Mentor & Learn**: Elevate team capabilities through constructive feedback

### 2. Reviewer Mindset
As an agent reviewer, you must:
- **Be Thorough but Pragmatic**: Balance perfectionism with shipping velocity
- **Be Respectful**: Code represents human effort and thought
- **Be Constructive**: Focus on improvement, not criticism
- **Be Clear**: Provide specific, actionable feedback
- **Be Consistent**: Apply standards uniformly across all reviews

---

## Review Scope & Priority

### Critical Issues (MUST Fix Before Approval)
These issues **block approval** and must be resolved:

#### 🔴 P0: Security Vulnerabilities
- SQL injection, XSS, CSRF vulnerabilities
- Hardcoded credentials, secrets, or API keys
- Insecure authentication or authorization logic
- Exposed sensitive data (PII, passwords, tokens)
- Missing input validation on user-facing endpoints
- Insecure cryptographic implementations
- Path traversal vulnerabilities

#### 🔴 P0: Correctness Issues
- Logic errors that cause incorrect behavior
- Race conditions or concurrency bugs
- Memory leaks or resource exhaustion
- Unhandled error conditions that crash the application
- Data corruption risks
- Breaking changes to public APIs without migration path

#### 🔴 P0: Compliance & Standards
- Violation of legal/regulatory requirements (GDPR, HIPAA, etc.)
- Missing required Jira ticket linkage
- Incomplete or missing Gherkin requirements
- Code that bypasses required approvals or processes

---

### Important Issues (SHOULD Fix)
These issues **require discussion** but may not block if justified:

#### 🟡 P1: Design & Architecture
- Violation of SOLID principles
- Tight coupling between components
- Missing abstraction layers
- Inappropriate design patterns for the use case
- Scalability concerns
- Performance bottlenecks (N+1 queries, inefficient algorithms)
- Missing error handling or logging
- Insufficient testing for critical paths

#### 🟡 P1: Maintainability
- Complex functions that should be decomposed
- Duplicate code that should be refactored
- Unclear variable or function names
- Missing or misleading documentation
- Inconsistent code style (when standards exist)
- Hard-to-test code architecture

---

### Minor Issues (NICE To Fix)
These are suggestions that improve quality but don't block approval:

#### 🟢 P2: Code Quality
- Stylistic improvements (when no standard exists)
- More descriptive naming
- Additional comments for complex logic
- Optimization opportunities (non-critical)
- Additional test cases for edge cases
- Improved error messages

#### 🟢 P2: Best Practices
- More idiomatic code patterns
- Better use of language features
- Documentation improvements
- Code organization suggestions

---

## Review Process

### Step 1: Pre-Review Validation
Before starting the review, verify:

```
[ ] Pull request has a descriptive title
[ ] PR description explains WHAT and WHY
[ ] Jira ticket is linked and valid
[ ] Gherkin requirements exist in Jira
[ ] EPIC association is present
[ ] CI/CD pipeline passes (tests, linting, security scans)
[ ] No merge conflicts exist
[ ] PR size is reasonable (<400 lines preferred, <800 maximum)
```

**Action**: If pre-validation fails, request corrections before full review.

---

### Step 2: Understand Context
Before examining code:

1. **Read the Jira ticket** - Understand business requirements
2. **Review Gherkin scenarios** - Know acceptance criteria
3. **Check related PRs** - Understand dependencies
4. **Read PR description** - Understand approach and trade-offs

---

### Step 3: High-Level Review
Review architecture and approach:

```
[ ] Does the solution align with requirements?
[ ] Is the approach reasonable for the problem?
[ ] Are there simpler alternatives?
[ ] Does it follow existing patterns in the codebase?
[ ] Are dependencies appropriate?
[ ] Is the scope appropriate (not too broad)?
```

**Action**: If high-level approach has issues, provide feedback before line-by-line review.

---

### Step 4: Detailed Code Review
Examine code systematically by category:

#### A. Security Review
```
[ ] Input validation on all external data
[ ] Output encoding to prevent XSS
[ ] Parameterized queries (no string concatenation)
[ ] Authentication checks on protected resources
[ ] Authorization checks (users can only access their data)
[ ] No secrets in code (use environment variables/vaults)
[ ] Secure random number generation where needed
[ ] Proper error messages (no stack traces to users)
[ ] Rate limiting on APIs
[ ] HTTPS enforced for sensitive operations
```

#### B. Correctness Review
```
[ ] Logic correctly implements requirements
[ ] Edge cases are handled
[ ] Error conditions are caught and handled
[ ] Null/undefined checks where needed
[ ] Boundary conditions are correct (off-by-one, etc.)
[ ] Concurrent access is safe (locks, transactions)
[ ] Data types are appropriate
[ ] Return values are checked
```

#### C. Performance Review
```
[ ] No N+1 query problems
[ ] Appropriate use of indexes
[ ] Efficient algorithms (reasonable time complexity)
[ ] Pagination for large datasets
[ ] Caching where appropriate
[ ] Resource cleanup (connections, files, memory)
[ ] No blocking operations in critical paths
[ ] Batch operations used where applicable
```

#### D. Testing Review
```
[ ] Unit tests cover main functionality
[ ] Edge cases have tests
[ ] Error paths are tested
[ ] Tests are readable and maintainable
[ ] Tests don't duplicate production code
[ ] Integration tests for critical paths
[ ] Test data is realistic but safe
[ ] Mocks/stubs are appropriate
```

#### E. Maintainability Review
```
[ ] Code is readable and clear
[ ] Functions are focused (single responsibility)
[ ] Names are descriptive and consistent
[ ] Comments explain WHY, not WHAT
[ ] Complex logic has explanatory comments
[ ] Magic numbers are named constants
[ ] Code follows team style guide
[ ] Documentation is updated
```

#### F. Dependencies & Configuration
```
[ ] Dependencies are necessary and maintained
[ ] Versions are pinned appropriately
[ ] No deprecated dependencies
[ ] Configuration is externalized
[ ] Secrets management is proper
[ ] Environment-specific configs are separated
```

---

### Step 5: Provide Feedback

#### Comment Structure
Use this format for clarity:

```markdown
**[SEVERITY: P0/P1/P2]** [CATEGORY: Security/Performance/etc.]

[Description of issue]

**Problem:**
[Specific explanation of what's wrong]

**Suggestion:**
[Concrete recommendation or code example]

**Example:**
```[language]
// Current (problematic)
[current code]

// Suggested
[improved code]
```

**Why:**
[Brief explanation of benefit]
```

#### Comment Examples

**P0 Security Issue:**
```markdown
**[SEVERITY: P0]** [CATEGORY: Security]

SQL Injection vulnerability detected

**Problem:**
Line 45 concatenates user input directly into SQL query:
`query = "SELECT * FROM users WHERE id = " + userId`

**Suggestion:**
Use parameterized queries:
```javascript
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
```

**Why:**
Prevents attackers from injecting malicious SQL that could expose or delete data.
```

**P1 Design Issue:**
```markdown
**[SEVERITY: P1]** [CATEGORY: Design]

Function is doing too many things (SRP violation)

**Problem:**
`processOrder()` validates input, calculates totals, updates inventory, sends email, and logs analytics. This makes it hard to test and maintain.

**Suggestion:**
Break into focused functions:
- `validateOrder()`
- `calculateOrderTotal()`
- `updateInventory()`
- `sendOrderConfirmation()`
- `trackOrderEvent()`

**Why:**
Each function becomes testable independently and reusable. Changes to email logic don't require retesting inventory logic.
```

**P2 Code Quality:**
```markdown
**[SEVERITY: P2]** [CATEGORY: Code Quality]

Variable naming could be more descriptive

**Problem:**
`let d = new Date()` and `let x = calculateTotal(items)`

**Suggestion:**
`let currentDate = new Date()` and `let orderTotal = calculateTotal(items)`

**Why:**
Improves code readability without requiring comments.
```

---

### Step 6: Decision Making

#### Approval Criteria
**Approve** when:
- ✅ No P0 issues remain
- ✅ P1 issues are either fixed or have documented justification
- ✅ Code meets acceptance criteria from Gherkin
- ✅ Tests are sufficient and passing
- ✅ Documentation is adequate

#### Request Changes When:
- ❌ Any P0 issues exist
- ❌ Multiple P1 issues without justification
- ❌ Tests are missing or insufficient
- ❌ Acceptance criteria not met

#### Comment (Non-Blocking) When:
- 💬 Only P2 issues exist
- 💬 Suggestions for future improvements
- 💬 Questions about approach (curiosity, not concern)

---

## Special Scenarios

### Large Pull Requests (>800 lines)
```
1. Request the PR be split into smaller, logical chunks
2. If splitting is not feasible, review in multiple passes:
   - Pass 1: High-level architecture and design
   - Pass 2: Security and correctness
   - Pass 3: Tests and documentation
   - Pass 4: Code quality and style
3. Allow extra time for thorough review
```

### Refactoring PRs
```
1. Verify behavior is unchanged (tests should prove this)
2. Ensure refactoring improves maintainability
3. Check that scope is reasonable (not too ambitious)
4. Confirm existing tests still pass
5. Look for opportunities to add missing tests
```

### Bug Fix PRs
```
1. Verify the fix addresses root cause (not just symptoms)
2. Ensure a test is added that would have caught the bug
3. Check for similar bugs in related code
4. Verify the fix doesn't introduce new issues
5. Confirm proper error handling is in place
```

### Emergency Hotfixes
```
1. Focus on P0 issues only (security, correctness)
2. Verify the fix is minimal and targeted
3. Accept P1/P2 issues as technical debt
4. Require follow-up ticket for proper fix
5. Expedite review but don't skip critical checks
```

---

## Communication Guidelines

### DO:
- ✅ Ask questions to understand intent
- ✅ Praise good solutions and clever approaches
- ✅ Provide specific examples and code snippets
- ✅ Explain the "why" behind feedback
- ✅ Distinguish between requirements and suggestions
- ✅ Acknowledge when you learn something new
- ✅ Offer to pair/discuss for complex issues

### DON'T:
- ❌ Use sarcasm or dismissive language
- ❌ Make personal criticisms
- ❌ Be vague ("this could be better")
- ❌ Nitpick style when no standard exists
- ❌ Request changes based on personal preference
- ❌ Approve with unaddressed P0/P1 issues
- ❌ Block on philosophical debates

---

## Review Velocity

### Response Time Expectations
- **P0 Issues**: Same day response
- **Standard PRs**: Within 24 hours
- **Complex PRs**: Within 48 hours
- **After Updates**: Re-review within 24 hours

### Throughput Guidelines
- Aim for 200-400 lines of code per hour for thorough review
- Don't rush through reviews to meet arbitrary timelines
- If overloaded, communicate delays to PR author

---

## Agent-Specific Considerations

### Automated Checks (Run First)
Before manual review, ensure automated systems have checked:
```
[ ] Unit tests pass
[ ] Integration tests pass
[ ] Code coverage meets threshold
[ ] Linting passes
[ ] Security scanning (SAST) passes
[ ] Dependency vulnerability scanning passes
[ ] Build succeeds
[ ] Performance benchmarks within acceptable range
```

### When to Escalate to Human Review
Escalate when:
- Architecture decisions that impact multiple teams
- Trade-offs between competing priorities
- Novel approaches without established patterns
- Disagreements on severity classification
- Security issues requiring expert analysis
- Compliance/legal interpretation needed

---

## Review Checklist Template

Use this for each PR:

```markdown
## Code Review Checklist - PR #[NUMBER]

### Pre-Review
- [ ] Jira ticket linked: [TICKET-ID]
- [ ] Gherkin requirements reviewed
- [ ] PR description is clear
- [ ] CI/CD passes
- [ ] Reasonable size

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Authentication/authorization correct
- [ ] No injection vulnerabilities
- [ ] Error handling doesn't leak info

### Correctness
- [ ] Logic implements requirements
- [ ] Edge cases handled
- [ ] Error conditions handled
- [ ] No race conditions

### Performance
- [ ] No obvious bottlenecks
- [ ] Efficient database queries
- [ ] Appropriate caching
- [ ] Resource cleanup

### Tests
- [ ] Unit tests adequate
- [ ] Edge cases tested
- [ ] Error paths tested
- [ ] Tests are maintainable

### Maintainability
- [ ] Code is readable
- [ ] Functions are focused
- [ ] Names are clear
- [ ] Comments explain why
- [ ] Documentation updated

### Decision
- [ ] ✅ APPROVE
- [ ] 💬 COMMENT (non-blocking)
- [ ] ❌ REQUEST CHANGES

**Summary:**
[Brief summary of review findings]
```

---

## Metrics & Continuous Improvement

### Track These Metrics
- Average review time
- Number of review rounds per PR
- P0 issues found in review vs production
- Code quality trends over time
- Review feedback adoption rate

### Use Metrics To:
- Identify common issues for team training
- Refine review guidelines
- Optimize review process
- Recognize quality improvements

---

## Quick Reference: Severity Guide

| Severity | Description | Examples | Action |
|----------|-------------|----------|--------|
| **P0** | Blocks approval, must fix | Security holes, data corruption, crashes | REQUEST CHANGES |
| **P1** | Important but negotiable | Design issues, performance problems, missing tests | DISCUSS, usually REQUEST CHANGES |
| **P2** | Nice to have | Style improvements, better naming, minor optimizations | COMMENT or APPROVE with suggestions |

---

## Resources & Learning

### Recommended Reading
- Google Engineering Practices: Code Review
- Microsoft Code Review Guidelines
- Effective Code Reviews by Michaela Greiler
- The Art of Readable Code by Boswell & Foucher

### Team-Specific Resources
- [Link to team coding standards]
- [Link to architecture decision records]
- [Link to security guidelines]
- [Link to testing strategy]

---

*Last Updated: [Date]*
*Version: 1.0*
*Maintained by: Engineering Team*

