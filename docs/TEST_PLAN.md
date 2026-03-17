# Test Plan - Student Account Management System

## Document Information
- **Project**: Student Account Management System (COBOL)
- **Date Created**: March 17, 2026
- **Version**: 1.0

---

## Executive Summary

This test plan defines comprehensive test coverage for the Student Account Management System, a three-tier COBOL application consisting of Main Program (UI), Operations (Business Logic), and Data (Storage) modules. The testing strategy covers functional, boundary, and error-handling scenarios.

---

## Test Scope

### In Scope
- ✓ Menu navigation and user input handling
- ✓ View Balance functionality
- ✓ Credit (Deposit) operations
- ✓ Debit (Withdrawal) operations with overdraft prevention
- ✓ Data persistence across operations
- ✓ Error handling for invalid inputs
- ✓ Application exit functionality

### Out of Scope
- Concurrent user access
- Network communication
- Database integration
- User authentication
- Audit logging

---

## Test Environment

| Item | Details |
|------|---------|
| **OS** | Ubuntu 22.04.5 LTS |
| **COBOL Compiler** | GnuCOBOL (cobc) |
| **Compilation** | `cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem` |
| **Execution** | Interactive terminal or piped input |

---

## Test Cases

### Test Suite 1: Application Startup & Menu

| TC# | Test Case | Steps | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS1.1** | Application launches successfully | 1. Compile application<br/>2. Execute ./accountsystem | Menu displays with options 1-4, app awaits user input | ⚠️ Pending |
| **TS1.2** | Menu displays all options | 1. Run application | Menu shows:<br/>• View Balance<br/>• Credit Account<br/>• Debit Account<br/>• Exit | ⚠️ Pending |

---

### Test Suite 2: View Balance (Option 1)

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS2.1** | View initial balance | `1` then `4` | Displays "Current balance: 1000.00" | ⚠️ Pending |
| **TS2.2** | View balance after credit | `1`, credit 500, then `1` again | First: 1000.00<br/>Second: 1500.00 | ⚠️ Pending |
| **TS2.3** | View balance after debit | `1`, debit 300, then `1` again | First: 1000.00<br/>Second: 700.00 | ⚠️ Pending |
| **TS2.4** | Menu returns after view balance | Select `1` | Balance displayed, menu reappears | ⚠️ Pending |

---

### Test Suite 3: Credit Account (Option 2)

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS3.1** | Simple credit transaction | `2`, amount: 100, then `4` | Displays "Amount credited. New balance: 1100.00" | ⚠️ Pending |
| **TS3.2** | Credit updates balance | `2`, amount: 500, then `1`, then `4` | View Balance confirms new total: 1500.00 | ⚠️ Pending |
| **TS3.3** | Large credit amount | `2`, amount: 500000, then `1`, then `4` | Balance updated to 500,001.00 | ⚠️ Pending |
| **TS3.4** | Multiple sequential credits | `2` (100), `2` (200), `2` (150), then `1` | Final balance: 1450.00 | ⚠️ Pending |
| **TS3.5** | Credit with zero amount | `2`, amount: 0, then `1` | Balance unchanged: 1000.00 | ⚠️ Pending |
| **TS3.6** | Credit decimal amounts | `2`, amount: 99.99, then `1` | Balance: 1099.99 | ⚠️ Pending |

---

### Test Suite 4: Debit Account (Option 3)

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS4.1** | Simple debit transaction | `3`, amount: 100, then `4` | Displays "Amount debited. New balance: 900.00" | ⚠️ Pending |
| **TS4.2** | Debit updates balance | `3`, amount: 250, then `1`, then `4` | View Balance confirms: 750.00 | ⚠️ Pending |
| **TS4.3** | Debit exact account balance | `3`, amount: 1000, then `1` | Balance: 0.00 | ⚠️ Pending |
| **TS4.4** | Multiple sequential debits | `3` (100), `3` (200), `3` (150), then `1` | Final balance: 550.00 | ⚠️ Pending |

---

### Test Suite 5: Overdraft Prevention (Critical)

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS5.1** | Reject debit exceeding balance | `3`, amount: 1001, then `1` | "Insufficient funds for this debit."<br/>Balance unchanged: 1000.00 | ⚠️ Pending |
| **TS5.2** | Prevent overdraft partially | `3` (500), `3` (600), then `1` | First succeeds (500.00 left)<br/>Second rejected (attempting 600 > 500)<br/>Final balance: 500.00 | ⚠️ Pending |
| **TS5.3** | Reject debit when balance zero | Start with 0 balance, `3` (1), then `1` | "Insufficient funds for this debit."<br/>Balance: 0.00 | ⚠️ Pending |
| **TS5.4** | Allow debit at balance boundary | `3`, amount: 1000, then `1` | Successfully debited<br/>Balance: 0.00 | ⚠️ Pending |

---

### Test Suite 6: Error Handling & Invalid Input

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS6.1** | Invalid menu choice (5) | `5` then `1` then `4` | "Invalid choice, please select 1-4."<br/>Menu re-displays | ⚠️ Pending |
| **TS6.2** | Invalid menu choice (0) | `0` then `1` then `4` | "Invalid choice, please select 1-4." | ⚠️ Pending |
| **TS6.3** | Invalid menu choice (negative) | `-1` then `1` then `4` | "Invalid choice, please select 1-4." | ⚠️ Pending |
| **TS6.4** | Invalid menu choice (letter) | `a` then `1` then `4` | "Invalid choice, please select 1-4." | ⚠️ Pending |
| **TS6.5** | Multiple invalid choices | `5`, `0`, `-1`, then `1` then `4` | Error message displays 3 times, menu reappears | ⚠️ Pending |

---

### Test Suite 7: Application Exit (Option 4)

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS7.1** | Exit from main menu | `4` | "Exiting the program. Goodbye!"<br/>Application terminates | ⚠️ Pending |
| **TS7.2** | Exit after operations | `1`, then `4` | Balance displayed, then exit message, then terminate | ⚠️ Pending |
| **TS7.3** | Exit preserves final balance | `2` (100), `1`, `4` | Exit after confirming balance is 1100.00 | ⚠️ Pending |

---

### Test Suite 8: Data Persistence

| TC# | Test Case | "Input" | Expected Result | Status |
|-----|-----------|---------|-----------------|--------|
| **TS8.1** | Balance persists within session | Multiple operations in sequence | All operations use updated balance from previous step | ⚠️ Pending |
| **TS8.2** | Credit then debit sequence | `2` (500), `3` (200), `1`, `4` | Final balance: 1300.00 | ⚠️ Pending |
| **TS8.3** | Mixed operations maintain integrity | Complex sequence with multiple operations | All balance calculations correct | ⚠️ Pending |

---

### Test Suite 9: Boundary Value Testing

| TC# | Test Case | Input | Expected Result | Status |
|-----|-----------|-------|-----------------|--------|
| **TS9.1** | Minimum debit (1 cent) | `3`, amount: 0.01 | Balance: 999.99 | ⚠️ Pending |
| **TS9.2** | Maximum balance (PIC 9(6)V99) | Credit to 999999.99 | Balance: 999999.99 | ⚠️ Pending |
| **TS9.3** | Debit with 2 decimal precision | `3`, amount: 50.50 | Balance: 949.50 | ⚠️ Pending |
| **TS9.4** | Balance near zero | Start 0.50, `3` (0.50) | Balance: 0.00 | ⚠️ Pending |

---

### Test Suite 10: Integration Testing

| TC# | Test Case | Scenario | Expected Result | Status |
|-----|-----------|----------|-----------------|--------|
| **TS10.1** | Full workflow | User: view → credit 100 → view → debit 50 → view → exit | All operations execute correctly with accurate balances | ⚠️ Pending |
| **TS10.2** | Error recovery | Invalid input followed by valid operation | System recovers and processes valid option | ⚠️ Pending |
| **TS10.3** | Repeated operations | Cycle through all menu options 3 times | All operations function consistently | ⚠️ Pending |

---

## Test Execution Summary

### Total Test Cases: 35
- **Functional Tests**: 14
- **Boundary Tests**: 8
- **Error Handling Tests**: 5
- **Integration Tests**: 3
- **Data Persistence Tests**: 3
- **Exit Tests**: 3

### Current Status: ⚠️ **NOT EXECUTED**

| Category | Total | Passed | Failed | Blocked |
|----------|-------|--------|--------|---------|
| **Suite 1: Startup** | 2 | 0 | 0 | 2 |
| **Suite 2: View Balance** | 4 | 0 | 0 | 4 |
| **Suite 3: Credit** | 6 | 0 | 0 | 6 |
| **Suite 4: Debit** | 4 | 0 | 0 | 4 |
| **Suite 5: Overdraft** | 4 | 0 | 0 | 4 |
| **Suite 6: Error Handling** | 5 | 0 | 0 | 5 |
| **Suite 7: Exit** | 3 | 0 | 0 | 3 |
| **Suite 8: Persistence** | 3 | 0 | 0 | 3 |
| **Suite 9: Boundary** | 4 | 0 | 0 | 4 |
| **Suite 10: Integration** | 3 | 0 | 0 | 3 |
| **TOTAL** | **35** | **0** | **0** | **35** |

---

## Test Execution Instructions

### Prerequisites
```bash
# Navigate to project root
cd /workspaces/skills-modernize-your-legacy-code-with-github-copilot

# Compile application
cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem
```

### Manual Interactive Testing
```bash
# Run application interactively
./accountsystem
```

### Automated Testing with Input
```bash
# Test View Balance → Exit
echo -e "1\n4" | ./accountsystem

# Test Credit → Exit
echo -e "2\n100\n4" | ./accountsystem

# Test Debit → Exit
echo -e "3\n50\n4" | ./accountsystem

# Test Overdraft Prevention
echo -e "3\n2000\n4" | ./accountsystem

# Full workflow test
echo -e "1\n2\n100\n1\n3\n50\n1\n4" | ./accountsystem
```

---

## Defect Reporting Template

When a test fails, report using this format:

```
TEST CASE: [TC#]
TITLE: [Test Case Name]
SEVERITY: [Critical/High/Medium/Low]
STEPS TO REPRODUCE: [Detailed steps]
EXPECTED RESULT: [What should happen]
ACTUAL RESULT: [What actually happened]
ENVIRONMENT: [OS, Compiler version, etc.]
ATTACHMENTS: [Screenshots, logs, etc.]
```

---

## Test Coverage Matrix

| Feature | Unit | Integration | E2E |
|---------|------|-------------|-----|
| **Menu Navigation** | ✓ | ✓ | ✓ |
| **View Balance** | ✓ | ✓ | ✓ |
| **Credit Account** | ✓ | ✓ | ✓ |
| **Debit Account** | ✓ | ✓ | ✓ |
| **Overdraft Prevention** | ✓ | ✓ | ✓ |
| **Error Handling** | ✓ | ✓ | ✓ |
| **Data Persistence** | ✓ | ✓ | ✓ |
| **Exit Function** | ✓ | ✓ | ✓ |

---

## Acceptance Criteria

The application is ready for production when:
- ✓ All 35 test cases pass without defects
- ✓ Overdraft prevention functions correctly (Suite 5)
- ✓ Balance calculations remain accurate across all operations
- ✓ Menu validation rejects invalid inputs
- ✓ Application exits cleanly
- ✓ No memory leaks or runtime errors
- ✓ Performance acceptable (<1 second per operation)

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | - | - | - |
| Development | - | - | - |
| QA Manager | - | - | - |
| Product Owner | - | - | - |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-17 | Copilot | Initial test plan creation |

