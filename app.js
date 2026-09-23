/**
 * Simple Calculator — Application Logic
 * Phase 3 to Phase 6: Complete Logic Engine, Precision Formatting, Keyboard Shortcuts & Dynamic Display Scaling
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------
  // 1. DOM Elements & Maps
  // ------------------------------------------
  const primaryDisplay = document.getElementById('primary-display');
  const secondaryDisplay = document.getElementById('secondary-display');
  const clearBtn = document.getElementById('btn-clear');
  const calculatorGrid = document.querySelector('.calculator-grid');
  const operatorButtons = document.querySelectorAll('.btn-operator');

  // Button reference map for keyboard shortcut visual triggers
  const buttonMap = {};
  document.querySelectorAll('.btn').forEach((btn) => {
    const action = btn.getAttribute('data-action');
    const val = btn.getAttribute('data-value');
    if (val !== null) {
      buttonMap[val] = btn;
    } else if (action) {
      buttonMap[action] = btn;
    }
  });

  // ------------------------------------------
  // 2. Calculator State Model
  // ------------------------------------------
  const state = {
    currentValue: '0',              // Current string in primary display
    previousValue: null,            // Stored number for calculation
    operator: null,                 // Active operator symbol (+, -, *, /)
    waitingForSecondOperand: false, // Flag indicating next digit replaces primary display
    isError: false,                 // Error flag (e.g., division by zero)
    lastOperand: null,              // Last operand used for repeated '=' execution
    lastOperator: null,             // Last operator used for repeated '=' execution
  };

  // ------------------------------------------
  // 3. UI Render & Display Helpers
  // ------------------------------------------
  /**
   * Updates display elements and button states based on current state.
   */
  function updateDisplay() {
    if (state.isError) {
      primaryDisplay.classList.add('error-text');
      primaryDisplay.textContent = state.currentValue;
      secondaryDisplay.textContent = '';
      clearBtn.textContent = 'AC';
      clearBtn.setAttribute('aria-label', 'Clear All (AC)');
      
      operatorButtons.forEach((btn) => btn.classList.remove('is-active'));
      return;
    }

    primaryDisplay.classList.remove('error-text');
    primaryDisplay.textContent = state.currentValue;

    // Phase 6: Dynamic Font Auto-Scaling
    adjustDisplayFontSize();

    // Build secondary display running expression
    if (state.previousValue !== null && state.operator) {
      const displayOp = getDisplayOperator(state.operator);
      if (state.waitingForSecondOperand) {
        secondaryDisplay.textContent = `${formatDisplayNumber(state.previousValue)} ${displayOp}`;
      } else {
        secondaryDisplay.textContent = `${formatDisplayNumber(state.previousValue)} ${displayOp} ${state.currentValue}`;
      }
    } else {
      secondaryDisplay.textContent = '';
    }

    // Update Clear Button text (C vs AC)
    if (state.currentValue === '0' && state.previousValue === null) {
      clearBtn.textContent = 'AC';
      clearBtn.setAttribute('aria-label', 'Clear All (AC)');
    } else {
      clearBtn.textContent = 'C';
      clearBtn.setAttribute('aria-label', 'Clear Entry (C)');
    }

    // Highlight active operator button
    operatorButtons.forEach((btn) => {
      const btnOp = btn.getAttribute('data-value');
      if (state.operator === btnOp && state.waitingForSecondOperand) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  /**
   * Phase 6: Dynamic Font Auto-Scaling to prevent layout breakage or text overflow.
   */
  function adjustDisplayFontSize() {
    primaryDisplay.classList.remove('font-small', 'font-xsmall', 'font-micro');

    // First check string length for immediate class application
    const len = state.currentValue.length;
    if (len > 15) {
      primaryDisplay.classList.add('font-micro');
    } else if (len > 11) {
      primaryDisplay.classList.add('font-xsmall');
    } else if (len > 8) {
      primaryDisplay.classList.add('font-small');
    }

    // Precision measurement check using scrollWidth vs clientWidth
    if (primaryDisplay.scrollWidth > primaryDisplay.clientWidth) {
      if (!primaryDisplay.classList.contains('font-small')) {
        primaryDisplay.classList.add('font-small');
      } else if (!primaryDisplay.classList.contains('font-xsmall')) {
        primaryDisplay.classList.add('font-xsmall');
      } else if (!primaryDisplay.classList.contains('font-micro')) {
        primaryDisplay.classList.add('font-micro');
      }
    }
  }

  /**
   * Maps internal operator keys to user-facing unicode symbols.
   */
  function getDisplayOperator(op) {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return '';
    }
  }

  /**
   * Helper to format numbers cleanly for display.
   */
  function formatDisplayNumber(num) {
    if (typeof num === 'string') return num;
    if (isNaN(num)) return 'Error';
    return String(num);
  }

  /**
   * Formats raw mathematical result numbers to prevent floating point artifacts (FR-12, FR-13).
   */
  function formatResult(num) {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) {
      state.isError = true;
      return 'Cannot divide by 0';
    }

    // Fix binary floating point rounding artifacts e.g. 0.1 + 0.2 = 0.3
    const rounded = parseFloat(num.toFixed(10));
    
    // Convert to string and handle extreme exponent length if necessary
    const str = String(rounded);
    if (str.length > 14 && !str.includes('e')) {
      return rounded.toExponential(6);
    }
    return str;
  }

  /**
   * Triggers visual pressed micro-animation on a target button element.
   */
  function animateButtonPress(button) {
    if (!button) return;
    button.classList.add('btn-pressed');
    setTimeout(() => {
      button.classList.remove('btn-pressed');
    }, 120);
  }

  // ------------------------------------------
  // 4. Arithmetic Engine
  // ------------------------------------------

  function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        if (secondOperand === 0) {
          state.isError = true;
          return 'Cannot divide by 0';
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }

  function handleOperator(nextOperator) {
    if (state.isError) return;

    const inputVal = parseFloat(state.currentValue);

    // Section 8: Operator pressed with no number entered -> operates on 0
    if (isNaN(inputVal) && state.previousValue === null) {
      state.previousValue = 0;
    }

    // Section 8: Operator pressed when operator already waiting -> override operator
    if (state.operator && state.waitingForSecondOperand) {
      state.operator = nextOperator;
      updateDisplay();
      return;
    }

    if (state.previousValue === null && !isNaN(inputVal)) {
      state.previousValue = inputVal;
    } else if (state.operator) {
      const result = calculate(state.previousValue, inputVal, state.operator);

      if (state.isError) {
        state.currentValue = result;
        updateDisplay();
        return;
      }

      state.currentValue = formatResult(result);
      state.previousValue = parseFloat(state.currentValue);
    }

    state.waitingForSecondOperand = true;
    state.operator = nextOperator;
    updateDisplay();
  }

  function handleEquals() {
    if (state.isError) return;

    let firstOperand = state.previousValue;
    let secondOperand = parseFloat(state.currentValue);
    let op = state.operator;

    // Section 8: Incomplete expression e.g. "5 + then ="
    if (op !== null && state.waitingForSecondOperand) {
      secondOperand = firstOperand;
    }

    // Repeated '=' press support
    if (op === null && state.lastOperator !== null) {
      firstOperand = parseFloat(state.currentValue);
      secondOperand = state.lastOperand;
      op = state.lastOperator;
    }

    if (op !== null && firstOperand !== null) {
      const result = calculate(firstOperand, secondOperand, op);

      state.lastOperator = op;
      state.lastOperand = secondOperand;

      if (state.isError) {
        state.currentValue = result;
      } else {
        state.currentValue = formatResult(result);
        state.previousValue = null;
        state.operator = null;
        state.waitingForSecondOperand = true;
      }
    }

    updateDisplay();
  }

  function handlePercent() {
    if (state.isError) return;

    const currentNum = parseFloat(state.currentValue);
    if (isNaN(currentNum)) return;

    let resultVal;
    if (state.previousValue !== null && (state.operator === '+' || state.operator === '-')) {
      resultVal = state.previousValue * (currentNum / 100);
    } else {
      resultVal = currentNum / 100;
    }

    state.currentValue = formatResult(resultVal);
    updateDisplay();
  }

  // ------------------------------------------
  // 5. Input Handlers (Digit, Decimal, Editing)
  // ------------------------------------------

  function handleDigit(digit) {
    if (state.isError) {
      handleAllClear();
    }

    if (state.waitingForSecondOperand) {
      state.currentValue = digit;
      state.waitingForSecondOperand = false;
    } else {
      if (state.currentValue === '0') {
        state.currentValue = digit;
      } else {
        if (state.currentValue.length < 16) {
          state.currentValue += digit;
        }
      }
    }
    updateDisplay();
  }

  function handleDecimal() {
    if (state.isError) {
      handleAllClear();
    }

    if (state.waitingForSecondOperand) {
      state.currentValue = '0.';
      state.waitingForSecondOperand = false;
      updateDisplay();
      return;
    }

    // Section 8: Single decimal point restriction
    if (!state.currentValue.includes('.')) {
      state.currentValue += '.';
      updateDisplay();
    }
  }

  function handleToggleSign() {
    if (state.isError || state.currentValue === '0') return;

    if (state.currentValue.startsWith('-')) {
      state.currentValue = state.currentValue.slice(1);
    } else {
      state.currentValue = '-' + state.currentValue;
    }
    updateDisplay();
  }

  function handleBackspace() {
    if (state.isError) {
      handleAllClear();
      return;
    }

    if (state.waitingForSecondOperand) return;

    if (state.currentValue.length > 1) {
      state.currentValue = state.currentValue.slice(0, -1);
      if (state.currentValue === '-') {
        state.currentValue = '0';
      }
    } else {
      state.currentValue = '0';
    }
    updateDisplay();
  }

  function handleClear() {
    if (state.isError) {
      handleAllClear();
      return;
    }

    if (clearBtn.textContent === 'C') {
      state.currentValue = '0';
    } else {
      handleAllClear();
    }
    updateDisplay();
  }

  function handleAllClear() {
    state.currentValue = '0';
    state.previousValue = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    state.isError = false;
    state.lastOperand = null;
    state.lastOperator = null;
    updateDisplay();
  }

  // ------------------------------------------
  // 6. Grid Click Listener (Mouse & Touch)
  // ------------------------------------------
  if (calculatorGrid) {
    calculatorGrid.addEventListener('click', (e) => {
      const button = e.target.closest('.btn');
      if (!button) return;

      animateButtonPress(button);

      const action = button.getAttribute('data-action');
      const value = button.getAttribute('data-value');

      switch (action) {
        case 'digit':
          handleDigit(value);
          break;
        case 'decimal':
          handleDecimal();
          break;
        case 'operator':
          handleOperator(value);
          break;
        case 'calculate':
          handleEquals();
          break;
        case 'percent':
          handlePercent();
          break;
        case 'toggle-sign':
          handleToggleSign();
          break;
        case 'backspace':
          handleBackspace();
          break;
        case 'clear':
          handleClear();
          break;
      }
    });
  }

  // ------------------------------------------
  // 7. Keyboard Shortcuts Handling
  // ------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key;

    if (key >= '0' && key <= '9') {
      handleDigit(key);
      animateButtonPress(buttonMap[key]);
      return;
    }

    if (key === '.' || key === ',') {
      e.preventDefault();
      handleDecimal();
      animateButtonPress(buttonMap['.']);
      return;
    }

    if (key === '+' || key === '-' || key === '*' || key === '/') {
      e.preventDefault();
      handleOperator(key);
      animateButtonPress(buttonMap[key]);
      return;
    }

    if (key === '=' || key === 'Enter') {
      e.preventDefault();
      handleEquals();
      animateButtonPress(buttonMap['calculate']);
      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      animateButtonPress(buttonMap['backspace']);
      return;
    }

    if (key === 'Escape') {
      e.preventDefault();
      handleAllClear();
      animateButtonPress(buttonMap['clear']);
      return;
    }

    if (key === '%') {
      e.preventDefault();
      handlePercent();
      animateButtonPress(buttonMap['percent']);
      return;
    }
  });

  // Initial rendering
  updateDisplay();
});
