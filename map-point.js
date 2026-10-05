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
  const mapClassName = currentMap === 'earth' ? 'earth-map' : 'space-map';
  mapSurface.className = `map-surface ${mapClassName}`;
  mapSurface.style.backgroundImage = '';
  mapSurface.innerHTML = '';

  if (currentMap === 'earth') {
    const referenceImageUrl = 'world-map-reference.png';
    mapSurface.classList.add('reference-map');
    mapSurface.style.backgroundImage = `url("${referenceImageUrl}")`;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1000 560');
    svg.setAttribute('class', 'world-svg');

    const landShapes = [
      { name: 'North America', d: 'M114 146 L156 98 L212 74 L278 84 L332 116 L368 160 L390 190 L360 214 L336 246 L292 262 L270 296 L234 300 L196 322 L152 314 L118 282 L94 232 L88 196 L104 172 Z', fill: '#f4a261' },
      { name: 'South America', d: 'M276 300 L316 334 L332 374 L330 430 L314 484 L286 522 L250 530 L224 504 L214 456 L220 412 L206 364 L222 322 Z', fill: '#e9c46a' },
      { name: 'Europe', d: 'M458 126 L490 104 L534 100 L566 116 L588 144 L576 176 L542 198 L506 196 L474 172 L454 146 Z', fill: '#90be6d' },
      { name: 'Africa', d: 'M466 204 L518 186 L572 196 L606 230 L624 282 L612 344 L578 410 L538 454 L502 470 L468 434 L448 390 L438 332 L448 266 Z', fill: '#8ecae6' },
      { name: 'Asia', d: 'M572 144 L632 110 L704 104 L770 120 L836 150 L900 184 L930 226 L916 272 L884 306 L824 314 L778 332 L734 308 L682 316 L634 290 L600 246 L574 204 Z', fill: '#a7c957' },
      { name: 'Australia', d: 'M758 356 L826 344 L896 360 L918 400 L900 444 L844 464 L782 444 L742 402 Z', fill: '#ffb703' },
      { name: 'Antarctica', d: 'M206 500 L340 488 L482 490 L630 488 L814 502 L874 526 L864 548 L644 550 L414 542 L272 534 Z', fill: '#8ecae6' }
    ];

    landShapes.forEach((shape) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', shape.d);
      path.setAttribute('class', 'continent-shape');
      path.setAttribute('data-shape-name', shape.name);
      path.setAttribute('fill', shape.fill);
      path.setAttribute('stroke', '#1e293b');
      path.setAttribute('stroke-width', '2.2');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-linecap', 'round');
      path.style.fill = shape.fill;
      path.style.stroke = '#1e293b';
      path.style.strokeWidth = '2.2';
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
