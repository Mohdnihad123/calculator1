Product Requirements Document (PRD)
Simple Calculator — Web Application
Platform: Web application (built in Antigravity) Document owner: Product Manager Status: Ready for implementation Version: 1.0

1. Product Overview
Simple Calculator is a lightweight, browser-based calculator that performs standard arithmetic quickly and accurately. It is designed for everyday calculations — no scientific functions, no memory registers, no history log. The product prioritizes clarity, speed, and ease of use over feature breadth.

The calculator behaves like a physical desktop calculator: type or tap numbers and operators, see the running expression and result on a display, and get an accurate answer on equals.

2. Goals
2.1 Product Goals
Deliver a calculator that performs the four basic operations plus percentage, sign toggle, decimals, backspace, and clear — nothing more, nothing less.
Ensure 100% calculation accuracy for supported operations, including decimals.
Make the interface usable within seconds with no instructions needed.
Ensure the app works equally well with mouse, touch, and keyboard.
Ship a responsive layout that works on desktop, tablet, and mobile without layout breakage.
2.2 Non-Goals (Out of Scope)
No scientific functions (sin, cos, log, exponents, roots, etc.)
No calculation history or memory (M+, M-, MR, MC)
No unit conversion
No themes, settings, or user accounts
No offline app / installable PWA requirement (unless later specified)
3. Target Users
User Type	Need
General web users	Quick everyday math (bills, totals, tips, splitting costs)
Students	Fast, reliable arithmetic without a physical calculator
Mobile users	A calculator that's touch-friendly and doesn't require an app install
Keyboard-first users	Power users who prefer typing over clicking
4. Features Summary
Category	Feature
Core operations	Addition (+), Subtraction (−), Multiplication (×), Division (÷)
Number input	0–9 digits, decimal point (.)
Modifiers	Percentage (%), positive/negative toggle (±)
Editing	Backspace (⌫), Clear entry, Clear all (AC/C)
Execution	Equals (=)
Input methods	Mouse click, touch tap, physical keyboard
Display	Live expression/result display, auto-scaling for long numbers
Responsiveness	Desktop, tablet, mobile layouts
5. User Flow
User lands on the calculator → display shows 0.
User taps/types a number → digit appears on display, replacing the placeholder 0.
User taps/types an operator (+, −, ×, ÷) → operator is registered; display keeps showing the number entered so far (or shifts to show the expression, per UI design in Section 6).
User enters the second number → digits append to display.
User taps = or presses Enter → the calculation executes, and the result replaces the display.
User may then:
Start a new calculation by entering a new digit (result is cleared automatically), or
Chain another operation using the result as the first operand, or
Press C/AC to reset, or
Press backspace to correct the last entry before pressing =.
Flow Diagram (textual)
[Start: Display = 0]
   → Enter Number → [Display updates]
   → Enter Operator → [Operator stored, ready for next number]
   → Enter Number → [Display updates]
   → Press "=" → [Result calculated and shown]
   → (Loop: new number clears display, or chain operation, or clear)
6. UI/UX Requirements
6.1 Screen Layout
Single-screen application, centered calculator panel, no navigation, no scrolling.

┌─────────────────────────────┐
│                              │  ← Display area
│                    123 + 45  │   (small: running expression)
│                        168   │   (large: current value/result)
├─────────────────────────────┤
│   AC   ⌫    %    ÷           │  ← Row 1: utility functions
│   7    8    9    ×           │  ← Row 2
│   4    5    6    −           │  ← Row 3
│   1    2    3    +           │  ← Row 4
│   ±    0    .    =           │  ← Row 5
└─────────────────────────────┘
6.2 Display Area
Two-tier display:
Secondary line (small, top, muted color): shows the running expression, e.g. 123 + 45.
Primary line (large, bold, high-contrast): shows the current number being entered or the final result.
Right-aligned text (standard calculator convention).
Auto-shrinks font size as digit count grows, so numbers never overflow or wrap (see Section 9, Long Numbers).
Display is read-only — no direct text editing/cursor placement.
6.3 Buttons
Numbers (0–9): neutral background, high-contrast text.
Operators (+, −, ×, ÷, =): visually distinct accent color (e.g., a single accent color for operators, a stronger/filled version for =).
Utility functions (AC, ⌫, %, ±): secondary/muted color, visually grouped apart from numbers and math operators.
All buttons:
Minimum tap target size: 44×44px (mobile accessibility standard).
Clear hover state (desktop) and pressed/active state (all platforms) for tactile feedback.
Rounded corners, consistent spacing/grid alignment.
Legible font size (minimum 18px for button labels, scaling up on larger screens).
6.4 Visual Design Principles
Clean, modern, minimal aesthetic — generous white space, no clutter.
Neutral base palette (light or dark background) with one accent color for operators/equals.
High contrast between text and background to meet accessibility (WCAG AA minimum).
Consistent 4/8px spacing grid.
Subtle shadow or border to visually separate the calculator panel from the page background.
No decorative elements that don't serve function (no unnecessary icons, animations, or illustrations).
6.5 Interaction Feedback
Button press gives immediate visual feedback (color change/scale-down) within 100ms.
Display updates instantly on every input — no lag, no loading states (all computation is client-side and synchronous).
7. Functional Requirements
ID	Requirement
FR-1	The app shall support entry of digits 0–9 via button click/tap and keyboard.
FR-2	The app shall support one decimal point per number; pressing . after a decimal already exists in the current number shall be ignored.
FR-3	The app shall support addition, subtraction, multiplication, and division between two or more chained numbers.
FR-4	The app shall support percentage conversion (divides the current displayed value by 100, or computes relative percentage of the running total, per standard calculator behavior).
FR-5	The app shall support toggling the sign (positive/negative) of the currently displayed number via a ± button.
FR-6	The app shall support backspace, removing the last entered digit/character from the current number without clearing the whole entry.
FR-7	The app shall support two clear actions: C (clear current entry only, if a distinct control is included) and AC (clear everything and reset to initial state 0). At minimum, one clear/reset control (AC) is required.
FR-8	The app shall calculate and display the result when = is pressed or Enter is struck.
FR-9	The app shall allow chaining operations (e.g., 5 + 3 − 2 =) by evaluating sequentially, left to right, consistent with standard calculator (non-scientific) order of entry.
FR-10	The app shall support full keyboard input as defined in Section 7.1.
FR-11	The app shall never crash, freeze, or show NaN/undefined/raw error text on the display.
FR-12	The app shall round floating-point results to avoid exposing binary floating-point artifacts (e.g., 0.1 + 0.2 shall display 0.3, not 0.30000000000000004).
FR-13	The app shall cap or format the number of visible decimal places to keep the display readable (e.g., up to 8–10 significant digits), while preserving reasonable precision.
7.1 Keyboard Support
Key	Action
0–9	Enter digit
.	Decimal point
+	Addition
-	Subtraction
*	Multiplication
/	Division
Enter or =	Calculate result
Backspace	Delete last character
Escape	Clear all (AC)
%	Percentage
Shift + - (or dedicated key, e.g., ~)	Toggle sign — optional mapping, mouse/touch remains primary method since ± has no universal key
8. Edge Cases & Error Handling
Edge Case	Expected Behavior
Division by zero (x ÷ 0)	Display a clear, friendly message such as Error or Cannot divide by 0 instead of Infinity/NaN. Pressing any number or AC clears the error and resets to input mode.
Repeated operator presses (e.g., 5 + + +)	Only the most recently pressed operator is used; earlier ones are silently replaced (no error, no stacking).
Operator pressed with no number entered (e.g., pressing + right at start, before any digit)	Operator is ignored, or treated as applying to 0, depending on implementation choice — must not crash or corrupt state.
Multiple decimal points in one number	Only the first . is accepted; subsequent presses within the same number are ignored.
Pressing = with an incomplete expression (e.g., 5 + then =)	No calculation occurs, or the app treats the missing operand gracefully (e.g., re-uses the last number). Must not error out.
Very long numbers	Display font auto-scales down and/or number is abbreviated (e.g., truncated with ellipsis or scientific notation beyond display width) so layout never breaks or overflows.
Leading zeros (e.g., typing 007)	Collapses to 7 automatically; does not display redundant leading zeros.
Negative result handling	Negative numbers display correctly with a leading − and can be operated on further.
Backspace on empty/zero display	No-op; display remains 0.
Clear during mid-calculation	AC fully resets state (stored operands, operator, display) back to initial 0.
Percentage on chained operations	% applies to the currently displayed number using standard calculator convention (e.g., 200 + 10% = 220).
9. Responsive Requirements
Breakpoint	Behavior
Desktop (≥1024px)	Calculator panel centered, fixed comfortable max-width (e.g., ~360–400px), generous padding, hover states active.
Tablet (768–1023px)	Calculator panel scales proportionally, maintains centered layout, touch targets remain ≥44px.
Mobile (≤767px)	Calculator panel expands to near-full width with safe margins; buttons resize to remain easily tappable with a thumb; layout remains a fixed 4-column grid (no wrapping/reflow of the button grid).
All breakpoints	No horizontal scrolling; display text scales rather than overflows; button grid aspect ratio remains consistent; orientation change (portrait/landscape on mobile) does not break layout.
10. Acceptance Criteria
The product is considered complete and ready for release when all of the following are true:

✅ All four core operations (+, −, ×, ÷) return mathematically correct results, including with decimals.
✅ Division by zero is handled gracefully with a clear on-screen message — never Infinity or NaN.
✅ Decimal input works correctly; only one decimal point is allowed per number.
✅ Percentage (%), sign toggle (±), backspace (⌫), and clear (AC) all function as specified in Section 7 and 8.
✅ = correctly evaluates the full entered expression, including chained operations.
✅ Full keyboard support works as specified in Section 7.1, matching on-screen button behavior exactly.
✅ Repeated operators, empty operands, and other malformed input sequences (Section 8) do not crash the app or produce broken/undefined output.
✅ The display never shows raw floating-point rounding artifacts (e.g., 0.1 + 0.2 displays 0.3).
✅ Long numbers do not overflow, wrap, or break the layout on any screen size.
✅ The UI renders correctly and remains fully usable (buttons tappable, display legible) on desktop, tablet, and mobile viewports.
✅ All buttons have visible hover/pressed states and meet the 44×44px minimum touch target size.
✅ The interface meets WCAG AA contrast standards for text and interactive elements.
✅ No unnecessary features beyond those specified in this PRD are present in the shipped product.
11. Open Questions (for implementation team)
Should C (clear entry) and AC (clear all) be two separate buttons, or a single button that changes behavior contextually (common in modern calculators: shows C while typing, becomes AC once idle)? Default recommendation: single contextual button to keep the UI simple, per the "beginner-friendly, no unnecessary features" goal.
Light mode, dark mode, or both? Default recommendation: single clean light theme for v1, unless otherwise specified.
