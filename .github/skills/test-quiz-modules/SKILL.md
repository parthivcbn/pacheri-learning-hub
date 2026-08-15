---
name: test-quiz-modules
description: "Use when: testing quiz modules for content accuracy, UI responsiveness, game mechanics, cross-browser compatibility, performance, and accessibility. Provides systematic 8-step workflow with decision points and verification criteria for grade 4-7 quiz platform."
skills: []
---

# Testing Quiz Modules

Systematic workflow for comprehensive testing of all 6 quiz modules in the Grade Quiz platform.

## Overview

This skill guides you through testing:
- **Quiz Modules**: adaptive-game, geography, puzzle, space, teacher_grade7_arithmetic, universe
- **Test Aspects**: Content accuracy, UI/UX, game mechanics, cross-browser compatibility, performance, accessibility
- **Coverage**: Functionality, edge cases, and user experience across grade levels (4th & 7th)

---

## Prerequisites

Before testing, ensure:
- [ ] All HTML files are accessible locally (run `python -m http.server` or similar)
- [ ] Browser DevTools are available for inspection
- [ ] Test checklist saved locally for tracking
- [ ] Know the expected answers/scoring for each quiz module

---

## Testing Workflow

### Step 1: Prepare Test Environment

**Goal**: Set up testing infrastructure and document baseline

1. **Start a local server** to serve files:
   ```bash
   cd /Users/Pacheri/parthiv\ coding/quiz
   python -m http.server 8000
   ```
   
2. **Open DevTools** in your primary browser (Chrome/Firefox/Safari)
   - Enable Network tab to monitor performance
   - Enable Console to catch JavaScript errors
   
3. **Create a test log** (e.g., `TEST_LOG.md`) to document:
   - Module tested
   - Grade level tested
   - Issues found
   - Browser/viewport tested
   - Timestamp

---

### Step 2: Content Accuracy & Scoring Logic

**Goal**: Verify questions, answers, and scoring calculate correctly

**For each quiz module:**

1. **Answer a few questions correctly**
   - Record expected score after each answer
   - Verify actual score matches expected
   - Check if adaptive difficulty changes (adaptive-game, space modules)

2. **Answer intentionally wrong**
   - Verify incorrect feedback displays
   - Confirm score does NOT increase
   - Check for repeat question logic

3. **Test edge cases**
   - Fastest completion (tap all questions rapidly)
   - Slowest completion (wait between questions)
   - Restart mid-quiz → verify state resets

**Decision Point:**
- ✅ **Pass**: Scoring matches 100%, feedback is accurate
- ❌ **Fail**: Log issue with module name, expected vs. actual score, browser

---

### Step 3: UI/UX & Responsiveness

**Goal**: Verify layout adapts to different screen sizes and interactions work smoothly

**Desktop (1440px+):**
- [ ] All quiz choices visible without scrolling
- [ ] Buttons clearly labeled and clickable
- [ ] Progress bar or score display readable
- [ ] No layout shifting when switching questions

**Tablet (768px - 1024px):**
- [ ] Quiz adapts to portrait orientation
- [ ] Choices stack logically (single column or 2x2 grid)
- [ ] Touch targets are >= 44px
- [ ] No horizontal scroll needed

**Mobile (< 768px):**
- [ ] Single column layout
- [ ] Choices readable without pinch-zoom
- [ ] Submit/next buttons accessible at bottom
- [ ] Viewport meta tag prevents zoom issues

**Test method:**
```javascript
// In DevTools console, test responsiveness
window.innerWidth  // should show current viewport
```

**Decision Point:**
- ✅ **Pass**: Layouts work at 320px, 768px, 1024px, 1440px
- ❌ **Fail**: Layout breaks at specific breakpoint → document viewport width and screenshot

---

### Step 4: Game Mechanics & Adaptive Difficulty

**Goal**: Verify scoring system, timing, and difficulty progression work as designed

**Check for each module:**

1. **Scoring Logic**
   - How many points per correct answer?
   - Is there time-based bonus?
   - Does difficulty level affect points?

2. **Adaptive Difficulty (adaptive-game module)**
   - Complete 3 questions correctly → should questions get harder?
   - Complete 3 questions incorrectly → should questions get easier?
   - Visual feedback for difficulty level?

3. **Timer/Performance Pressure**
   - Does timer display count down?
   - What happens at timeout?
   - Can user disable timer or extend it?

4. **State Persistence**
   - Reload page mid-quiz → does state restore?
   - Close browser → state lost as expected?

**Decision Point:**
- ✅ **Pass**: Mechanics work as intended, difficulty adapts, score reflects performance
- ❌ **Fail**: Log specific scenario (e.g., "3 correct answers did not trigger difficulty increase")

---

### Step 5: Cross-Browser Compatibility

**Goal**: Test on at least 3 browsers to catch rendering/JS issues

**For each module, test on:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)  
- [ ] Safari (macOS) OR Edge (Windows)

**Quick checklist per browser:**
- [ ] Page loads without JavaScript errors (check Console)
- [ ] All quiz choices appear and are clickable
- [ ] Scoring works (take 1-2 sample questions)
- [ ] No rendering glitches (text overlap, buttons misaligned)
- [ ] Accessibility features work (keyboard navigation, focus states)

**Command to check for errors:**
```javascript
// In DevTools Console, run after page load
window.onerror  // should be null if no errors
```

**Decision Point:**
- ✅ **Pass**: All 3 browsers pass checklist
- ⚠️ **Partial Pass**: 2 browsers work, 1 has minor issue → document browser + issue
- ❌ **Fail**: Core functionality broken in any browser

---

### Step 6: Performance & Loading Time

**Goal**: Ensure quiz loads quickly and doesn't lag during interaction

**Measure:**
1. **Initial Load**
   - Open DevTools → Network tab
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - Record time to First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
   - **Target**: < 2 seconds for FCP

2. **Interaction Responsiveness**
   - Select an answer → does button respond immediately?
   - Page transition to next question → any lag?
   - Score update visible → does it flicker or stall?

3. **Memory Usage**
   - DevTools → Memory tab → take heap snapshot
   - Complete a full quiz
   - Take another heap snapshot → should not grow excessively (< 5MB increase)

**Decision Point:**
- ✅ **Pass**: FCP < 2s, interactions smooth, no lag during quiz
- ⚠️ **Slow**: FCP 2-4s, minor lag → note as performance improvement
- ❌ **Fail**: FCP > 4s or significant lag → investigate

---

### Step 7: Accessibility & Keyboard Navigation

**Goal**: Ensure quiz is usable without mouse and screen readers work

**Keyboard Navigation:**
- [ ] Tab cycles through answer choices
- [ ] Enter/Space selects a choice
- [ ] Visible focus indicator on focused element
- [ ] Can reach "Submit" and "Next" buttons via keyboard
- [ ] Tab order makes logical sense (top-to-bottom, left-to-right)

**Screen Reader (if VoiceOver/NVDA available):**
- [ ] Quiz title is announced
- [ ] Question text is read aloud
- [ ] Answer choices are labeled properly
- [ ] Selection feedback ("correct" or "incorrect") is announced

**ARIA Attributes to check** (inspect element in DevTools):
```html
<!-- Look for role, aria-label, aria-selected, aria-live -->
<button role="button" aria-label="Choice A" aria-selected="false">...</button>
```

**Decision Point:**
- ✅ **Pass**: Full keyboard navigation, clear focus states, screen reader compatible
- ⚠️ **Partial**: Keyboard works but focus states unclear → improve CSS
- ❌ **Fail**: Cannot use keyboard to navigate quiz

---

### Step 8: Cross-Module Consistency & Final Verification

**Goal**: Ensure all modules work consistently and identify patterns in failures

**Run through all 6 modules:**
1. **adaptive-game.html** ✓
2. **geography.html** ✓
3. **puzzle.html** ✓
4. **space.html** ✓
5. **teacher_grade7_arithmetic.html** ✓
6. **universe.html** ✓

**For each:**
- [ ] Test both grade 4 and grade 7 if applicable
- [ ] Quick content check (1-2 questions)
- [ ] UI renders correctly
- [ ] Scoring logs to console without error

**Consistency Checks:**
- Do all modules use the same styling/CSS?
- Are error messages consistent across modules?
- Does the overall workflow feel cohesive?

**Final Sign-Off:**
```markdown
## Test Summary
- Modules tested: [list]
- Critical issues: [count]
- Minor issues: [count]
- Browsers tested: [list]
- Date: [date]
- Tester: [name]
- Ready to deploy: [ ] YES [ ] NO
```

---

## Quality Criteria (Definition of Done)

- ✅ All modules score correctly on sample questions
- ✅ UI responsive and usable on 320px - 1440px viewports
- ✅ No JavaScript errors in Console on any module
- ✅ Keyboard navigation works end-to-end
- ✅ Tested on at least 3 browsers
- ✅ Initial load time < 2 seconds
- ✅ All 6 modules behave consistently

---

## Common Issues & Troubleshooting

| Issue | Diagnosis | Resolution |
|-------|-----------|-----------|
| Scoring doesn't update | Check console for JS errors | Debug adaptive-game.js, script.js |
| Mobile layout breaks | Viewport meta tag missing? | Verify `<meta name="viewport" ...>` in HTML |
| Button unresponsive | Event listener not attached | Inspect element → check for click handlers |
| Focus not visible | CSS focus styles missing | Add `.focused { outline: 2px ... }` to styles.css |
| Timer doesn't work | setInterval not clearing | Check cleanup on page transition |
| Adaptive difficulty stuck | State not updating | Verify game state object mutates correctly |

---

## Next Steps

After testing:
1. **Log all issues** in test log with severity (Critical/High/Medium/Low)
2. **Prioritize fixes** by severity and impact
3. **Retest after fixes** using this same workflow
4. **Automation**: Consider adding automated scoring validation tests

---

## Example Prompts to Use This Skill

- "Run test-quiz-modules on the adaptive game module"
- "I need to test all 6 quiz modules for cross-browser compatibility"
- "Help me debug why the scoring isn't working—use the testing workflow"
- "Test the Grade 7 arithmetic module for accessibility"
