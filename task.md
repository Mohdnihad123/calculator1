# Step-by-Step Execution Plan: Simple Calculator Web Application

Based on the Product Requirements Document ([prd.md](file:///c:/Users/PL-6/vbibe/prd.md)), this execution plan outlines the phase-by-phase implementation steps required to build, style, verify, and deliver the application.

---

## Phase 1: Project Architecture & Core Structure
- [x] **1.1 Initialize Project Files**
  - Create `index.html` with HTML5 boilerplate and semantic elements (`<main>`, `<header>`, `<section>`, `<fieldset>` / `<button>` grid).
  - Set up metadata tags: title, meta description, viewport settings for responsive rendering, and link Google Fonts (Inter / Outfit).
  - Link CSS stylesheet (`styles.css`) and JavaScript module (`app.js`).

- [x] **1.2 Build HTML Layout & Accessibility Markup**
  - Create outer wrapper container for screen centering.
  - Build display panel area (`.calculator-display`):
    - Secondary text display (`#secondary-display`) for running expression.
    - Primary text display (`#primary-display`) initialized to `0`.
  - Build button grid layout (`.calculator-grid` or `4x5` grid structure):
    - **Row 1**: Contextual Clear button (`#btn-clear` - AC/C), Backspace (`#btn-backspace` - ⌫), Percentage (`#btn-percent` - %), Division (`#btn-divide` - ÷).
    - **Row 2**: Digits 7, 8, 9, Multiplication (`#btn-multiply` - ×).
    - **Row 3**: Digits 4, 5, 6, Subtraction (`#btn-subtract` - −).
    - **Row 4**: Digits 1, 2, 3, Addition (`#btn-add` - +).
    - **Row 5**: Sign Toggle (`#btn-toggle-sign` - ±), Digit 0 (`#btn-0`), Decimal (`#btn-decimal` - .), Equals (`#btn-equals` - =).
  - Add explicit HTML accessibility attributes (`aria-label`, `role="region"`, `tabindex`, data attributes like `data-action` and `data-value`).

---

## Phase 2: Design System & Styling (`styles.css`)
- [x] **2.1 Define CSS Variables & Theme**
  - Define CSS custom properties (`:root` variables) for colors, typography, elevations, and transition timing:
    - Base background and calculator container background (clean light mode).
    - Primary text, secondary text (muted), border, and glassmorphism subtle shadows.
    - Accent color for math operators (`+`, `−`, `×`, `÷`) and distinct primary filled accent for Equals (`=`).
    - Utility button color styling (AC, ⌫, %, ±).
    - Font family, sizes (display primary ~36-48px, secondary ~16px, buttons ~20px).
- [x] **2.2 Implement Layout & Grid System**
  - Center calculator on screen using Flexbox/Grid.
  - Style calculator card container (border-radius, shadow, max-width ~380px, padding).
  - Set up display container with right-aligned text, fixed height, auto-wrap handling, and non-selectable text (`user-select: none`).
  - Set up CSS Grid for button matrix (4 equal columns, 5 rows, consistent gap e.g., 12px).
- [x] **2.3 Button Styling & Interactive States**
  - Enforce minimum tap target size (44px × 44px).
  - Apply hover, focus, active/pressed scale transforms (e.g. `transform: scale(0.96)`) and transitions (<100ms response).
  - Style active operator state highlight when an operator is currently selected.
- [x] **2.4 Responsive Media Queries**
  - **Desktop (≥1024px)**: Centered fixed container (~380px).
  - **Tablet (768px–1023px)**: Proportional scaling, comfortable touch targets.
  - **Mobile (≤767px)**: Near full-width layout with safe margins, full 4-column touch-friendly grid.

---

## Phase 3: Core Calculator Engine & State Management (`app.js`)
- [x] **3.1 Initialize State Model**
  - Implement state structure:
    - `currentValue`: String representing the currently edited operand.
    - `previousValue`: Number or null representing stored first operand.
    - `operator`: String or null (`+`, `-`, `*`, `/`).
    - `waitingForSecondOperand`: Boolean flag for operator input transition.
    - `isError`: Boolean flag for error state (e.g., division by zero).
    - `expressionText`: String for running display expression.
- [x] **3.2 Implement Core Input Handlers**
  - **Digit Input**: Append digits 0-9; handle initial leading `0` replacement (avoid `007`).
  - **Decimal Input**: Append `.`; enforce single decimal per number rule (`FR-2`, `Section 8`).
  - **Backspace Handler**: Delete last character from `currentValue`. Reset to `0` if empty.
  - **Sign Toggle (±)**: Multiply `currentValue` by `-1` or toggle leading `-`.
  - **Clear Actions**:
    - Contextual Clear (C): Clears current entry if active.
    - All Clear (AC): Resets state completely back to initial `0`.

---

## Phase 4: Mathematical Operations & Precision Formatting
- [x] **4.1 Arithmetic Calculation Engine**
  - Implement evaluation logic for basic operations (`+`, `-`, `*`, `/`).
  - Implement sequential left-to-right calculation evaluation (`FR-9`).
- [x] **4.2 Floating-Point Precision & Rounding Handler**
  - Fix floating-point artifacts (e.g., `0.1 + 0.2` = `0.3`) using `Number.EPSILON` rounding or `parseFloat(result.toFixed(10))` / `toPrecision` (`FR-12`).
  - Implement formatting helper to restrict maximum visible decimals (8–10 significant digits) while preserving accuracy (`FR-13`).
- [x] **4.3 Percentage Calculation Logic**
  - Implement percentage evaluation (`%`) based on current entry or relative calculation (e.g., `200 + 10%` = `220` or `50%` = `0.5`) (`FR-4`, `Section 8`).

---

## Phase 5: Input Bindings & Keyboard Listener
- [x] **5.1 Mouse & Touch Event Listeners**
  - Attach unified click event delegation on the calculator grid.
  - Dispatch corresponding action handlers based on `data-action` or `data-value`.
  - Trigger visual button active state feedback on touch/mouse press.
- [x] **5.2 Keyboard Shortcuts Handling**
  - Add `keydown` event listener on `window`.
  - Map keys:
    - `0`–`9` → Digit entry
    - `.` or `,` → Decimal point
    - `+`, `-`, `*`, `/` → Arithmetic operators
    - `Enter` or `=` → Execute calculation
    - `Backspace` → Delete last character
    - `Escape` → AC (All Clear)
    - `%` → Percentage calculation
  - Prevent default browser behaviors for trapped keys (e.g., `/` key quick search or space scroll).
  - Trigger visual press animation on the corresponding UI button when mapped key is pressed.

---

## Phase 6: Edge Cases, Error Handling & Font Auto-Scaling
- [x] **6.1 Division by Zero Handling**
  - Intercept `x / 0` division.
  - Set display to `"Cannot divide by 0"` or `"Error"`.
  - Freeze operation until user presses AC or inputs a new number.
- [x] **6.2 Repeated Operator & Incomplete Expression Handling**
  - If user hits multiple operators sequentially (e.g., `5 + *`), override existing operator without calculating (`Section 8`).
  - If user hits `=` with no second operand, gracefully maintain state or evaluate with stored operand without crashing.
- [x] **6.3 Auto-scaling Display Text for Long Numbers**
  - Implement dynamic font scaling script or CSS container query / SVG / JS width checking.
  - Shrink font size dynamically as character count grows so numbers never overflow or break layout.

---

## Phase 7: Verification & Acceptance Testing
- [x] **7.1 Functional & Math Accuracy Verification**
  - Verify `0.1 + 0.2 = 0.3`.
  - Verify chained operations: `5 + 3 − 2 = 6`.
  - Verify division by zero displays user-friendly error.
  - Verify single decimal rule per number.
  - Verify percentage and sign toggle calculations.
- [x] **7.2 Keyboard & Touch Interoperability Verification**
  - Verify all specified keyboard shortcuts match button interactions.
  - Verify mouse clicks and mobile touch taps have immediate visual feedback.
- [x] **7.3 Responsive & Accessibility Audit**
  - Test layouts across Desktop (1440px), Tablet (768px), and Mobile (375px).
  - Verify WCAG AA color contrast compliance for text and button elements.
  - Ensure minimum 44px tap targets across all viewports.
