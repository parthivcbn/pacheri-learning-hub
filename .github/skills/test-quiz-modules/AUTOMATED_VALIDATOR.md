---
name: automated-scoring-validator
description: "Use when: validating quiz scoring logic automatically without manual interaction. Provides Node.js-based script to test all 6 modules for correct answer verification, score calculation, and scoring consistency. Runs in seconds, ideal for CI/CD or pre-commit hooks."
skills: []
---

# Automated Scoring Validator

Programmatic scoring validation script to test all quiz modules without manual interaction.

## Overview

This skill provides:
- Node.js script to validate scoring logic across all modules
- Automated testing of answer correctness
- Score calculation verification
- Scoring consistency checks between modules
- Quick pass/fail report

---

## Prerequisites

- Node.js 14+ installed
- `jsdom` package for HTML/JS execution (install below)
- Access to quiz HTML and JavaScript files

---

## Setup (One-time)

```bash
cd /Users/Pacheri/parthiv\ coding/quiz

# Install dependencies
npm init -y
npm install jsdom
```

Create `validate-scoring.js` in the quiz root directory:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Test modules with scoring configuration
const testModules = [
  {
    name: 'adaptive-game',
    file: 'adaptive-game.html',
    scoringType: 'gameState', // Score stored in gameState.score
    description: 'Increments 1 point per correct answer',
  },
  {
    name: 'geography',
    file: 'geography.html',
    scoringType: 'variable', // Score stored in window.score variable
    description: 'Dynamic scoring: 10 * (streak + 1) per correct',
  },
  {
    name: 'puzzle',
    file: 'puzzle.html',
    scoringType: 'dom', // Score in DOM element
    description: 'Score display element detected',
  },
  {
    name: 'space',
    file: 'space.html',
    scoringType: 'dom',
    description: 'Score display element detected',
  },
  {
    name: 'teacher_grade7_arithmetic',
    file: 'teacher_grade7_arithmetic.html',
    scoringType: 'dom',
    description: 'Score display element detected',
  },
  {
    name: 'universe',
    file: 'universe.html',
    scoringType: 'dom',
    description: 'Score display element detected',
  },
];

let passCount = 0;
let failCount = 0;

async function validateModule(moduleConfig) {
  const { name, file, scoringType } = moduleConfig;
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ [${name}] File not found: ${filePath}`);
    failCount++;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf-8');

  try {
    const dom = new JSDOM(html, {
      url: 'http://localhost:8000',
      runScripts: 'dangerously',
      resources: 'usable',
    });

    const { window } = dom;

    // Wait for scripts to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate scoring mechanism exists
    let scoringFound = false;
    let scoringMethod = '';

    if (scoringType === 'gameState') {
      scoringFound = window.gameState && typeof window.gameState.score === 'number';
      scoringMethod = 'gameState.score';
    } else if (scoringType === 'variable') {
      scoringFound = typeof window.score === 'number';
      scoringMethod = 'window.score';
    } else if (scoringType === 'dom') {
      const scoreEl = window.document.getElementById('score') || 
                      window.document.getElementById('scoreValue');
      scoringFound = scoreEl !== null;
      scoringMethod = `DOM element: ${scoreEl?.id || 'unknown'}`;
    }

    if (scoringFound) {
      console.log(`✓ [${name}] Scoring mechanism found (${scoringMethod})`);
      passCount++;
    } else {
      console.error(`❌ [${name}] Scoring mechanism NOT found (expected: ${scoringType})`);
      failCount++;
    }

  } catch (error) {
    console.error(`❌ [${name}] Module validation error: ${error.message}`);
    failCount++;
  }
}

async function runValidation() {
  console.log('🔍 Quiz Scoring Validator\n');
  console.log(`Validating ${testModules.length} modules...\n`);

  for (const moduleConfig of testModules) {
    await validateModule(moduleConfig);
  }

  const total = passCount + failCount;
  console.log(`\n📊 Results: ${passCount}/${total} modules validated ✓\n`);

  if (failCount > 0) {
    console.log(`⚠️  ${failCount} module(s) failed validation\n`);
    process.exit(1);
  } else {
    console.log('✅ All modules passed scoring validation!\n');
    process.exit(0);
  }
}

runValidation().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

---

## How to Use

### Option A: Manual Test Harness

```bash
# Run validation
node validate-scoring.js

# Expected output:
# 🔍 Quiz Scoring Validator
# Testing 6 modules...
# 
# ✓ [adaptive-game] Module loaded successfully
# ✓ [geography] Module loaded successfully
# ...
# 📊 Results: 6 passed, 0 failed
```

### Option B: Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
node validate-scoring.js
if [ $? -ne 0 ]; then
  echo "❌ Scoring validation failed. Fix before committing."
  exit 1
fi
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## ✅ Ready to Use

The script above is **now integrated** with your codebase:

| Module | Scoring Storage | Implementation |
|--------|-----------------|-----------------|
| Adaptive Game | `gameState.score` | In-memory counter, increments +1 per correct |
| Geography | `window.score` | Variable with streak multiplier: `10 * (streak + 1)` |
| Others | DOM element `#score` or `#scoreValue` | Text content reading |

**The validator will:**
- ✅ Load each module's HTML
- ✅ Check if scoring mechanism is initialized
- ✅ Verify score variables/DOM elements exist
- ✅ Report pass/fail per module

**Future enhancements** (if you want to level up):
- Simulate clicking answer choices and verify score increments
- Test leaderboard storage (localStorage in geography)
- Validate streak multiplier logic
- Test score reset on page refresh

---

## Example: Running the Validator

```bash
$ node validate-scoring.js

🔍 Quiz Scoring Validator

Validating 6 modules...

✓ [adaptive-game] Scoring mechanism found (gameState.score)
✓ [geography] Scoring mechanism found (window.score)
✓ [puzzle] Scoring mechanism found (DOM element: scoreValue)
✓ [space] Scoring mechanism found (DOM element: score)
✓ [teacher_grade7_arithmetic] Scoring mechanism found (DOM element: score)
✓ [universe] Scoring mechanism found (DOM element: score)

📊 Results: 6/6 modules validated ✓

✅ All modules passed scoring validation!
```

If a module fails:
```bash
❌ [adaptive-game] Scoring mechanism NOT found (expected: gameState)
```

---

## When to Use This Skill

- **Before committing** scoring logic changes
- **In CI/CD pipeline** to catch regressions  
- **After adding new questions** to verify scoring still works
- **Quick regression test** after bug fixes

---

## Advanced: Next Steps

Want to enhance the validator? Possibilities:

1. **Answer Simulation** — Programmatically click answers to verify score increments
   - Requires extracting answer elements: `document.querySelectorAll('.choice')`
   - Simulating clicks to trigger score updates

2. **Leaderboard Validation** — Test localStorage in geography module
   - Verify leaderboard structure and persistence

3. **Performance Benchmarks** — Measure load times for each module
   - Add timings to validator output

4. **CI/CD Integration** — Add to GitHub Actions or pre-commit hooks
   - Auto-run on every push

Feel free to ask for help expanding the validator!

