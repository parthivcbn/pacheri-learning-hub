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
      { name: 'Antarctica', x: 52, y: 88 }
    ],
    questions: [
      { question: 'Tap the continent where the Sahara Desert is found.', answer: 'Africa' },
      { question: 'Which continent is the largest and has the Great Wall?', answer: 'Asia' },
      { question: 'Tap the continent that is the smallest and is also an island.', answer: 'Australia' },
      { question: 'Which continent is home to the Amazon Rainforest?', answer: 'South America' },
      { question: 'Which continent is directly west of Europe?', answer: 'North America' }
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
