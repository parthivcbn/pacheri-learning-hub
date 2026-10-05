const questions = [
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Venus', 'Mercury', 'Jupiter'],
    answer: 'Mars'
  },
  {
    question: 'Which planet has the most famous ring system?',
    options: ['Saturn', 'Neptune', 'Earth', 'Mars'],
    answer: 'Saturn'
  },
  {
    question: 'What is the name of Earth\'s natural satellite?',
    options: ['Titan', 'Europa', 'Moon', 'Phobos'],
    answer: 'Moon'
  },
  {
    question: 'Which planet is closest to the Sun?',
    options: ['Mercury', 'Venus', 'Earth', 'Mars'],
    answer: 'Mercury'
  },
  {
    question: 'Which planet is famous for its Great Red Spot?',
    options: ['Jupiter', 'Mars', 'Mercury', 'Uranus'],
    answer: 'Jupiter'
  },
  {
    question: 'What do we call a rock that enters Earth\'s atmosphere and burns up?',
    options: ['Meteor', 'Comet', 'Asteroid', 'Planet'],
    answer: 'Meteor'
  },
  {
    question: 'Which planet is known for its blue color because of methane gas?',
    options: ['Neptune', 'Venus', 'Earth', 'Mars'],
    answer: 'Neptune'
  },
  {
    question: 'What is the center of our solar system?',
    options: ['Sun', 'Earth', 'Moon', 'Mars'],
    answer: 'Sun'
  },
  {
    question: 'Which moon is known for having an icy surface and possible ocean beneath?',
    options: ['Europa', 'Titan', 'Phobos', 'Io'],
    answer: 'Europa'
  },
  {
    question: 'Which planet spins on its side, with an extreme tilt?',
    options: ['Uranus', 'Venus', 'Jupiter', 'Mercury'],
    answer: 'Uranus'
  }
];

const gameState = {
  index: 0,
  score: 0,
  streak: 0,
  timeLeft: 15,
  timerId: null,
  playing: false
};

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const streakEl = document.getElementById('streak');
const progressEl = document.getElementById('progress');
const questionTextEl = document.getElementById('questionText');
const answerListEl = document.getElementById('answerList');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('startBtn');

function updateScoreboard() {
  scoreEl.textContent = `Score: ${gameState.score}`;
  timerEl.textContent = `Time: ${gameState.timeLeft}s`;
  streakEl.textContent = `Streak: ${gameState.streak}`;
}

function setMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

function clearTimer() {
  if (gameState.timerId) {
    clearInterval(gameState.timerId);
    gameState.timerId = null;
  }
}

function showQuestion() {
  if (!gameState.playing || gameState.index >= questions.length) {
    endGame();
    return;
  }

  const current = questions[gameState.index];
  questionTextEl.textContent = current.question;
  progressEl.textContent = `Question ${gameState.index + 1}/${questions.length}`;
  answerListEl.innerHTML = '';
  gameState.timeLeft = 15;
  updateScoreboard();

  current.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => handleAnswer(option, current.answer));
    answerListEl.appendChild(btn);
  });

  clearTimer();
  gameState.timerId = setInterval(() => {
    gameState.timeLeft -= 1;
    updateScoreboard();

    if (gameState.timeLeft <= 0) {
      clearTimer();
      handleAnswer(null, current.answer, true);
    }
  }, 1000);
}

function handleAnswer(selected, correct, timedOut = false) {
  if (!gameState.playing) return;

  clearTimer();

  const buttons = [...answerListEl.querySelectorAll('.answer-btn')];
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.classList.add('correct');
    }
    if (selected && btn.textContent === selected && btn.textContent !== correct) {
      btn.classList.add('wrong');
    }
  });

  if (selected === correct) {
    const points = 10 + gameState.streak * 5;
    gameState.score += points;
    gameState.streak += 1;
    setMessage(`Correct! +${points} points.`, 'success');
  } else if (timedOut) {
    gameState.streak = 0;
    setMessage(`Time is up! The correct answer was ${correct}.`, 'error');
  } else {
    gameState.score = Math.max(0, gameState.score - 5);
    gameState.streak = 0;
    setMessage(`Not quite. The correct answer was ${correct}.`, 'error');
  }

  updateScoreboard();

  setTimeout(() => {
    gameState.index += 1;
    showQuestion();
  }, 1200);
}

function endGame() {
  clearTimer();
  gameState.playing = false;
  questionTextEl.textContent = `Mission complete! Final score: ${gameState.score}`;
  answerListEl.innerHTML = '';
  progressEl.textContent = 'Game over';
  const message = gameState.score >= 70
    ? 'Outstanding mission control work! You are a space star.'
    : gameState.score >= 40
      ? 'Nice work! A few more missions and you will be an expert.'
      : 'Keep exploring — every mission helps you learn more about space.';
  setMessage(message, 'success');
  startBtn.textContent = 'Play Again';
}

function startGame() {
  gameState.index = 0;
  gameState.score = 0;
  gameState.streak = 0;
  gameState.playing = true;
  startBtn.textContent = 'Restart Mission';
  setMessage('Lift-off! Choose the correct answer before the timer reaches zero.', 'info');
  updateScoreboard();
  showQuestion();
}

startBtn.addEventListener('click', startGame);
updateScoreboard();
