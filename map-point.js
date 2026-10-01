const mapData = {
  earth: {
    name: 'Earth Map',
    points: [
      { name: 'North America', x: 18, y: 27 },
      { name: 'South America', x: 29, y: 68 },
      { name: 'Europe', x: 52, y: 26 },
      { name: 'Africa', x: 55, y: 52 },
      { name: 'Asia', x: 72, y: 34 },
      { name: 'Australia', x: 85, y: 72 },
      { name: 'Antarctica', x: 52, y: 88 },
      { name: 'Pacific Ocean', x: 22, y: 52 },
      { name: 'Atlantic Ocean', x: 40, y: 46 },
      { name: 'Indian Ocean', x: 70, y: 66 },
      { name: 'Arctic Ocean', x: 48, y: 12 }
    ],
    questions: [
      { question: 'Tap the continent where the Sahara Desert is found.', answer: 'Africa' },
      { question: 'Which continent is the largest and has the Great Wall?', answer: 'Asia' },
      { question: 'Tap the continent that is the smallest and is also an island.', answer: 'Australia' },
      { question: 'Which continent is home to the Amazon Rainforest?', answer: 'South America' },
      { question: 'Which continent is directly west of Europe?', answer: 'North America' },
      { question: 'Tap the ocean between North America and Europe.', answer: 'Atlantic Ocean' },
      { question: 'Which ocean is the largest and lies west of South America?', answer: 'Pacific Ocean' },
      { question: 'Tap the ocean that is found near the North Pole.', answer: 'Arctic Ocean' },
      { question: 'Which ocean lies between Africa and Australia?', answer: 'Indian Ocean' },
      { question: 'Tap the continent that is freezing and surrounds the South Pole.', answer: 'Antarctica' }
    ]
  },
  space: {
    name: 'Space Map',
    points: [
      { name: 'Mercury', x: 13, y: 45 },
      { name: 'Venus', x: 29, y: 36 },
      { name: 'Earth', x: 42, y: 52 },
      { name: 'Mars', x: 54, y: 42 },
      { name: 'Jupiter', x: 70, y: 32 },
      { name: 'Saturn', x: 82, y: 52 }
    ],
    questions: [
      { question: 'Tap the planet known as the Red Planet.', answer: 'Mars' },
      { question: 'Which planet is closest to the Sun?', answer: 'Mercury' },
      { question: 'Tap the planet we live on.', answer: 'Earth' },
      { question: 'Which planet is famous for its giant rings?', answer: 'Saturn' },
      { question: 'Tap the largest planet in our Solar System.', answer: 'Jupiter' }
    ]
  }
};

const panels = {
  choice: document.getElementById('mapChoicePanel'),
  game: document.getElementById('gamePanel'),
  result: document.getElementById('resultPanel')
};

const mapNameEl = document.getElementById('mapName');
const questionTextEl = document.getElementById('questionText');
const mapContainerEl = document.getElementById('mapContainer');
const feedbackEl = document.getElementById('feedback');
const scoreValueEl = document.getElementById('scoreValue');
const progressTextEl = document.getElementById('progressText');
const nextBtn = document.getElementById('nextBtn');
const resultTextEl = document.getElementById('resultText');

let currentMap = 'earth';
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function showPanel(name) {
  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle('active', key === name);
  });
}

function renderMap() {
  const selectedMap = mapData[currentMap];
  const mapSurface = mapContainerEl;
  mapSurface.className = `map-surface ${currentMap === 'earth' ? 'earth-map' : 'space-map'}`;
  mapSurface.innerHTML = '';

  if (currentMap === 'earth') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1000 560');
    svg.setAttribute('class', 'world-svg');

    const landShapes = [
      { name: 'North America', d: 'M118 144 L170 96 L220 86 L270 104 L320 134 L350 168 L368 198 L330 228 L312 254 L284 270 L258 290 L220 288 L188 304 L150 298 L120 258 L96 214 L104 176 Z' },
      { name: 'South America', d: 'M258 300 L292 330 L308 366 L314 410 L296 454 L276 494 L248 520 L220 486 L212 448 L218 406 L210 360 L224 322 Z' },
      { name: 'Europe', d: 'M456 122 L490 106 L526 110 L548 134 L564 162 L548 184 L514 192 L482 176 L456 150 Z' },
      { name: 'Africa', d: 'M466 200 L512 184 L560 196 L602 228 L614 286 L592 340 L570 390 L536 448 L500 470 L468 430 L450 400 L440 328 L446 252 Z' },
      { name: 'Asia', d: 'M572 150 L628 118 L688 108 L738 116 L798 136 L850 160 L900 196 L920 230 L904 274 L874 304 L822 300 L776 318 L724 292 L676 306 L628 286 L594 246 L564 214 Z' },
      { name: 'Australia', d: 'M760 350 L820 340 L892 360 L912 400 L890 440 L832 462 L770 430 L744 388 Z' },
      { name: 'Antarctica', d: 'M200 500 L332 482 L474 490 L628 488 L808 500 L878 526 L862 548 L664 548 L420 542 L262 532 Z' }
    ];

    landShapes.forEach((shape) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', shape.d);
      path.setAttribute('class', 'continent-shape');
      path.setAttribute('data-shape-name', shape.name);
      svg.appendChild(path);
    });

    const oceanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    oceanText.setAttribute('x', '500');
    oceanText.setAttribute('y', '45');
    oceanText.setAttribute('text-anchor', 'middle');
    oceanText.setAttribute('class', 'ocean-label');
    oceanText.textContent = 'Pacific Ocean';
    svg.appendChild(oceanText);

    const oceanText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    oceanText2.setAttribute('x', '500');
    oceanText2.setAttribute('y', '540');
    oceanText2.setAttribute('text-anchor', 'middle');
    oceanText2.setAttribute('class', 'ocean-label');
    oceanText2.textContent = 'Southern Ocean';
    svg.appendChild(oceanText2);

    mapSurface.appendChild(svg);
  }

  selectedMap.points.forEach((point) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hotspot';
    btn.dataset.place = point.name;
    btn.style.left = `${point.x}%`;
    btn.style.top = `${point.y}%`;
    btn.textContent = point.name;
    btn.disabled = false;
    btn.addEventListener('click', handleAnswer);
    mapSurface.appendChild(btn);
  });
}

function renderQuestion() {
  const selectedMap = mapData[currentMap];
  const question = selectedMap.questions[currentQuestionIndex];
  mapNameEl.textContent = selectedMap.name;
  questionTextEl.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
  progressTextEl.textContent = `Question ${currentQuestionIndex + 1} of ${selectedMap.questions.length}`;
  scoreValueEl.textContent = score;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  answered = false;
  nextBtn.disabled = true;
  renderMap();
}

function handleAnswer(event) {
  if (answered) return;

  answered = true;
  const selected = event.currentTarget.dataset.place;
  const question = mapData[currentMap].questions[currentQuestionIndex];
  const correctAnswer = question.answer;
  const hotspots = document.querySelectorAll('.hotspot');

  hotspots.forEach((hotspot) => {
    hotspot.disabled = true;
    const place = hotspot.dataset.place;
    if (place === correctAnswer) {
      hotspot.classList.add('correct');
    }
    if (place === selected && place !== correctAnswer) {
      hotspot.classList.add('wrong');
    }
  });

  if (selected === correctAnswer) {
    score += 1;
    scoreValueEl.textContent = score;
    feedbackEl.textContent = `✅ Correct! ${correctAnswer} is the right answer.`;
    feedbackEl.classList.add('success');
  } else {
    feedbackEl.textContent = `❌ Not quite. The correct answer is ${correctAnswer}.`;
    feedbackEl.classList.add('error');
  }

  nextBtn.disabled = false;
}

function nextQuestion() {
  const currentQuestions = mapData[currentMap].questions;

  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
    return;
  }

  const totalQuestions = currentQuestions.length;
  resultTextEl.textContent = `You scored ${score} out of ${totalQuestions}. Great effort!`;
  showPanel('result');
}

function startMap(mapName) {
  currentMap = mapName;
  currentQuestionIndex = 0;
  score = 0;
  showPanel('game');
  renderQuestion();
}

function resetToChoice() {
  currentQuestionIndex = 0;
  score = 0;
  showPanel('choice');
}

document.querySelectorAll('.map-choice').forEach((button) => {
  button.addEventListener('click', () => startMap(button.dataset.map));
});

document.getElementById('nextBtn').addEventListener('click', nextQuestion);
document.getElementById('changeMapBtn').addEventListener('click', resetToChoice);
document.getElementById('playAgainBtn').addEventListener('click', () => startMap(currentMap));
document.getElementById('resultChangeMapBtn').addEventListener('click', resetToChoice);

showPanel('choice');
