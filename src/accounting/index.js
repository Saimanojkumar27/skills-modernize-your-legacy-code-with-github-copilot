#!/usr/bin/env node

/**
 * Student Account Management System
 * Node.js Conversion from COBOL Legacy Application
 * 
 * Purpose: Manage student financial accounts with operations for viewing balance,
 *          crediting (deposits), and debiting (withdrawals) with overdraft prevention.
 * 
 * Architecture:
 *   - DataLayer: Manages persistent account balance (equivalent to data.cob)
 *   - OperationsLayer: Implements business logic (equivalent to operations.cob)
 *   - UILayer: Menu-driven interface (equivalent to main.cob)
 */

const readlineSync = require('readline-sync');

// =============================================================================
// DATA LAYER - Manages account balance persistence
// Equivalent to: data.cob (DataProgram)
// =============================================================================

class DataLayer {
  constructor() {
    // Initial balance: $1,000.00 (Business Rule from COBOL)
    this.storageBalance = 1000.00;
  }

  /**
   * Read operation - Retrieve current balance
   * @returns {number} Current account balance
   */
  read() {
    return this.storageBalance;
  }

  /**
   * Write operation - Update account balance
   * @param {number} newBalance - The new balance to store
   */
  write(newBalance) {
    this.storageBalance = newBalance;
  }

  /**
   * Get current balance with proper formatting
   * @returns {string} Formatted balance
   */
  getFormattedBalance() {
    return this.storageBalance.toFixed(2);
  }
}

// =============================================================================
// OPERATIONS LAYER - Business logic for account operations
// Equivalent to: operations.cob (Operations program)
// =============================================================================

class OperationsLayer {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
  }

  /**
   * TOTAL Operation: View current account balance
   * Equivalent to COBOL: IF OPERATION-TYPE = 'TOTAL'
   */
  viewBalance() {
    const balance = this.dataLayer.read();
    console.log(`\nCurrent balance: ${balance.toFixed(2)}`);
    return balance;
  }

  /**
   * CREDIT Operation: Deposit funds to account
   * Equivalent to COBOL: IF OPERATION-TYPE = 'CREDIT'
   * 
   * @param {number} amount - Amount to credit (deposit)
   * @returns {object} {success: boolean, newBalance: number, message: string}
   */
  creditAccount(amount) {
    try {
      // Validate input
      if (isNaN(amount) || amount < 0) {
        return {
          success: false,
          message: "Invalid amount. Please enter a positive number.",
          newBalance: null
        };
      }

      // Get current balance
      let balance = this.dataLayer.read();

      // Add credit amount (equivalent to COBOL: ADD AMOUNT TO FINAL-BALANCE)
      balance += parseFloat(amount);

      // Update storage (equivalent to COBOL: CALL 'DataProgram' USING 'WRITE')
      this.dataLayer.write(balance);

      return {
        success: true,
        newBalance: balance,
        message: `Amount credited. New balance: ${balance.toFixed(2)}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error processing credit: ${error.message}`,
        newBalance: null
      };
    }
  }

  /**
   * DEBIT Operation: Withdraw funds from account
   * Equivalent to COBOL: IF OPERATION-TYPE = 'DEBIT'
   * 
   * Business Rule: Overdraft Prevention
   * - Cannot withdraw more than available balance
   * - If insufficient funds, transaction is rejected
   * 
   * @param {number} amount - Amount to debit (withdraw)
   * @returns {object} {success: boolean, newBalance: number, message: string}
   */
  debitAccount(amount) {
    try {
      // Validate input
      if (isNaN(amount) || amount < 0) {
        return {
          success: false,
          message: "Invalid amount. Please enter a positive number.",
          newBalance: null
        };
      }

      // Get current balance
      let balance = this.dataLayer.read();

      // CRITICAL BUSINESS RULE: Check for sufficient funds
      // Equivalent to COBOL: IF FINAL-BALANCE >= AMOUNT
      if (balance < amount) {
        return {
          success: false,
          message: "Insufficient funds for this debit.",
          newBalance: balance
        };
      }

      // Subtract debit amount (equivalent to COBOL: SUBTRACT AMOUNT FROM FINAL-BALANCE)
      balance -= parseFloat(amount);

      // Update storage (equivalent to COBOL: CALL 'DataProgram' USING 'WRITE')
      this.dataLayer.write(balance);

      return {
        success: true,
        newBalance: balance,
        message: `Amount debited. New balance: ${balance.toFixed(2)}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error processing debit: ${error.message}`,
        newBalance: null
      };
    }
  }
}

// =============================================================================
// UI LAYER - Menu-driven user interface
// Equivalent to: main.cob (MainProgram)
// =============================================================================

class UILayer {
  constructor(operationsLayer) {
    this.operationsLayer = operationsLayer;
  }

  /**
   * Display main menu and options
   * Equivalent to COBOL: DISPLAY menu options
   */
  displayMenu() {
    console.log("\n--------------------------------");
    console.log("Account Management System");
    console.log("1. View Balance");
    console.log("2. Credit Account");
    console.log("3. Debit Account");
    console.log("4. Exit");
    console.log("--------------------------------");
  }

  /**
   * Get user menu choice with validation
   * Equivalent to COBOL: ACCEPT USER-CHOICE and EVALUATE
   * 
   * @returns {number} User's menu choice (1-4)
   */
  getUserChoice() {
    const choice = readlineSync.question("Enter your choice (1-4): ");
    return choice.trim();
  }

  /**
   * Get numeric input from user (for transaction amounts)
   * 
   * @param {string} prompt - Prompt message
   * @returns {number} User input as number
   */
  getNumericInput(prompt) {
    const input = readlineSync.question(prompt);
    return parseFloat(input);
  }

  /**
   * Process user menu choice and execute corresponding operation
   * Equivalent to COBOL: EVALUATE USER-CHOICE with WHEN clauses
   * 
   * @param {string} choice - User's menu choice
   * @returns {boolean} True if user chose to exit, false otherwise
   */
  processChoice(choice) {
    switch (choice) {
      // Option 1: View Balance
      case '1':
        this.operationsLayer.viewBalance();
        break;

      // Option 2: Credit Account
      case '2':
        const creditAmount = this.getNumericInput("Enter credit amount: ");
        const creditResult = this.operationsLayer.creditAccount(creditAmount);
        console.log(`\n${creditResult.message}`);
        break;

      // Option 3: Debit Account
      case '3':
        const debitAmount = this.getNumericInput("Enter debit amount: ");
        const debitResult = this.operationsLayer.debitAccount(debitAmount);
        console.log(`\n${debitResult.message}`);
        break;

      // Option 4: Exit
      case '4':
        console.log("Exiting the program. Goodbye!");
        return true; // Signal to exit

      // Invalid choice
      default:
        console.log("Invalid choice, please select 1-4.");
        break;
    }

    return false; // Continue loop
  }

  /**
   * Main application loop
   * Equivalent to COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
   */
  run() {
    let shouldExit = false;

    while (!shouldExit) {
      this.displayMenu();
      const choice = this.getUserChoice();
      shouldExit = this.processChoice(choice);
    }
  }
}

// =============================================================================
// APPLICATION INITIALIZATION
// Entry point equivalent to COBOL: IDENTIFICATION DIVISION > PROGRAM-ID. MainProgram
// =============================================================================

function main() {
  // Initialize layers following data flow diagram:
  // User → UI Layer → Operations Layer → Data Layer → Storage
  const dataLayer = new DataLayer();
  const operationsLayer = new OperationsLayer(dataLayer);
  const uiLayer = new UILayer(operationsLayer);

  // Start the application loop
  uiLayer.run();
}

// Run application if executed directly
if (require.main === module) {
  main();
}

// Export classes for unit testing
module.exports = {
  DataLayer,
  OperationsLayer,
  UILayer
};
