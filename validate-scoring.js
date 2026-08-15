#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
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
  {
    name: 'english',
    file: 'english.html',
    scoringType: 'dom',
    description: 'Score display element detected',
  },
  {
    name: 'english-guide',
    file: 'english-guide.html',
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
    const dom = await JSDOM.fromFile(filePath, {
      url: pathToFileURL(filePath).href,
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      beforeParse(window) {
        window.HTMLElement.prototype.scrollIntoView = function() {};
        window.Element.prototype.scrollIntoView = function() {};
        window.IntersectionObserver = class {
          constructor() {}
          observe() {}
          unobserve() {}
          disconnect() {}
        };
        window.scrollTo = function() {};
        window.scrollBy = function() {};
      },
    });

    const { window } = dom;

    // Wait for scripts to load
    await new Promise(resolve => setTimeout(resolve, 750));

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
