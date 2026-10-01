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
      { name: 'North America', d: 'M110 148 L170 90 L246 96 L290 130 L294 166 L260 196 L230 220 L192 210 L170 246 L146 235 L120 212 L96 180 Z' },
      { name: 'South America', d: 'M255 248 L285 278 L310 330 L298 390 L278 450 L246 500 L220 472 L210 420 L226 356 L216 300 Z' },
      { name: 'Europe', d: 'M470 120 L508 94 L548 100 L566 136 L551 168 L516 180 L484 166 Z' },
      { name: 'Africa', d: 'M500 188 L560 175 L604 214 L620 258 L612 312 L574 370 L530 412 L492 372 L472 300 L486 236 Z' },
      { name: 'Asia', d: 'M565 120 L668 94 L760 112 L836 136 L900 170 L918 240 L870 278 L788 268 L716 290 L654 270 L610 212 L586 164 Z' },
      { name: 'Australia', d: 'M770 365 L838 342 L892 368 L898 428 L860 470 L794 458 L760 420 Z' },
      { name: 'Antarctica', d: 'M210 490 L410 468 L620 484 L790 478 L900 500 L878 532 L650 544 L370 536 L220 520 Z' }
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
