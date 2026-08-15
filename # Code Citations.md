# Code Citations

## License: GPL-2.0
https://github.com/gaucho-plugins/payment-page-free/blob/33ce9d817b4825ff22e4146dc7672aced6cd5435/interface/app/utility/string.js

```
I'll update the quiz to support **Biology, Chemistry, and Physics** as science themes alongside the space rocket design.

Here's what I'm changing:

````html
<!-- filepath: /Users/Pacheri/parthiv coding/quiz/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Grade Quiz — Math & Science</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="theme-space">
  <div class="app">
    <header>
      <h1>Grade Quiz</h1>
      <div class="controls">
        <label>Grade
          <select id="gradeSelect">
            <option value="4">4th Grade</option>
            <option value="7">7th Grade</option>
          </select>
        </label>
        <label>Subject
          <select id="subjectSelect">
            <option value="Math">Math</option>
            <option value="Science">Science</option>
          </select>
        </label>
        <label id="scienceThemeLabel" style="display:none">Science Theme
          <select id="scienceThemeSelect">
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
          </select>
        </label>
        <label>Total Questions
          <input id="totalInput" type="number" value="10" min="1" />
        </label>
      </div>
      <div class="subtitle" id="themeNote">A space rocket quiz with flying rockets, numbers, and scientific principles.</div>
    </header>

    <main>
      <div class="quiz-header">
        <div>Question <span id="qIndex">1</span>/<span id="qCount">1</span></div>
        <div class="auto-controls">
          <label>Auto-advance <input id="autoToggle" type="checkbox" /></label>
          <label>Interval (s) <input id="intervalInput" type="number" value="3" min="1" style="width:50px" /></label>
        </div>
      </div>

      <section id="questionCard" class="card">
        <div id="questionText" class="question">Loading...</div>
        <div id="choices" class="choices"></div>
        <div class="actions">
          <button id="prevBtn">← Prev</button>
          <button id="nextBtn">Next →</button>
          <button id="showAnswerBtn">Show Answer</button>
          <button id="shuffleBtn">Shuffle</button>
          <button id="randomBtn">Random</button>
        </div>
        <div id="answer" class="answer" aria-hidden="true"></div>
      </section>

      <footer>
      </footer>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>
````

````javascript
// filepath: /Users/Pacheri/parthiv coding/quiz/script.js
// Quiz app logic (multiple-choice + on-the-fly math/science generator)
const gradeSelect = document.getElementById('gradeSelect');
const subjectSelect = document.getElementById('subjectSelect');
const scienceThemeSelect = document.getElementById('scienceThemeSelect');
const scienceThemeLabel = document.getElementById('scienceThemeLabel');
const totalInput = document.getElementById('totalInput');
const themeNote = document.getElementById('themeNote');
const qIndexEl = document.getElementById('qIndex');
const qCountEl = document.getElementById('qCount');
const questionText = document.getElementById('questionText');
const choicesEl = document.getElementById('choices');
const answerEl = document.getElementById('answer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const randomBtn = document.getElementById('randomBtn');
const autoToggle = document.getElementById('autoToggle');
const intervalInput = document.getElementById('intervalInput');

let bank = {};
let bankLists = [];
let index = 0;
let autoTimer = null;
let totalQuestions = 0;
let currentCorrect = null;

// Initialize
subjectSelect.addEventListener('change', updateThemeVisibility);
gradeSelect.addEventListener('change', loadQuiz);
subjectSelect.addEventListener('change', loadQuiz);
scienceThemeSelect.addEventListener('change', loadQuiz);
totalInput.addEventListener('change', loadQuiz);
prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));
showAnswerBtn.addEventListener('click', toggleAnswer);
shuffleBtn.addEventListener('click', shuffle);
randomBtn.addEventListener('click', randomQuestion);
autoToggle.addEventListener('change', toggleAuto);

function updateThemeVisibility() {
  const isScience = subjectSelect.value === 'Science';
  scienceThemeLabel.style.display = isScience ? 'block' : 'none';
  const theme = isScience ? scienceThemeSelect.value : '';
  updateSubtitle(theme);
}

function updateSubtitle(theme) {
  const subject = subjectSelect.value;
  if (subject === 'Math') {
    themeNote.textContent = '🚀 Rocket Math: Solve number problems about rockets, launch speeds, and space missions.';
  } else if (theme === 'Biology') {
    themeNote.textContent = '🧬 Biology: Learn about cells, organisms, ecosystems, and life in space.';
  } else if (theme === 'Chemistry') {
    themeNote.textContent = '⚗️ Chemistry: Understand molecules, reactions, and rocket fuel compounds.';
  } else if (theme === 'Physics') {
    themeNote.textContent = '🚀 Physics: Explore forces, motion, gravity, and rocket propulsion.';
  }
}

function generateQuestion(idx, grade, subject, theme) {
  const seed = idx + grade + subject + (theme || '');
  const rand = simpleHash(seed) / 2147483647;

  if (subject === 'Math') {
    return generateMathQuestion(grade, idx, rand);
  } else {
    return generateScienceQuestion(grade, theme, idx, rand);
  }
}

function generateMathQuestion(grade, idx, rand) {
  const topics = [
    { title: 'Rocket Speed', min: 100, max: 500, op: '+' },
    { title: 'Fuel Distance', min: 50, max: 200, op: '-' },
    { title: 'Launch Countdown', min: 10, max: 30, op: '*' },
    { title: 'Orbit Calculation', min: 5, max: 20, op: '/' }
  ];

  const topic = topics[Math.floor(rand * topics.length)];
  const a = Math.floor(rand * (topic.max - topic.min)) + topic.min;
  const b = Math.floor((rand + 0.3) % 1 * (topic.max - topic.min)) + topic.min;

  let correct;
  if (topic.op === '+') correct = a + b;
  else if (topic.op === '-') correct = a - b;
  else if (topic.op === '*') correct = a * b;
  else correct = Math.floor(a / b);

  const q = `🚀 ${topic.title}: ${a} ${topic.op} ${b} = ?`;
  const wrong1 = correct + Math.floor((rand + 0.5) % 1 * 10) + 1;
  const wrong2 = correct - Math.floor((rand + 0.7) % 1 * 10) + 1;

  return {
    question: q,
    choices: [correct, wrong1, wrong2].sort(() => Math.random() - 0.5),
    correct: correct
  };
}

function generateScienceQuestion(grade, theme, idx, rand) {
  let questions = [];

  if (theme === 'Biology') {
    questions = [
      { q: 'What is the basic unit of life?', choices: ['Cell', 'Atom', 'Molecule', 'Organ'], correct: 'Cell' },
      { q: 'Which organelle is responsible for energy production in a cell?', choices: ['Mitochondria', 'Nucleus', 'Ribosome', 'Lysosome'], correct: 'Mitochondria' },
      { q: 'What do plants use sunlight to make?', choices: ['Glucose', 'Oxygen', 'Protein', 'Starch'], correct: 'Glucose' },
      { q: 'How many chambers does a human heart have?', choices: ['4', '3', '2', '6'], correct: '4' },
      { q: 'Which gas do plants absorb from the atmosphere?', choices: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], correct: 'Carbon Dioxide' }
    ];
  } else if (theme === 'Chemistry') {
    questions = [
      { q: 'What is the chemical formula for water?', choices: ['H₂O', 'CO₂', 'O₂', 'NaCl'], correct: 'H₂O' },
      { q: 'What is the smallest unit of a chemical element?', choices: ['Atom', 'Molecule', 'Electron', 'Proton'], correct: 'Atom' },
      { q: 'Rocket fuel often contains which element?', choices: ['Hydrogen', 'Carbon', 'Nitrogen', 'Sulfur'], correct: 'Hydrogen' },
      { q: 'What do we call a substance made of two or more elements?', choices: ['Compound', 'Mixture', 'Element', 'Ion'], correct: 'Compound' },
      { q: 'What happens in a chemical reaction?', choices: ['Atoms rearrange to form new substances', 'Matter disappears', 'Energy is destroyed', 'Nothing changes'], correct: 'Atoms rearrange to form new substances' }
    ];
  } else if (theme === 'Physics') {
    questions = [
      { q: 'What force pulls objects toward Earth?', choices: ['Gravity', 'Friction', 'Magnetism', 'Inertia'], correct: 'Gravity' },
      { q: 'What is the SI unit of force?', choices: ['Newton', 'Joule', 'Watt', 'Pascal'], correct: 'Newton' },
      { q: 'Rockets move forward by pushing gas backward. This is:', choices: ['Newton\'s Third Law', 'Friction', 'Gravity', 'Momentum'], correct: 'Newton\'s Third Law' },
      { q: 'Speed and direction together describe:', choices: ['Velocity', 'Acceleration', 'Force', 'Energy'], correct: 'Velocity' },
      { q: 'An object in space with no forces acting on it will:', choices: ['Continue moving at constant speed', 'Slow down', 'Speed up', 'Stop'], correct: 'Continue moving at constant speed' }
    ];
  }

  const q = questions[Math.floor(rand * questions.length)];
  return {
    question: q.q,
    choices: q.choices,
    correct: q.correct
  };
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function loadQuiz() {
  const grade = gr
```


## License: GPL-2.0
https://github.com/gaucho-plugins/payment-page-free/blob/33ce9d817b4825ff22e4146dc7672aced6cd5435/interface/app/utility/string.js

```
I'll update the quiz to support **Biology, Chemistry, and Physics** as science themes alongside the space rocket design.

Here's what I'm changing:

````html
<!-- filepath: /Users/Pacheri/parthiv coding/quiz/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Grade Quiz — Math & Science</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="theme-space">
  <div class="app">
    <header>
      <h1>Grade Quiz</h1>
      <div class="controls">
        <label>Grade
          <select id="gradeSelect">
            <option value="4">4th Grade</option>
            <option value="7">7th Grade</option>
          </select>
        </label>
        <label>Subject
          <select id="subjectSelect">
            <option value="Math">Math</option>
            <option value="Science">Science</option>
          </select>
        </label>
        <label id="scienceThemeLabel" style="display:none">Science Theme
          <select id="scienceThemeSelect">
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
          </select>
        </label>
        <label>Total Questions
          <input id="totalInput" type="number" value="10" min="1" />
        </label>
      </div>
      <div class="subtitle" id="themeNote">A space rocket quiz with flying rockets, numbers, and scientific principles.</div>
    </header>

    <main>
      <div class="quiz-header">
        <div>Question <span id="qIndex">1</span>/<span id="qCount">1</span></div>
        <div class="auto-controls">
          <label>Auto-advance <input id="autoToggle" type="checkbox" /></label>
          <label>Interval (s) <input id="intervalInput" type="number" value="3" min="1" style="width:50px" /></label>
        </div>
      </div>

      <section id="questionCard" class="card">
        <div id="questionText" class="question">Loading...</div>
        <div id="choices" class="choices"></div>
        <div class="actions">
          <button id="prevBtn">← Prev</button>
          <button id="nextBtn">Next →</button>
          <button id="showAnswerBtn">Show Answer</button>
          <button id="shuffleBtn">Shuffle</button>
          <button id="randomBtn">Random</button>
        </div>
        <div id="answer" class="answer" aria-hidden="true"></div>
      </section>

      <footer>
      </footer>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>
````

````javascript
// filepath: /Users/Pacheri/parthiv coding/quiz/script.js
// Quiz app logic (multiple-choice + on-the-fly math/science generator)
const gradeSelect = document.getElementById('gradeSelect');
const subjectSelect = document.getElementById('subjectSelect');
const scienceThemeSelect = document.getElementById('scienceThemeSelect');
const scienceThemeLabel = document.getElementById('scienceThemeLabel');
const totalInput = document.getElementById('totalInput');
const themeNote = document.getElementById('themeNote');
const qIndexEl = document.getElementById('qIndex');
const qCountEl = document.getElementById('qCount');
const questionText = document.getElementById('questionText');
const choicesEl = document.getElementById('choices');
const answerEl = document.getElementById('answer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const randomBtn = document.getElementById('randomBtn');
const autoToggle = document.getElementById('autoToggle');
const intervalInput = document.getElementById('intervalInput');

let bank = {};
let bankLists = [];
let index = 0;
let autoTimer = null;
let totalQuestions = 0;
let currentCorrect = null;

// Initialize
subjectSelect.addEventListener('change', updateThemeVisibility);
gradeSelect.addEventListener('change', loadQuiz);
subjectSelect.addEventListener('change', loadQuiz);
scienceThemeSelect.addEventListener('change', loadQuiz);
totalInput.addEventListener('change', loadQuiz);
prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));
showAnswerBtn.addEventListener('click', toggleAnswer);
shuffleBtn.addEventListener('click', shuffle);
randomBtn.addEventListener('click', randomQuestion);
autoToggle.addEventListener('change', toggleAuto);

function updateThemeVisibility() {
  const isScience = subjectSelect.value === 'Science';
  scienceThemeLabel.style.display = isScience ? 'block' : 'none';
  const theme = isScience ? scienceThemeSelect.value : '';
  updateSubtitle(theme);
}

function updateSubtitle(theme) {
  const subject = subjectSelect.value;
  if (subject === 'Math') {
    themeNote.textContent = '🚀 Rocket Math: Solve number problems about rockets, launch speeds, and space missions.';
  } else if (theme === 'Biology') {
    themeNote.textContent = '🧬 Biology: Learn about cells, organisms, ecosystems, and life in space.';
  } else if (theme === 'Chemistry') {
    themeNote.textContent = '⚗️ Chemistry: Understand molecules, reactions, and rocket fuel compounds.';
  } else if (theme === 'Physics') {
    themeNote.textContent = '🚀 Physics: Explore forces, motion, gravity, and rocket propulsion.';
  }
}

function generateQuestion(idx, grade, subject, theme) {
  const seed = idx + grade + subject + (theme || '');
  const rand = simpleHash(seed) / 2147483647;

  if (subject === 'Math') {
    return generateMathQuestion(grade, idx, rand);
  } else {
    return generateScienceQuestion(grade, theme, idx, rand);
  }
}

function generateMathQuestion(grade, idx, rand) {
  const topics = [
    { title: 'Rocket Speed', min: 100, max: 500, op: '+' },
    { title: 'Fuel Distance', min: 50, max: 200, op: '-' },
    { title: 'Launch Countdown', min: 10, max: 30, op: '*' },
    { title: 'Orbit Calculation', min: 5, max: 20, op: '/' }
  ];

  const topic = topics[Math.floor(rand * topics.length)];
  const a = Math.floor(rand * (topic.max - topic.min)) + topic.min;
  const b = Math.floor((rand + 0.3) % 1 * (topic.max - topic.min)) + topic.min;

  let correct;
  if (topic.op === '+') correct = a + b;
  else if (topic.op === '-') correct = a - b;
  else if (topic.op === '*') correct = a * b;
  else correct = Math.floor(a / b);

  const q = `🚀 ${topic.title}: ${a} ${topic.op} ${b} = ?`;
  const wrong1 = correct + Math.floor((rand + 0.5) % 1 * 10) + 1;
  const wrong2 = correct - Math.floor((rand + 0.7) % 1 * 10) + 1;

  return {
    question: q,
    choices: [correct, wrong1, wrong2].sort(() => Math.random() - 0.5),
    correct: correct
  };
}

function generateScienceQuestion(grade, theme, idx, rand) {
  let questions = [];

  if (theme === 'Biology') {
    questions = [
      { q: 'What is the basic unit of life?', choices: ['Cell', 'Atom', 'Molecule', 'Organ'], correct: 'Cell' },
      { q: 'Which organelle is responsible for energy production in a cell?', choices: ['Mitochondria', 'Nucleus', 'Ribosome', 'Lysosome'], correct: 'Mitochondria' },
      { q: 'What do plants use sunlight to make?', choices: ['Glucose', 'Oxygen', 'Protein', 'Starch'], correct: 'Glucose' },
      { q: 'How many chambers does a human heart have?', choices: ['4', '3', '2', '6'], correct: '4' },
      { q: 'Which gas do plants absorb from the atmosphere?', choices: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], correct: 'Carbon Dioxide' }
    ];
  } else if (theme === 'Chemistry') {
    questions = [
      { q: 'What is the chemical formula for water?', choices: ['H₂O', 'CO₂', 'O₂', 'NaCl'], correct: 'H₂O' },
      { q: 'What is the smallest unit of a chemical element?', choices: ['Atom', 'Molecule', 'Electron', 'Proton'], correct: 'Atom' },
      { q: 'Rocket fuel often contains which element?', choices: ['Hydrogen', 'Carbon', 'Nitrogen', 'Sulfur'], correct: 'Hydrogen' },
      { q: 'What do we call a substance made of two or more elements?', choices: ['Compound', 'Mixture', 'Element', 'Ion'], correct: 'Compound' },
      { q: 'What happens in a chemical reaction?', choices: ['Atoms rearrange to form new substances', 'Matter disappears', 'Energy is destroyed', 'Nothing changes'], correct: 'Atoms rearrange to form new substances' }
    ];
  } else if (theme === 'Physics') {
    questions = [
      { q: 'What force pulls objects toward Earth?', choices: ['Gravity', 'Friction', 'Magnetism', 'Inertia'], correct: 'Gravity' },
      { q: 'What is the SI unit of force?', choices: ['Newton', 'Joule', 'Watt', 'Pascal'], correct: 'Newton' },
      { q: 'Rockets move forward by pushing gas backward. This is:', choices: ['Newton\'s Third Law', 'Friction', 'Gravity', 'Momentum'], correct: 'Newton\'s Third Law' },
      { q: 'Speed and direction together describe:', choices: ['Velocity', 'Acceleration', 'Force', 'Energy'], correct: 'Velocity' },
      { q: 'An object in space with no forces acting on it will:', choices: ['Continue moving at constant speed', 'Slow down', 'Speed up', 'Stop'], correct: 'Continue moving at constant speed' }
    ];
  }

  const q = questions[Math.floor(rand * questions.length)];
  return {
    question: q.q,
    choices: q.choices,
    correct: q.correct
  };
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function loadQuiz() {
  const grade = gr
```


## License: GPL-2.0
https://github.com/gaucho-plugins/payment-page-free/blob/33ce9d817b4825ff22e4146dc7672aced6cd5435/interface/app/utility/string.js

```
I'll update the quiz to support **Biology, Chemistry, and Physics** as science themes alongside the space rocket design.

Here's what I'm changing:

````html
<!-- filepath: /Users/Pacheri/parthiv coding/quiz/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Grade Quiz — Math & Science</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="theme-space">
  <div class="app">
    <header>
      <h1>Grade Quiz</h1>
      <div class="controls">
        <label>Grade
          <select id="gradeSelect">
            <option value="4">4th Grade</option>
            <option value="7">7th Grade</option>
          </select>
        </label>
        <label>Subject
          <select id="subjectSelect">
            <option value="Math">Math</option>
            <option value="Science">Science</option>
          </select>
        </label>
        <label id="scienceThemeLabel" style="display:none">Science Theme
          <select id="scienceThemeSelect">
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
          </select>
        </label>
        <label>Total Questions
          <input id="totalInput" type="number" value="10" min="1" />
        </label>
      </div>
      <div class="subtitle" id="themeNote">A space rocket quiz with flying rockets, numbers, and scientific principles.</div>
    </header>

    <main>
      <div class="quiz-header">
        <div>Question <span id="qIndex">1</span>/<span id="qCount">1</span></div>
        <div class="auto-controls">
          <label>Auto-advance <input id="autoToggle" type="checkbox" /></label>
          <label>Interval (s) <input id="intervalInput" type="number" value="3" min="1" style="width:50px" /></label>
        </div>
      </div>

      <section id="questionCard" class="card">
        <div id="questionText" class="question">Loading...</div>
        <div id="choices" class="choices"></div>
        <div class="actions">
          <button id="prevBtn">← Prev</button>
          <button id="nextBtn">Next →</button>
          <button id="showAnswerBtn">Show Answer</button>
          <button id="shuffleBtn">Shuffle</button>
          <button id="randomBtn">Random</button>
        </div>
        <div id="answer" class="answer" aria-hidden="true"></div>
      </section>

      <footer>
      </footer>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>
````

````javascript
// filepath: /Users/Pacheri/parthiv coding/quiz/script.js
// Quiz app logic (multiple-choice + on-the-fly math/science generator)
const gradeSelect = document.getElementById('gradeSelect');
const subjectSelect = document.getElementById('subjectSelect');
const scienceThemeSelect = document.getElementById('scienceThemeSelect');
const scienceThemeLabel = document.getElementById('scienceThemeLabel');
const totalInput = document.getElementById('totalInput');
const themeNote = document.getElementById('themeNote');
const qIndexEl = document.getElementById('qIndex');
const qCountEl = document.getElementById('qCount');
const questionText = document.getElementById('questionText');
const choicesEl = document.getElementById('choices');
const answerEl = document.getElementById('answer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const randomBtn = document.getElementById('randomBtn');
const autoToggle = document.getElementById('autoToggle');
const intervalInput = document.getElementById('intervalInput');

let bank = {};
let bankLists = [];
let index = 0;
let autoTimer = null;
let totalQuestions = 0;
let currentCorrect = null;

// Initialize
subjectSelect.addEventListener('change', updateThemeVisibility);
gradeSelect.addEventListener('change', loadQuiz);
subjectSelect.addEventListener('change', loadQuiz);
scienceThemeSelect.addEventListener('change', loadQuiz);
totalInput.addEventListener('change', loadQuiz);
prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));
showAnswerBtn.addEventListener('click', toggleAnswer);
shuffleBtn.addEventListener('click', shuffle);
randomBtn.addEventListener('click', randomQuestion);
autoToggle.addEventListener('change', toggleAuto);

function updateThemeVisibility() {
  const isScience = subjectSelect.value === 'Science';
  scienceThemeLabel.style.display = isScience ? 'block' : 'none';
  const theme = isScience ? scienceThemeSelect.value : '';
  updateSubtitle(theme);
}

function updateSubtitle(theme) {
  const subject = subjectSelect.value;
  if (subject === 'Math') {
    themeNote.textContent = '🚀 Rocket Math: Solve number problems about rockets, launch speeds, and space missions.';
  } else if (theme === 'Biology') {
    themeNote.textContent = '🧬 Biology: Learn about cells, organisms, ecosystems, and life in space.';
  } else if (theme === 'Chemistry') {
    themeNote.textContent = '⚗️ Chemistry: Understand molecules, reactions, and rocket fuel compounds.';
  } else if (theme === 'Physics') {
    themeNote.textContent = '🚀 Physics: Explore forces, motion, gravity, and rocket propulsion.';
  }
}

function generateQuestion(idx, grade, subject, theme) {
  const seed = idx + grade + subject + (theme || '');
  const rand = simpleHash(seed) / 2147483647;

  if (subject === 'Math') {
    return generateMathQuestion(grade, idx, rand);
  } else {
    return generateScienceQuestion(grade, theme, idx, rand);
  }
}

function generateMathQuestion(grade, idx, rand) {
  const topics = [
    { title: 'Rocket Speed', min: 100, max: 500, op: '+' },
    { title: 'Fuel Distance', min: 50, max: 200, op: '-' },
    { title: 'Launch Countdown', min: 10, max: 30, op: '*' },
    { title: 'Orbit Calculation', min: 5, max: 20, op: '/' }
  ];

  const topic = topics[Math.floor(rand * topics.length)];
  const a = Math.floor(rand * (topic.max - topic.min)) + topic.min;
  const b = Math.floor((rand + 0.3) % 1 * (topic.max - topic.min)) + topic.min;

  let correct;
  if (topic.op === '+') correct = a + b;
  else if (topic.op === '-') correct = a - b;
  else if (topic.op === '*') correct = a * b;
  else correct = Math.floor(a / b);

  const q = `🚀 ${topic.title}: ${a} ${topic.op} ${b} = ?`;
  const wrong1 = correct + Math.floor((rand + 0.5) % 1 * 10) + 1;
  const wrong2 = correct - Math.floor((rand + 0.7) % 1 * 10) + 1;

  return {
    question: q,
    choices: [correct, wrong1, wrong2].sort(() => Math.random() - 0.5),
    correct: correct
  };
}

function generateScienceQuestion(grade, theme, idx, rand) {
  let questions = [];

  if (theme === 'Biology') {
    questions = [
      { q: 'What is the basic unit of life?', choices: ['Cell', 'Atom', 'Molecule', 'Organ'], correct: 'Cell' },
      { q: 'Which organelle is responsible for energy production in a cell?', choices: ['Mitochondria', 'Nucleus', 'Ribosome', 'Lysosome'], correct: 'Mitochondria' },
      { q: 'What do plants use sunlight to make?', choices: ['Glucose', 'Oxygen', 'Protein', 'Starch'], correct: 'Glucose' },
      { q: 'How many chambers does a human heart have?', choices: ['4', '3', '2', '6'], correct: '4' },
      { q: 'Which gas do plants absorb from the atmosphere?', choices: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'], correct: 'Carbon Dioxide' }
    ];
  } else if (theme === 'Chemistry') {
    questions = [
      { q: 'What is the chemical formula for water?', choices: ['H₂O', 'CO₂', 'O₂', 'NaCl'], correct: 'H₂O' },
      { q: 'What is the smallest unit of a chemical element?', choices: ['Atom', 'Molecule', 'Electron', 'Proton'], correct: 'Atom' },
      { q: 'Rocket fuel often contains which element?', choices: ['Hydrogen', 'Carbon', 'Nitrogen', 'Sulfur'], correct: 'Hydrogen' },
      { q: 'What do we call a substance made of two or more elements?', choices: ['Compound', 'Mixture', 'Element', 'Ion'], correct: 'Compound' },
      { q: 'What happens in a chemical reaction?', choices: ['Atoms rearrange to form new substances', 'Matter disappears', 'Energy is destroyed', 'Nothing changes'], correct: 'Atoms rearrange to form new substances' }
    ];
  } else if (theme === 'Physics') {
    questions = [
      { q: 'What force pulls objects toward Earth?', choices: ['Gravity', 'Friction', 'Magnetism', 'Inertia'], correct: 'Gravity' },
      { q: 'What is the SI unit of force?', choices: ['Newton', 'Joule', 'Watt', 'Pascal'], correct: 'Newton' },
      { q: 'Rockets move forward by pushing gas backward. This is:', choices: ['Newton\'s Third Law', 'Friction', 'Gravity', 'Momentum'], correct: 'Newton\'s Third Law' },
      { q: 'Speed and direction together describe:', choices: ['Velocity', 'Acceleration', 'Force', 'Energy'], correct: 'Velocity' },
      { q: 'An object in space with no forces acting on it will:', choices: ['Continue moving at constant speed', 'Slow down', 'Speed up', 'Stop'], correct: 'Continue moving at constant speed' }
    ];
  }

  const q = questions[Math.floor(rand * questions.length)];
  return {
    question: q.q,
    choices: q.choices,
    correct: q.correct
  };
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function loadQuiz() {
  const grade = gr
```

