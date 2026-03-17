/**
 * Unit Tests for Student Account Management System
 * Mirrors scenarios from docs/TESTPLAN.md
 * 
 * Test Coverage:
 * - TS1: Application Startup and Menu Navigation (3 tests)
 * - TS2: View Balance Operation (5 tests)
 * - TS3: Credit Account Operation (7 tests)
 * - TS4: Debit Account Operation (6 tests)
 * - TS5: Overdraft Prevention - CRITICAL (5 tests)
 * - TS6: Error Handling and Invalid Input (7 tests)
 * - TS7: Data Persistence and State Management (4 tests)
 * - TS8: Application Exit (3 tests - conceptual, addressed in integration)
 * - TS9: Boundary Value Testing (4 tests)
 * - TS10: Integration and End-to-End Workflows (4 tests)
 * 
 * Total: 39 Test Cases
 */

const { DataLayer, OperationsLayer, UILayer } = require('../index.js');

// =============================================================================
// TEST SUITE 1: Application Startup and Menu Navigation (TS1)
// =============================================================================

describe('TS1: Application Startup and Menu Navigation', () => {
  
  test('TS1-001: Application initializes with DataLayer', () => {
    // TS1-001: Application launches successfully
    // Expected: Application initializes without errors
    const dataLayer = new DataLayer();
    expect(dataLayer).toBeDefined();
    expect(dataLayer.read()).toBe(1000.00);
  });

  test('TS1-002: OperationsLayer initializes with menu options available', () => {
    // TS1-002: Menu displays all operations
    // Expected: Operations layer ready for menu options (1-4)
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    expect(operationsLayer).toBeDefined();
    expect(operationsLayer.viewBalance).toBeDefined();
    expect(operationsLayer.creditAccount).toBeDefined();
    expect(operationsLayer.debitAccount).toBeDefined();
  });

  test('TS1-003: UILayer initializes and menu processing works', () => {
    // TS1-003: Menu accepts user input
    // Expected: UILayer initializes properly
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);
    expect(uiLayer).toBeDefined();
    expect(uiLayer.processChoice).toBeDefined();
  });
});

// =============================================================================
// TEST SUITE 2: View Balance Operation (TS2)
// =============================================================================

describe('TS2: View Balance Operation', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS2-001: View initial account balance is $1,000.00', () => {
    // Expected: Initial balance is $1,000.00 per business rule
    const balance = dataLayer.read();
    expect(balance).toBe(1000.00);
  });

  test('TS2-002: View balance after credit operation reflects updated balance', () => {
    // TS2-002: View balance after credit
    // Steps: Credit 500, then view balance
    // Expected: Balance shows 1500.00
    operationsLayer.creditAccount(500);
    const balance = dataLayer.read();
    expect(balance).toBe(1500.00);
  });

  test('TS2-003: View balance after debit operation reflects deducted amount', () => {
    // TS2-003: View balance after debit
    // Steps: Debit 250, then view balance
    // Expected: Balance shows 750.00
    operationsLayer.debitAccount(250);
    const balance = dataLayer.read();
    expect(balance).toBe(750.00);
  });

  test('TS2-004: Multiple view operations return consistent balance', () => {
    // TS2-004: View balance multiple times
    // Expected: Both calls return same balance
    const balance1 = operationsLayer.viewBalance();
    const balance2 = operationsLayer.viewBalance();
    expect(balance1).toBe(balance2);
    expect(balance1).toBe(1000.00);
  });

  test('TS2-005: View operation does not modify balance state', () => {
    // TS2-005: View doesn't change state
    // Expected: Balance unchanged after view
    operationsLayer.creditAccount(100);
    const beforeView = dataLayer.read();
    operationsLayer.viewBalance();
    const afterView = dataLayer.read();
    expect(beforeView).toBe(afterView);
    expect(afterView).toBe(1100.00);
  });
});

// =============================================================================
// TEST SUITE 3: Credit Account Operation (TS3)
// =============================================================================

describe('TS3: Credit Account Operation', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS3-001: Credit basic transaction - add $100 to $1,000', () => {
    // TS3-001: Credit basic transaction
    // Expected: Balance updated to 1100.00, success message
    const result = operationsLayer.creditAccount(100);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(1100.00);
    expect(result.message).toContain('Amount credited');
    expect(result.message).toContain('1100.00');
  });

  test('TS3-002: Credit updates balance correctly - $500 credit', () => {
    // TS3-002: Credit updates balance correctly
    // Expected: Balance updated to 1500.00
    operationsLayer.creditAccount(500);
    expect(dataLayer.read()).toBe(1500.00);
  });

  test('TS3-003: Multiple sequential credits accumulate correctly', () => {
    // TS3-003: Multiple sequential credits
    // Steps: Credit 100, 200, 150 sequentially
    // Expected: Final balance 1450.00
    operationsLayer.creditAccount(100);
    expect(dataLayer.read()).toBe(1100.00);
    operationsLayer.creditAccount(200);
    expect(dataLayer.read()).toBe(1300.00);
    operationsLayer.creditAccount(150);
    expect(dataLayer.read()).toBe(1450.00);
  });

  test('TS3-004: Credit with decimal precision ($99.99)', () => {
    // TS3-004: Credit with decimal amount
    // Expected: Balance 1099.99 (2 decimal precision)
    const result = operationsLayer.creditAccount(99.99);
    expect(result.newBalance).toBe(1099.99);
    expect(dataLayer.read()).toBe(1099.99);
  });

  test('TS3-005: Credit with zero amount leaves balance unchanged', () => {
    // TS3-005: Credit with zero amount
    // Expected: Balance unchanged at 1000.00
    const result = operationsLayer.creditAccount(0);
    expect(result.success).toBe(true);
    expect(dataLayer.read()).toBe(1000.00);
  });

  test('TS3-006: Credit with large amount ($500,000)', () => {
    // TS3-006: Credit with large amount
    // Expected: Balance 500,001.00
    const result = operationsLayer.creditAccount(500000);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(500001.00);
  });

  test('TS3-007: Credit confirmation message includes new balance', () => {
    // TS3-007: Credit acceptance message
    // Expected: Message confirms transaction
    const result = operationsLayer.creditAccount(250);
    expect(result.message).toContain('Amount credited');
    expect(result.message).toContain('New balance: 1250.00');
  });
});

// =============================================================================
// TEST SUITE 4: Debit Account Operation (TS4)
// =============================================================================

describe('TS4: Debit Account Operation', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS4-001: Debit basic transaction - withdraw $100', () => {
    // TS4-001: Debit basic transaction
    // Expected: Balance updated to 900.00, success message
    const result = operationsLayer.debitAccount(100);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(900.00);
    expect(result.message).toContain('Amount debited');
    expect(result.message).toContain('900.00');
  });

  test('TS4-002: Debit updates balance correctly - $250 debit', () => {
    // TS4-002: Debit updates balance correctly
    // Expected: Balance updated to 750.00
    operationsLayer.debitAccount(250);
    expect(dataLayer.read()).toBe(750.00);
  });

  test('TS4-003: Multiple sequential debits accumulate correctly', () => {
    // TS4-003: Multiple sequential debits
    // Steps: Debit 100, 200, 150 sequentially
    // Expected: Final balance 550.00
    operationsLayer.debitAccount(100);
    expect(dataLayer.read()).toBe(900.00);
    operationsLayer.debitAccount(200);
    expect(dataLayer.read()).toBe(700.00);
    operationsLayer.debitAccount(150);
    expect(dataLayer.read()).toBe(550.00);
  });

  test('TS4-004: Debit with decimal precision ($50.50)', () => {
    // TS4-004: Debit with decimal amount
    // Expected: Balance 949.50
    const result = operationsLayer.debitAccount(50.50);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(949.50);
  });

  test('TS4-005: Debit exact account balance - debit $1000.00', () => {
    // TS4-005: Debit exact account balance
    // Expected: Balance becomes 0.00
    const result = operationsLayer.debitAccount(1000);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(0.00);
  });

  test('TS4-006: Debit confirmation message includes new balance', () => {
    // TS4-006: Debit confirmation message
    // Expected: Message confirms transaction
    const result = operationsLayer.debitAccount(300);
    expect(result.message).toContain('Amount debited');
    expect(result.message).toContain('New balance: 700.00');
  });
});

// =============================================================================
// TEST SUITE 5: Overdraft Prevention - CRITICAL BUSINESS RULE (TS5)
// =============================================================================

describe('TS5: Overdraft Prevention (CRITICAL)', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS5-001: CRITICAL - Prevent debit exceeding balance ($1,001 > $1,000)', () => {
    // TS5-001: Prevent debit exceeding balance
    // Expected: Transaction rejected, error message, balance unchanged
    const result = operationsLayer.debitAccount(1001);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient funds');
    expect(dataLayer.read()).toBe(1000.00); // Balance unchanged
  });

  test('TS5-002: CRITICAL - Prevent negative balance in multi-step scenario', () => {
    // TS5-002: Prevent negative balance - partial debit then overdraft attempt
    // Steps: Debit 600 (success), then attempt Debit 500 (failure)
    // Expected: First succeeds (400.00), second rejected, final 400.00
    const result1 = operationsLayer.debitAccount(600);
    expect(result1.success).toBe(true);
    expect(dataLayer.read()).toBe(400.00);

    const result2 = operationsLayer.debitAccount(500);
    expect(result2.success).toBe(false);
    expect(result2.message).toContain('Insufficient funds');
    expect(dataLayer.read()).toBe(400.00); // Balance unchanged
  });

  test('TS5-003: CRITICAL - Allow debit at boundary (exact balance $1,000)', () => {
    // TS5-003: Allow debit at boundary
    // Expected: Debit accepted, balance becomes 0.00
    const result = operationsLayer.debitAccount(1000);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(0.00);
  });

  test('TS5-004: CRITICAL - Prevent any debit when balance is zero', () => {
    // TS5-004: Prevent debit when balance is zero
    // Setup: Debit to zero first
    operationsLayer.debitAccount(1000);
    expect(dataLayer.read()).toBe(0.00);

    // Attempt any withdrawal
    const result = operationsLayer.debitAccount(1);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient funds');
    expect(dataLayer.read()).toBe(0.00);
  });

  test('TS5-005: CRITICAL - Prevent overdraft with decimal precision ($100.01 > $100)', () => {
    // TS5-005: Overdraft attempt with decimal precision
    // Setup: Debit to $100.00
    operationsLayer.debitAccount(900);
    expect(dataLayer.read()).toBe(100.00);

    // Attempt to debit $100.01 (exceeds by $0.01)
    const result = operationsLayer.debitAccount(100.01);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient funds');
    expect(dataLayer.read()).toBe(100.00); // Balance unchanged
  });
});

// =============================================================================
// TEST SUITE 6: Error Handling and Invalid Input (TS6)
// =============================================================================

describe('TS6: Error Handling and Invalid Input', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS6-001: Invalid amount - negative credit rejected', () => {
    // TS6-001: Error handling for invalid input
    // Expected: Operation fails with error message
    const result = operationsLayer.creditAccount(-100);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid amount');
  });

  test('TS6-002: Invalid amount - negative debit rejected', () => {
    // TS6-002: Error handling for negative debit
    // Expected: Operation fails
    const result = operationsLayer.debitAccount(-100);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid amount');
  });

  test('TS6-003: Invalid amount - NaN (non-numeric) rejected', () => {
    // TS6-003: Non-numeric input handling
    // Expected: Operation fails
    const result = operationsLayer.creditAccount(NaN);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid amount');
  });

  test('TS6-004: UILayer processChoice handles invalid menu option 5', () => {
    // TS6-004: Invalid menu choice: 5 (out of range)
    // Expected: No error thrown (menu loop continues)
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);
    expect(() => uiLayer.processChoice('5')).not.toThrow();
  });

  test('TS6-005: UILayer processChoice handles invalid menu option 0', () => {
    // TS6-005: Invalid menu choice: 0 (below range)
    expect(() => {
      const dataLayer = new DataLayer();
      const operationsLayer = new OperationsLayer(dataLayer);
      const uiLayer = new UILayer(operationsLayer);
      uiLayer.processChoice('0');
    }).not.toThrow();
  });

  test('TS6-006: UILayer processChoice handles non-numeric menu choice', () => {
    // TS6-006: Invalid menu choice: letter
    expect(() => {
      const dataLayer = new DataLayer();
      const operationsLayer = new OperationsLayer(dataLayer);
      const uiLayer = new UILayer(operationsLayer);
      uiLayer.processChoice('A');
    }).not.toThrow();
  });

  test('TS6-007: Error recovery - valid operation succeeds after invalid input', () => {
    // TS6-007: Recovery from invalid input
    // Expected: System accepts valid operation after invalid one
    operationsLayer.creditAccount(-100); // Invalid
    const result = operationsLayer.creditAccount(100); // Valid
    expect(result.success).toBe(true);
    expect(dataLayer.read()).toBe(1100.00);
  });
});

// =============================================================================
// TEST SUITE 7: Data Persistence and State Management (TS7)
// =============================================================================

describe('TS7: Data Persistence and State Management', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS7-001: Balance persists through operation sequence', () => {
    // TS7-001: State persistence through operations
    // Steps: Credit 500 → Debit 300 → Verify final
    // Expected: Final 1200.00
    operationsLayer.creditAccount(500);
    operationsLayer.debitAccount(300);
    const balance = dataLayer.read();
    expect(balance).toBe(1200.00);
  });

  test('TS7-002: Balance persists after view operation (read-only)', () => {
    // TS7-002: View operation doesn't modify state
    // Steps: Credit 500, view, verify balance, credit 100
    operationsLayer.creditAccount(500);
    expect(dataLayer.read()).toBe(1500.00);
    operationsLayer.viewBalance();
    operationsLayer.creditAccount(100);
    expect(dataLayer.read()).toBe(1600.00);
  });

  test('TS7-003: Sequential operations accumulate correctly (complex scenario)', () => {
    // TS7-003: Complex state tracking
    // Steps: Credit 200, 100; Debit 50; Credit 250
    // Expected: 1500.00
    operationsLayer.creditAccount(200);
    expect(dataLayer.read()).toBe(1200.00);
    operationsLayer.creditAccount(100);
    expect(dataLayer.read()).toBe(1300.00);
    operationsLayer.debitAccount(50);
    expect(dataLayer.read()).toBe(1250.00);
    operationsLayer.creditAccount(250);
    expect(dataLayer.read()).toBe(1500.00);
  });

  test('TS7-004: Failed debit does not modify balance (atomicity)', () => {
    // TS7-004: Failed transaction doesn't change state
    // Setup: Reduce balance to 100, attempt overdraft
    operationsLayer.debitAccount(900);
    expect(dataLayer.read()).toBe(100.00);

    // Attempt overdraft (should fail)
    const result = operationsLayer.debitAccount(200);
    expect(result.success).toBe(false);
    expect(dataLayer.read()).toBe(100.00); // Unchanged
  });
});

// =============================================================================
// TEST SUITE 8: Application Exit (TS8)
// =============================================================================

describe('TS8: Application Exit', () => {
  test('TS8-001: UILayer processChoice returns true for exit option', () => {
    // TS8-001: Exit from menu
    // Expected: processChoice returns true (exit signal)
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);
    const shouldExit = uiLayer.processChoice('4');
    expect(shouldExit).toBe(true);
  });

  test('TS8-002: UILayer processChoice returns false for non-exit options', () => {
    // TS8-002: Normal operations return false (continue loop)
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);
    expect(uiLayer.processChoice('1')).toBe(false); // View Balance
    expect(uiLayer.processChoice('2')).toBe(false); // Credit
    expect(uiLayer.processChoice('3')).toBe(false); // Debit
  });

  test('TS8-003: Exit can occur after successful operations', () => {
    // TS8-003: Exit after operations preserves state
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);
    
    operationsLayer.creditAccount(500);
    expect(dataLayer.read()).toBe(1500.00);
    
    const shouldExit = uiLayer.processChoice('4');
    expect(shouldExit).toBe(true);
    expect(dataLayer.read()).toBe(1500.00); // Final state preserved
  });
});

// =============================================================================
// TEST SUITE 9: Boundary Value Testing (TS9)
// =============================================================================

describe('TS9: Boundary Value Testing', () => {
  let dataLayer, operationsLayer;

  beforeEach(() => {
    dataLayer = new DataLayer();
    operationsLayer = new OperationsLayer(dataLayer);
  });

  test('TS9-001: Minimum credit amount ($0.01)', () => {
    // TS9-001: Minimum credit ($0.01)
    // Expected: Balance 1000.01
    const result = operationsLayer.creditAccount(0.01);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(1000.01);
  });

  test('TS9-002: Minimum debit amount ($0.01)', () => {
    // TS9-002: Minimum debit ($0.01)
    // Expected: Balance 999.99
    const result = operationsLayer.debitAccount(0.01);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(999.99);
  });

  test('TS9-003: Maximum balance value approach', () => {
    // TS9-003: Large balance credit
    // Expected: Balance can reach high values (999999.99 for PIC 9(6)V99 equivalent)
    operationsLayer.creditAccount(999998.99); // Add significant amount
    const balance = dataLayer.read();
    expect(balance).toBe(1000000.99); // Sum
  });

  test('TS9-004: Debit to exact zero boundary', () => {
    // TS9-004: Debit balance to exact zero
    // Setup: Create balance of 50.50, debit it
    operationsLayer.debitAccount(949.50);
    const result = operationsLayer.debitAccount(50.50);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(0.00);
  });
});

// =============================================================================
// TEST SUITE 10: Integration and End-to-End Workflows (TS10)
// =============================================================================

describe('TS10: Integration and End-to-End Workflows', () => {
  
  test('TS10-001: Complete business workflow (view → credit → debit → exit)', () => {
    // TS10-001: Full user journey
    // Steps: View (1000) → Credit 500 (1500) → Debit 750 (750) → View (750) → Exit
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);

    // View initial balance
    const view1 = operationsLayer.viewBalance();
    expect(view1).toBe(1000.00);

    // Credit
    const credit = operationsLayer.creditAccount(500);
    expect(credit.success).toBe(true);
    expect(dataLayer.read()).toBe(1500.00);

    // Debit
    const debit = operationsLayer.debitAccount(750);
    expect(debit.success).toBe(true);
    expect(dataLayer.read()).toBe(750.00);

    // View final
    const view2 = operationsLayer.viewBalance();
    expect(view2).toBe(750.00);

    // Exit
    const shouldExit = uiLayer.processChoice('4');
    expect(shouldExit).toBe(true);
  });

  test('TS10-002: Overdraft recovery workflow', () => {
    // TS10-002: Error handling + recovery
    // Setup balance to 500, attempt overdraft, recover with valid debit
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);

    operationsLayer.debitAccount(500); // 500.00 remaining
    expect(dataLayer.read()).toBe(500.00);

    // Attempt overdraft
    const overdraft = operationsLayer.debitAccount(1000);
    expect(overdraft.success).toBe(false);
    expect(dataLayer.read()).toBe(500.00);

    // Valid debit
    const validDebit = operationsLayer.debitAccount(300);
    expect(validDebit.success).toBe(true);
    expect(dataLayer.read()).toBe(200.00);
  });

  test('TS10-003: Mixed operations workflow (complex scenario)', () => {
    // TS10-003: Complex transaction flow
    // Initial: 1000 → Credit 100 (1100) → Debit 50 (1050) → Credit 250 (1300) → Debit 200 (1100)
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);

    expect(dataLayer.read()).toBe(1000.00);
    operationsLayer.creditAccount(100);
    expect(dataLayer.read()).toBe(1100.00);
    operationsLayer.debitAccount(50);
    expect(dataLayer.read()).toBe(1050.00);
    operationsLayer.creditAccount(250);
    expect(dataLayer.read()).toBe(1300.00);
    operationsLayer.debitAccount(200);
    expect(dataLayer.read()).toBe(1100.00);
  });

  test('TS10-004: Menu cycling with multiple operations', () => {
    // TS10-004: Repeated menu operations
    // Cycle: option 1 (view) → 2 (credit) → 3 (debit) → 1 (view) → 4 (exit)
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const uiLayer = new UILayer(operationsLayer);

    // Menu option 1: View
    expect(uiLayer.processChoice('1')).toBe(false);

    // Menu option 2: Credit
    operationsLayer.creditAccount(100);
    expect(uiLayer.processChoice('2')).toBe(false);

    // Menu option 3: Debit
    operationsLayer.debitAccount(50);
    expect(uiLayer.processChoice('3')).toBe(false);

    // Menu option 1: View again
    expect(uiLayer.processChoice('1')).toBe(false);

    // Menu option 4: Exit
    const shouldExit = uiLayer.processChoice('4');
    expect(shouldExit).toBe(true);

    // Verify final state
    expect(dataLayer.read()).toBe(1050.00);
  });
});

// =============================================================================
// SUMMARY TEST - Verify all critical business rules
// =============================================================================

describe('Summary: Critical Business Rules Validation', () => {
  
  test('Business Rule 1: Initial balance is $1,000.00', () => {
    const dataLayer = new DataLayer();
    expect(dataLayer.read()).toBe(1000.00);
  });

  test('Business Rule 2: Overdraft prevention enforced', () => {
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    const result = operationsLayer.debitAccount(1001);
    expect(result.success).toBe(false);
    expect(dataLayer.read()).toBe(1000.00);
  });

  test('Business Rule 3: Decimal precision maintained (2 places)', () => {
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    operationsLayer.creditAccount(99.99);
    expect(dataLayer.getFormattedBalance()).toBe('1099.99');
    expect(dataLayer.read()).toBe(1099.99);
  });

  test('Business Rule 4: Balance persistence across operations', () => {
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    operationsLayer.creditAccount(500);
    operationsLayer.debitAccount(250);
    expect(dataLayer.read()).toBe(1250.00);
  });

  test('Business Rule 5: Failed transactions do not modify state', () => {
    const dataLayer = new DataLayer();
    const operationsLayer = new OperationsLayer(dataLayer);
    operationsLayer.debitAccount(900); // 100.00 left
    const failedResult = operationsLayer.debitAccount(200);
    expect(failedResult.success).toBe(false);
    expect(dataLayer.read()).toBe(100.00);
  });
});
