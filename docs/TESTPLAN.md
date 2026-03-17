# Test Plan - Student Account Management System

**Project:** Student Account Management System (COBOL to Node.js Transformation)  
**Created:** March 17, 2026  
**Version:** 1.0  
**Purpose:** Validation of business logic for stakeholder approval and Node.js migration

---

## Test Suite 1: Application Startup and Menu Navigation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS1-001 | Application launches successfully | Application executable exists | 1. Compile COBOL source files<br/>2. Execute accountsystem | Application displays menu with options 1-4 | | ⚠️ Pending | Primary entry point test |
| TS1-002 | Menu displays all operations | Application is running | 1. View menu on startup | Display contains:<br/>- View Balance (1)<br/>- Credit Account (2)<br/>- Debit Account (3)<br/>- Exit (4) | | ⚠️ Pending | Verify UI completeness |
| TS1-003 | Menu accepts user input | Menu is displayed | 1. Input menu choice<br/>2. Verify response | Application processes choice without error | | ⚠️ Pending | Input validation |

---

## Test Suite 2: View Balance Operation (Option 1)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS2-001 | View initial account balance | Application started with fresh session | 1. Select option 1 (View Balance)<br/>2. Observe displayed balance<br/>3. Select option 4 (Exit) | Displays "Current balance: 1000.00" | | ⚠️ Pending | Initial balance is $1,000.00 per business rule |
| TS2-002 | View balance after credit operation | Account balance is $1,000.00 | 1. Select option 2 (Credit)<br/>2. Enter amount: 500<br/>3. Select option 1 (View Balance)<br/>4. Observe balance | Displays "Current balance: 1500.00" | | ⚠️ Pending | Balance should reflect credit |
| TS2-003 | View balance after debit operation | Account balance is $1,000.00 | 1. Select option 3 (Debit)<br/>2. Enter amount: 250<br/>3. Select option 1 (View Balance)<br/>4. Observe balance | Displays "Current balance: 750.00" | | ⚠️ Pending | Balance should reflect debit |
| TS2-004 | View balance multiple times | Account has active balance | 1. Select option 1<br/>2. Select option 1 again<br/>3. Verify consistency | Both calls return same balance | | ⚠️ Pending | Consistency validation |
| TS2-005 | Menu returns after view balance | View balance displayed | 1. After viewing balance<br/>2. Return to menu | Menu reappears for next operation | | ⚠️ Pending | Control flow verification |

---

## Test Suite 3: Credit Account Operation (Option 2)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS3-001 | Credit basic transaction | Balance: $1,000.00 | 1. Select option 2 (Credit)<br/>2. Input amount: 100<br/>3. Verify response | Displays "Amount credited. New balance: 1100.00" | | ⚠️ Pending | Basic credit functionality |
| TS3-002 | Credit updates balance correctly | Balance: $1,000.00 | 1. Select option 2<br/>2. Input: 500<br/>3. Select option 1 to verify<br/>4. Confirm new balance | Balance updated to 1500.00 | | ⚠️ Pending | Mathematical accuracy |
| TS3-003 | Multiple sequential credits | Balance: $1,000.00 | 1. Credit: 100 → Balance: 1100<br/>2. Credit: 200 → Balance: 1300<br/>3. Credit: 150 → Balance: 1450<br/>4. View balance | Final balance: 1450.00 | | ⚠️ Pending | Cumulative credit validation |
| TS3-004 | Credit with decimal amount | Balance: $1,000.00 | 1. Select option 2<br/>2. Input: 99.99<br/>3. View balance | Balance: 1099.99 | | ⚠️ Pending | Precision: 2 decimal places |
| TS3-005 | Credit with zero amount | Balance: $1,000.00 | 1. Select option 2<br/>2. Input: 0<br/>3. View balance | Balance unchanged: 1000.00 | | ⚠️ Pending | Edge case - zero credit |
| TS3-006 | Credit with large amount | Balance: $1,000.00 | 1. Select option 2<br/>2. Input: 500000<br/>3. View balance | Balance: 500001.00 | | ⚠️ Pending | Maximum balance test |
| TS3-007 | Credit acceptance message | Credit transaction initiated | 1. Select option 2<br/>2. Input amount<br/>3. Observe confirmation message | Message confirms: "Amount credited. New balance: [amount]" | | ⚠️ Pending | User feedback validation |

---

## Test Suite 4: Debit Account Operation (Option 3)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS4-001 | Debit basic transaction | Balance: $1,000.00 | 1. Select option 3 (Debit)<br/>2. Input amount: 100<br/>3. Verify response | Displays "Amount debited. New balance: 900.00" | | ⚠️ Pending | Basic debit functionality |
| TS4-002 | Debit updates balance correctly | Balance: $1,000.00 | 1. Select option 3<br/>2. Input: 250<br/>3. Select option 1 to verify<br/>4. Confirm new balance | Balance updated to 750.00 | | ⚠️ Pending | Mathematical accuracy |
| TS4-003 | Multiple sequential debits | Balance: $1,000.00 | 1. Debit: 100 → Balance: 900<br/>2. Debit: 200 → Balance: 700<br/>3. Debit: 150 → Balance: 550<br/>4. View balance | Final balance: 550.00 | | ⚠️ Pending | Cumulative debit validation |
| TS4-004 | Debit with decimal amount | Balance: $1,000.00 | 1. Select option 3<br/>2. Input: 50.50<br/>3. View balance | Balance: 949.50 | | ⚠️ Pending | Precision: 2 decimal places |
| TS4-005 | Debit exact account balance | Balance: $1,000.00 | 1. Select option 3<br/>2. Input: 1000<br/>3. View balance | Balance: 0.00 | | ⚠️ Pending | Boundary test - zero balance |
| TS4-006 | Debit confirmation message | Debit transaction accepted | 1. Select option 3<br/>2. Input amount<br/>3. Observe confirmation | Message confirms: "Amount debited. New balance: [amount]" | | ⚠️ Pending | User feedback validation |

---

## Test Suite 5: Overdraft Prevention (CRITICAL BUSINESS RULE)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS5-001 | Prevent debit exceeding balance | Balance: $1,000.00 | 1. Select option 3 (Debit)<br/>2. Input: 1001<br/>3. View balance to confirm unchanged | Error: "Insufficient funds for this debit."<br/>Balance remains: 1000.00 | | ⚠️ Pending | **CRITICAL**: No overdrafts allowed |
| TS5-002 | Prevent negative balance - partial | Balance: $1,000.00 | 1. Debit: 600 → Success (Balance: 400)<br/>2. Attempt Debit: 500<br/>3. Verify balance unchanged | First debit succeeds (400.00)<br/>Second debit rejected<br/>Final balance: 400.00 | | ⚠️ Pending | Multi-step overdraft check |
| TS5-003 | Allow debit at boundary | Balance: $1,000.00 | 1. Select option 3<br/>2. Input: 1000 (exact balance)<br/>3. Confirm execution<br/>4. View balance | Debit accepted<br/>Balance: 0.00 | | ⚠️ Pending | Edge case - zero remaining |
| TS5-004 | Prevent debit when zero balance | Balance: $0.00 | 1. Select option 3<br/>2. Input: 1 (any amount)<br/>3. Observe error | Error: "Insufficient funds for this debit."<br/>Balance remains: 0.00 | | ⚠️ Pending | Zero balance protection |
| TS5-005 | Overdraft attempt with decimal | Balance: $100.00 | 1. Select option 3<br/>2. Input: 100.01<br/>3. Observe error | Error: "Insufficient funds for this debit."<br/>Balance remains: 100.00 | | ⚠️ Pending | Precision-based validation |

---

## Test Suite 6: Error Handling and Invalid Input

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS6-001 | Invalid menu choice: 5 | Menu displayed | 1. Input: 5<br/>2. Observe response | Error: "Invalid choice, please select 1-4."<br/>Menu reappears | | ⚠️ Pending | Invalid option handling |
| TS6-002 | Invalid menu choice: 0 | Menu displayed | 1. Input: 0<br/>2. Observe response | Error: "Invalid choice, please select 1-4." | | ⚠️ Pending | Below range validation |
| TS6-003 | Invalid menu choice: negative | Menu displayed | 1. Input: -1<br/>2. Observe response | Error: "Invalid choice, please select 1-4." | | ⚠️ Pending | Negative number rejection |
| TS6-004 | Invalid menu choice: letter | Menu displayed | 1. Input: A (or any letter)<br/>2. Observe response | Error: "Invalid choice, please select 1-4." | | ⚠️ Pending | Non-numeric input handling |
| TS6-005 | Invalid menu choice: symbol | Menu displayed | 1. Input: @ (or any symbol)<br/>2. Observe response | Error: "Invalid choice, please select 1-4." | | ⚠️ Pending | Special character rejection |
| TS6-006 | Recovery from invalid input | Invalid choice entered | 1. Input invalid option<br/>2. Input valid option (1)<br/>3. Verify successful execution | Menu accepts subsequent valid input | | ⚠️ Pending | Error recovery |
| TS6-007 | Multiple invalid inputs | Menu displayed | 1. Input: 5<br/>2. Input: -1<br/>3. Input: A<br/>4. Input: 1 (valid) | Each invalid input shows error<br/>Valid input executes successfully | | ⚠️ Pending | Repeated error handling |

---

## Test Suite 7: Data Persistence and State Management

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS7-001 | Balance persists through operation sequence | Initial balance: $1,000.00 | 1. Credit: 500 → Balance: 1500<br/>2. Debit: 300 → Balance: 1200<br/>3. View balance | Final balance: 1200.00 (correctly accumulated) | | ⚠️ Pending | State persistence validation |
| TS7-002 | Balance persists after view operation | Balance: $1,500.00 | 1. Select option 1 (View Balance)<br/>2. Select option 1 again<br/>3. Perform credit of 100 | Balance remains 1500.00 after view<br/>Credit adds correctly: 1600.00 | | ⚠️ Pending | View doesn't modify state |
| TS7-003 | Sequential operations accumulate | Initial: $1,000.00 | 1. Credit 200 → 1200<br/>2. Credit 100 → 1300<br/>3. Debit 50 → 1250<br/>4. Credit 250 → 1500<br/>5. View | Final: 1500.00 | | ⚠️ Pending | Complex state tracking |
| TS7-004 | Failed debit doesn't change balance | Balance: $100.00 | 1. Attempt Debit: 200 (rejected)<br/>2. View balance | Balance unchanged: 100.00 | | ⚠️ Pending | Transaction atomicity |

---

## Test Suite 8: Application Exit (Option 4)

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS8-001 | Exit from menu | Menu displayed | 1. Select option 4 (Exit) | Message: "Exiting the program. Goodbye!"<br/>Application terminates | | ⚠️ Pending | Graceful termination |
| TS8-002 | Exit after operations | Balance: $1,500.00 (after credit) | 1. Select option 2 (Credit)<br/>2. Enter: 500<br/>3. Select option 4 (Exit) | Credit executes<br/>Exit message displays<br/>Application terminates | | ⚠️ Pending | Clean exit after transaction |
| TS8-003 | Exit preserves final state | Multiple operations performed | 1. Perform credit and debit operations<br/>2. Select option 4<br/>3. Verify logged balance before exit | Exit message displays final balance | | ⚠️ Pending | Final state confirmation |

---

## Test Suite 9: Boundary Value Testing

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS9-001 | Minimum credit ($0.01) | Balance: $1,000.00 | 1. Select option 2<br/>2. Input: 0.01<br/>3. View balance | Balance: 1000.01 | | ⚠️ Pending | Minimum transaction precision |
| TS9-002 | Minimum debit ($0.01) | Balance: $1,000.00 | 1. Select option 3<br/>2. Input: 0.01<br/>3. View balance | Balance: 999.99 | | ⚠️ Pending | Minimum precision validation |
| TS9-003 | Maximum balance value | Balance: $999,998.99 | 1. Select option 2<br/>2. Input: 1.00<br/>3. View balance | Balance: 999999.99 (max PIC 9(6)V99) | | ⚠️ Pending | Upper boundary test |
| TS9-004 | Debit balance to exact zero | Balance: $50.50 | 1. Select option 3<br/>2. Input: 50.50<br/>3. View balance | Balance: 0.00 | | ⚠️ Pending | Zero balance boundary |

---

## Test Suite 10: Integration and End-to-End Workflows

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TS10-001 | Complete business workflow | Fresh application start | 1. View initial balance: 1000<br/>2. Credit: 500 → 1500<br/>3. View: 1500<br/>4. Debit: 750 → 750<br/>5. View: 750<br/>6. Exit | All steps execute correctly<br/>Final balance: 750.00 | | ⚠️ Pending | Full user journey |
| TS10-002 | Overdraft recovery workflow | Balance: $500.00 | 1. Attempt overdraft: Debit 1000 (rejected)<br/>2. Verify balance: 500<br/>3. Valid debit: 300<br/>4. View: 200 | Overdraft rejected<br/>Recovery with valid debit succeeds<br/>Final: 200.00 | | ⚠️ Pending | Error handling + recovery |
| TS10-003 | Mixed operations workflow | Initial: $1,000 | 1. Credit: 100 → 1100<br/>2. Debit: 50 → 1050<br/>3. Credit: 250 → 1300<br/>4. Debit: 200 → 1100<br/>5. View: 1100 | All calculations correct<br/>Final balance: 1100.00 | | ⚠️ Pending | Complex transaction flow |
| TS10-004 | Repeated menu cycling | Menu operational | 1. Cycle through options: 1,2,3,1,2,1<br/>2. Each with valid execution<br/>3. Exit at end | All operations execute sequentially<br/>Menu returns after each<br/>Exit terminates cleanly | | ⚠️ Pending | Menu stability |

---

## Summary

### Test Statistics
- **Total Test Cases:** 39
- **Test Suites:** 10
- **Functional Tests:** 24
- **Boundary Tests:** 4
- **Error Handling Tests:** 7
- **Integration Tests:** 4

### Test Coverage by Feature

| Feature | Test Cases | Coverage |
|---------|-----------|----------|
| Menu Navigation | TS1-001 to 003 | 3 |
| View Balance | TS2-001 to 005 | 5 |
| Credit Account | TS3-001 to 007 | 7 |
| Debit Account | TS4-001 to 006 | 6 |
| Overdraft Prevention | TS5-001 to 005 | 5 (**CRITICAL**) |
| Error Handling | TS6-001 to 007 | 7 |
| Data Persistence | TS7-001 to 004 | 4 |
| Exit Function | TS8-001 to 003 | 3 |
| Boundary Values | TS9-001 to 004 | 4 |
| Integration | TS10-001 to 004 | 4 |

### Critical Business Rules Validated

1. **Initial Balance:** $1,000.00 per account (TS2-001)
2. **Overdraft Prevention:** No negative balances allowed (TS5-001 to 005) ⚠️ **CRITICAL**
3. **Precision:** All amounts use 2 decimal places (TS3-004, TS4-004, TS9-001, TS9-002)
4. **State Persistence:** Balance maintains across operations (TS7-001 to 004)
5. **Input Validation:** Invalid menu choices rejected (TS6-001 to 007)
6. **Atomicity:** Failed transactions don't modify state (TS7-004)

---

## Acceptance Criteria for Node.js Migration

All test cases must meet the following acceptance criteria in the Node.js implementation:

✓ All 39 test cases pass without modifications to test logic  
✓ Overdraft prevention functions identically (TS5 suite - CRITICAL)  
✓ All balance calculations produce identical results  
✓ Error messages contain equivalent information  
✓ State persistence behavior matches COBOL implementation  
✓ No additional features introduced in initial migration (lift-and-shift)  

---

## Notes for Node.js Development Team

- Use this test plan as the source of truth for business logic
- Implement unit tests covering each test case
- Implement integration tests for multi-step workflows (TS10)
- Pay special attention to TS5 (Overdraft Prevention) - CRITICAL
- Maintain identical decimal precision (2 places) as COBOL implementation
- Consider test automation for regression testing
- Reference data accuracy: Initial balance is always $1,000.00

