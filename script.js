// ✨ FUN CELEBRATION EFFECTS! ✨
const celebrationMessages = ['🎉 Awesome!', '⭐ Brilliant!', '🚀 Fantastic!', '💫 Perfect!', '🌟 Excellent!', '🎯 Spot on!', '🔥 Amazing!', '✨ Superb!', '🏆 Champion!'];

function triggerCelebration(x, y) {
  const container = document.getElementById('celebrationContainer');
  if (!container) return;
  
  // Confetti burst
  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
    confetti.style.top = (y + (Math.random() - 0.5) * 100) + 'px';
    confetti.style.background = ['#00d4ff', '#7dd3fc', '#22c55e', '#fbbf24', '#f87171'][Math.floor(Math.random() * 5)];
    confetti.style.setProperty('--delay', (Math.random() * 0.5) + 's');
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3500);
  }
  
  // Fireworks explosion
  for (let i = 0; i < 20; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    const angle = (i / 20) * Math.PI * 2;
    const distance = 100 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    firework.style.background = ['#00d4ff', '#7dd3fc', '#22c55e', '#fbbf24', '#f87171'][Math.floor(Math.random() * 5)];
    firework.style.setProperty('--tx', tx + 'px');
    firework.style.setProperty('--ty', ty + 'px');
    container.appendChild(firework);
    setTimeout(() => firework.remove(), 1800);
  }
  
  // Celebration text
  const msg = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
  const text = document.createElement('div');
  text.className = 'celebration-text';
  text.textContent = msg;
  text.style.left = (x - 40) + 'px';
  text.style.top = (y - 40) + 'px';
  text.style.color = ['#00d4ff', '#22c55e', '#fbbf24'][Math.floor(Math.random() * 3)];
  container.appendChild(text);
  setTimeout(() => text.remove(), 1800);
  
  // Star burst
  for (let i = 0; i < 8; i++) {
    const star = document.createElement('div');
    star.className = 'celebration-star';
    star.textContent = ['⭐', '✨', '💫'][Math.floor(Math.random() * 3)];
    const angle = (i / 8) * Math.PI * 2;
    star.style.left = (x + Math.cos(angle) * 20) + 'px';
    star.style.top = (y + Math.sin(angle) * 20) + 'px';
    container.appendChild(star);
    setTimeout(() => star.remove(), 1800);
  }
}

// 🎮 MINI GAME: Quick Memory Challenge
const memoryGameData = {
  questionsAnswered: 0,
  nextGameAt: Math.floor(Math.random() * 2) + 4, // 4-5 questions
  items: [],
  correctAnswer: null,
  isGameActive: false
};

const memoryItems = ['🐱', '🎸', '🍕', '⚡', '🌟', '📚', '🎨', '🚀', '🎲', '🏆', '🌈', '💎'];

function getRandomItems(count = 3) {
  const shuffled = memoryItems.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function showMiniGame() {
  if (memoryGameData.isGameActive) return;
  
  memoryGameData.isGameActive = true;
  memoryGameData.items = getRandomItems(3);
  memoryGameData.correctAnswer = memoryGameData.items.join('');
  
  const modal = document.getElementById('miniGameModal');
  const overlay = document.getElementById('miniGameOverlay');
  const itemsContainer = document.getElementById('memoryItemsContainer');
  const gameContent = document.getElementById('memoryGameContent');
  const bonusAlert = document.getElementById('bonusAlert');
  
  if (!modal) return;
  
  // Show items
  itemsContainer.innerHTML = '';
  memoryGameData.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.textContent = item;
    itemsContainer.appendChild(card);
  });
  
  gameContent.innerHTML = '';
  bonusAlert.innerHTML = '';
  
  modal.classList.add('show');
  overlay.classList.add('show');
  
  // Hide items after 3 seconds
  setTimeout(() => {
    itemsContainer.querySelectorAll('.memory-card').forEach(card => {
      card.classList.add('hidden');
    });
    
    // Add input to guess
    const inputDiv = document.createElement('div');
    inputDiv.className = 'memory-input-group';
    inputDiv.innerHTML = `
      <input type="text" id="memoryInput" placeholder="What were the items? (no spaces)" maxlength="3">
    `;
    gameContent.appendChild(inputDiv);
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'memory-btn';
    submitBtn.textContent = 'Submit Answer';
    submitBtn.onclick = checkMemoryAnswer;
    gameContent.appendChild(submitBtn);
    
    const inputField = document.getElementById('memoryInput');
    inputField.focus();
  }, 3000);
}

function checkMemoryAnswer() {
  const input = document.getElementById('memoryInput');
  if (!input) return;
  
  const userAnswer = input.value.trim().toUpperCase();
  const correctAnswer = memoryGameData.correctAnswer;
  const bonusAlert = document.getElementById('bonusAlert');
  const gameContent = document.getElementById('memoryGameContent');
  
  if (userAnswer === correctAnswer) {
    // Correct! Add bonus points
    correctCount += 10;
    bonusAlert.innerHTML = '✅ Correct! +10 Bonus Points! 🎉';
    bonusAlert.style.background = 'rgba(34, 197, 94, 0.3)';
    bonusAlert.style.borderColor = '#22c55e';
    bonusAlert.style.color = '#86efac';
    
    triggerCelebration(window.innerWidth / 2, window.innerHeight / 2);
  } else {
    bonusAlert.innerHTML = `❌ Oops! The answer was: ${correctAnswer}`;
    bonusAlert.style.background = 'rgba(248, 113, 113, 0.2)';
    bonusAlert.style.borderColor = '#f87171';
    bonusAlert.style.color = '#fca5a5';
  }
  
  // Disable input
  input.disabled = true;
  const submitBtn = gameContent.querySelector('button');
  if (submitBtn) submitBtn.disabled = true;
  
  // Close after 3 seconds
  setTimeout(() => {
    closeMiniGame();
  }, 3000);
}

function closeMiniGame() {
  const modal = document.getElementById('miniGameModal');
  const overlay = document.getElementById('miniGameOverlay');
  
  if (modal) modal.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
  
  memoryGameData.isGameActive = false;
  memoryGameData.questionsAnswered = 0;
  memoryGameData.nextGameAt = Math.floor(Math.random() * 2) + 4; // Reset for next game
}

// Quiz app logic (multiple-choice + on-the-fly math/science generator)
function init(){
// DOM-dependent initialization
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
const tutorQuestionInput = document.getElementById('tutorQuestionInput');
const tutorAskBtn = document.getElementById('tutorAskBtn');
const tutorReply = document.getElementById('tutorReply');
const tutorGame = document.getElementById('tutorGame');

  // Diagnostics: log missing elements
    const elems = {
      gradeSelect,
      subjectSelect,
      scienceThemeSelect,
      scienceThemeLabel,
      totalInput,
      themeNote,
      qIndexEl,
      qCountEl,
      questionText,
      choicesEl,
      answerEl,
      prevBtn,
      nextBtn,
      showAnswerBtn,
      shuffleBtn,
      randomBtn,
      autoToggle,
      intervalInput,
      tutorQuestionInput,
      tutorAskBtn,
      tutorReply,
      tutorGame
    };
  Object.entries(elems).forEach(([k,v])=>{ if (!v) console.warn(`[init] Missing element: ${k}`); });

  const hasQuizUI = !!(gradeSelect && subjectSelect && totalInput && qIndexEl && qCountEl && questionText && choicesEl && answerEl);

let bank = {};
let bankLists = [];
let index = 0;
let autoTimer = null;
let totalQuestions = 0;
let currentCorrect = null;
let correctCount = 0;
let startTime = null;

// Score tracking for social sharing
function trackCorrectAnswer() {
  correctCount++;
}

function getQuizScore() {
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return {
    percentage,
    correct: `${correctCount}/${totalQuestions}`,
    time: timeStr
  };
}

function shareQuizResults() {
  const grade = gradeSelect.value;
  const subject = subjectSelect.value === 'science' ? scienceThemeSelect.value : subjectSelect.value;
  const score = getQuizScore();
  const params = new URLSearchParams({
    score: score.percentage,
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    correct: score.correct,
    time: score.time
  });
  sessionStorage.setItem('quizScore', score.percentage);
  sessionStorage.setItem('quizSubject', subject.charAt(0).toUpperCase() + subject.slice(1));
  sessionStorage.setItem('quizCorrect', score.correct);
  sessionStorage.setItem('quizTime', score.time);
  window.location.href = `social-share.html?${params}`;
}

// Multiple-choice BANK: each entry has {q, choices: [...], correct}
bank = {
  '7': {
    math: [
      {q: 'What is the prime factorization of 84?', choices:['2×3×7','2²×3×7','2×2×7','2×3×3×7'], correct:1},
      {q: 'Solve for x: 3x + 5 = 20', choices:['x=3','x=4','x=5','x=6'], correct:2},
      {q: 'What is 12% of 250?', choices:['20','25','30','35'], correct:2},
      {q: 'Convert 3/4 to a decimal', choices:['0.25','0.5','0.75','1.25'], correct:2},
      {q: 'What is the area of a triangle with base 10 and height 6?', choices:['16','30','60','40'], correct:1}
    ],
    biology: [
      {q: 'What is the functional unit of life?', choices:['Tissue','Atom','Cell','Organ'], correct:2},
      {q: 'Photosynthesis uses which gas from the air?', choices:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], correct:2},
      {q: 'How many chambers does a human heart have?', choices:['2','3','4','5'], correct:2},
      {q: 'Which organelle produces energy in the cell?', choices:['Nucleus','Mitochondria','Ribosome','Vacuole'], correct:1},
      {q: 'What is the process by which organisms pass traits to offspring?', choices:['Mutation','Photosynthesis','Heredity','Digestion'], correct:2}
    ],
    chemistry: [
      {q: 'What is the chemical symbol for gold?', choices:['Go','Gd','Au','Ag'], correct:2},
      {q: 'What scale measures acidity or basicity?', choices:['Richter scale','pH scale','Decibel scale','Celsius scale'], correct:1},
      {q: 'How many elements are on the periodic table?', choices:['50','92','118','150'], correct:2},
      {q: 'What happens in a chemical reaction?', choices:['Bonds stay the same','Bonds break and form new ones','Matter disappears','Nothing happens'], correct:1},
      {q: 'What is an atom made of?', choices:['Only electrons','Nucleus and electrons','Only protons','Neutrons only'], correct:1}
    ],
    physics: [
      {q: 'What is Newton\'s first law of motion?', choices:['Force = mass × acceleration','Objects at rest stay at rest unless acted upon','Energy cannot be created or destroyed','For every action there is a reaction'], correct:1},
      {q: 'What is the SI unit of force?', choices:['Kilogram','Meter','Newton','Joule'], correct:2},
      {q: 'What is the speed of light?', choices:['3 million m/s','3 million km/s','3 thousand m/s','3 hundred km/s'], correct:1},
      {q: 'What is acceleration?', choices:['Speed','Distance','Change in velocity over time','Movement'], correct:2},
      {q: 'Which has more inertia: a car or a bicycle?', choices:['Bicycle','Car','Same','Depends on color'], correct:1}
    ],
    astronomy: [
      {q: 'What shape do most spiral galaxies have?', choices:['Square','Spiral arm pattern','Triangle','Circle'], correct:1},
      {q: 'Which planet is known as the Red Planet?', choices:['Venus','Jupiter','Mars','Saturn'], correct:2},
      {q: 'What is a cloud of gas and dust in space called?', choices:['Nebula','Comet','Asteroid','Planet'], correct:0},
      {q: 'How many planets are in our solar system?', choices:['7','8','9','10'], correct:1},
      {q: 'What do we call a small rocky object that orbits the Sun?', choices:['Planet','Asteroid','Comet','Meteor'], correct:1}
    ],
    english: [
      {q: 'Which part of speech describes an action or state?', choices:['Noun','Verb','Adjective','Adverb'], correct:1},
      {q: 'What is the opposite of "generous"?', choices:['Kind','Selfish','Brave','Happy'], correct:1},
      {q: 'Which sentence is grammatically correct?', choices:['She go to school','She goes to school','She going to school','She are going'], correct:1},
      {q: 'What does "metaphor" mean?', choices:['A comparison using "like" or "as"','A direct comparison without "like" or "as"','A type of poem','A repeated sound'], correct:1},
      {q: 'Which word is a synonym for "happy"?', choices:['Sad','Joyful','Angry','Tired'], correct:1}
    ],
    socialscience: [
      {q: 'What is the capital of India?', choices:['Mumbai','Kolkata','New Delhi','Bangalore'], correct:2},
      {q: 'Who wrote the Indian Constitution?', choices:['Mahatma Gandhi','B.R. Ambedkar','Jawaharlal Nehru','Sardar Patel'], correct:1},
      {q: 'Which river is the longest in India?', choices:['Ganga','Brahmaputra','Godavari','Yamuna'], correct:0},
      {q: 'In which year did India gain independence?', choices:['1945','1947','1950','1952'], correct:1},
      {q: 'What are the three pillars of the Indian government?', choices:['Executive, Judiciary, Legislature','Military, Police, Court','President, Prime Minister, Governor','Federal, State, Local'], correct:0}
    ]
  }
};


function seededRng(seed){
  let x = seed % 2147483647; if (x <= 0) x += 2147483646;
  return function(){ x = (x * 16807) % 2147483647; return (x-1) / 2147483646; };
}

function generateMathQuestion(grade, i){
  const rng = seededRng(i + 7000);
  const a = Math.floor(rng()*90)+10;
  const b = Math.floor(rng()*12)+2;
  const templates = [
    {q: (a,b)=>`What is ${a} + ${b}?`, ans: a+b},
    {q: (a,b)=>`What is ${a} × ${b}?`, ans: a*b},
    {q: (a,b)=>`Subtract: ${a+b} - ${a}`, ans: b},
    {q: (a,b)=>`What is ${a} - ${b}?`, ans: a-b},
    {q: (a,b)=>`What is ${a} ÷ ${b}?`, ans: Math.floor(a/b)}
  ];
  const pick = templates[Math.floor(rng()*templates.length)];
  let q = pick.q(a,b);
  let correct = pick.ans;
  if (typeof correct !== 'number') correct = Math.floor(correct);
  const choices = makeDistractorsNumber(correct, rng);
  return {q, choices, correctIndex: choices.indexOf(String(correct))};
}

function generateScienceQuestion(grade, i, theme){
  const rng = seededRng(i + 7700);
  
  // Astronomy pool
  const astronomyPool = [
    {q:'What is the most common shape of galaxies?', choices:['Irregular','Elliptical','Spiral','Cubic'], correct:2},
    {q:'What type of star is our Sun?', choices:['Red Giant','White Dwarf','Yellow Dwarf','Blue Super Giant'], correct:2},
    {q:'What is a pulsar?', choices:['A dying star','A rapidly rotating neutron star','A black hole','A comet'], correct:1},
    {q:'What do we call the boundary of a black hole?', choices:['Core','Event Horizon','Singularity','Corona'], correct:1},
    {q:'Which galaxy is closest to the Milky Way?', choices:['Sombrero Galaxy','Andromeda Galaxy','Whirlpool Galaxy','Pinwheel Galaxy'], correct:1}
  ];
  
  // Biology pool
  const biologyPool = [
    {q:'What is the main function of the heart?', choices:['Digest food','Pump blood','Think','Make bones'], correct:1},
    {q:'Which part of a plant absorbs water?', choices:['Leaves','Stem','Roots','Flower'], correct:2},
    {q:'How many bones does an adult human have?', choices:['150','206','250','300'], correct:1},
    {q:'What do red blood cells carry?', choices:['Nutrients','Fat','Oxygen','Electricity'], correct:2}
  ];
  
  // Chemistry pool
  const chemistryPool = [
    {q:'What is the most abundant element in the human body?', choices:['Carbon','Nitrogen','Hydrogen','Oxygen'], correct:3},
    {q:'What is the pH of pure water?', choices:['5','7','9','11'], correct:1},
    {q:'What state of matter has a definite shape?', choices:['Gas','Liquid','Solid','Plasma'], correct:2},
    {q:'Which gas do we breathe in from the air?', choices:['Nitrogen','Carbon dioxide','Oxygen','Argon'], correct:2}
  ];
  
  // Physics pool
  const physicsPool = [
    {q:'What is the SI unit of energy?', choices:['Newton','Joule','Watt','Pascal'], correct:1},
    {q:'Does light travel faster or slower than sound?', choices:['Faster','Slower','Same speed','Depends on color'], correct:0},
    {q:'What is friction?', choices:['The pull of Earth','The force that opposes motion','Cold temperature','Electric charge'], correct:1},
    {q:'What happens to velocity if acceleration is applied?', choices:['Stays the same','Decreases','Increases','Becomes zero'], correct:2}
  ];
  
  let pool = biologyPool;
  if (theme === 'astronomy') pool = astronomyPool;
  else if (theme === 'chemistry') pool = chemistryPool;
  else if (theme === 'physics') pool = physicsPool;
  
  const pick = pool[Math.floor(rng()*pool.length)];
  return {q: pick.q, choices: pick.choices.slice(), correctIndex: pick.correct};
}

function makeDistractorsNumber(correct, rng){
  const correctStr = String(correct);
  const s = new Set([correctStr]);
  const choices = [correctStr];
  while (choices.length < 4){
    const delta = Math.max(1, Math.floor((rng()*10)));
    const sign = (rng() > 0.5) ? 1 : -1;
    const cand = String(correct + sign*delta);
    if (!s.has(cand)) { s.add(cand); choices.push(cand); }
  }
  // shuffle
  for (let i=choices.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [choices[i],choices[j]]=[choices[j],choices[i]] }
  return choices;
}

class TutorLogic {
  static getTutorResponse(question) {
    const q = (question || '').trim();
    const lower = q.toLowerCase();

    if (!q) {
      return {
        topic: 'Let me help you learn',
        explanation: 'Type a question and I will break it down into simple steps.',
        example: 'Example: “What is 12 × 3?”',
        game: {
          prompt: 'Quick warm-up: What is 5 + 3?',
          options: ['6', '7', '8', '9'],
          correctIndex: 2,
          feedback: 'Correct! 5 + 3 = 8.'
        }
      };
    }

    // Handle simple greetings separately so 'hi' or 'hello' doesn't return the generic learning prompt
    if (/^\s*(hi|hello|hey|hiya|greetings|good\s(morning|afternoon|evening))\b[!.,]?$/i.test(q)) {
      return {
        topic: 'Hello!',
        explanation: 'Hi there — I am your Tutor. Ask me a question about math, science, English, or school topics.',
        example: 'Try: "What is photosynthesis?"',
        game: {
          prompt: 'Warm-up: What is 2 + 2?',
          options: ['2', '3', '4', '5'],
          correctIndex: 2,
          feedback: 'Great! 2 + 2 = 4.'
        }
      };
    }

    if (/(math|equation|solve|multiply|add|subtract|divide|number|algebra)/.test(lower)) {
      return {
        topic: 'Math Strategy',
        explanation: 'Break the problem into the smallest steps. First identify the operation, then do it carefully, and finally check your answer by reversing the operation.',
        example: 'For 3x + 5 = 20, subtract 5 from both sides, then divide by 3 to get x = 5.',
        game: {
          prompt: 'Quick check: What is x if 2x = 10?',
          options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
          correctIndex: 3,
          feedback: 'Correct! Dividing both sides by 2 gives x = 5.'
        }
      };
    }

    if (/(gravity|force|motion|speed|energy|physics|science)/.test(lower)) {
      return {
        topic: 'Science: Forces and Motion',
        explanation: 'Gravity is a force that pulls objects toward Earth. Speed tells us how far something moves in time, and force can change motion.',
        example: 'A ball falls because gravity pulls it down while air resistance slows it slightly.',
        game: {
          prompt: 'Which force pulls objects toward Earth?',
          options: ['Magnetism', 'Gravity', 'Sound', 'Heat'],
          correctIndex: 1,
          feedback: 'Yes! Gravity is the force that pulls things toward Earth.'
        }
      };
    }

    if (/(plant|cell|animal|body|biology|life|human)/.test(lower)) {
      return {
        topic: 'Biology Basics',
        explanation: 'Living things are made of cells, and cells work together to form tissues and organs. Plants use sunlight to make energy through photosynthesis.',
        example: 'Roots absorb water while leaves capture sunlight for photosynthesis.',
        game: {
          prompt: 'What do plants use to make food?',
          options: ['Sand', 'Sunlight', 'Plastic', 'Concrete'],
          correctIndex: 1,
          feedback: 'Correct! Plants use sunlight, water, and carbon dioxide to make food.'
        }
      };
    }

    if (/(planet|star|moon|space|galaxy|astronomy|solar system)/.test(lower)) {
      return {
        topic: 'Astronomy',
        explanation: 'Our solar system includes the Sun, planets, moons, asteroids, and comets. The Earth orbits the Sun, and the Moon orbits Earth.',
        example: 'The Earth takes about one year to orbit the Sun, while the Moon takes about one month to orbit Earth.',
        game: {
          prompt: 'Which planet is known as the Red Planet?',
          options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
          correctIndex: 1,
          feedback: 'Excellent! Mars is often called the Red Planet.'
        }
      };
    }

    if (/(english|grammar|word|sentence|reading|writing)/.test(lower)) {
      return {
        topic: 'English Skills',
        explanation: 'Good writing starts with a clear idea, then uses correct grammar and strong words. A sentence needs a subject and a verb to make sense.',
        example: 'Instead of “The dog run fast,” say “The dog runs fast.”',
        game: {
          prompt: 'Which sentence is correct?',
          options: ['She go to school.', 'She goes to school.', 'She going to school.', 'She are to school.'],
          correctIndex: 1,
          feedback: 'Correct! “She goes to school” is grammatically correct.'
        }
      };
    }

    return {
      topic: 'General Learning',
      explanation: 'Start with what you know, look for the key word in the question, and then connect it to a simple fact or rule. Breaking a problem into smaller pieces makes it easier to solve.',
      example: 'If the question asks about shapes, list the properties first: sides, corners, and angles.',
      game: {
        prompt: 'What is 4 × 4?',
        options: ['12', '14', '16', '18'],
        correctIndex: 2,
        feedback: 'Right! 4 × 4 = 16.'
      }
    };
  }
}

function totalCountFor(grade, subject){
  const raw = Number(totalInput.value) || 0;
  const safe = Number.isFinite(raw) ? Math.max(1, Math.min(raw, 50)) : 1;
  const bankKey = subject === 'science' ? scienceThemeSelect.value : subject;
  const available = (bank[grade] && bank[grade][bankKey]) ? bank[grade][bankKey].length : 0;
  return Math.max(safe, available || 1);
}

function renderQuestion(){
  const grade = gradeSelect.value;
  const subject = subjectSelect.value;
  const scienceTheme = scienceThemeSelect.value;
  totalQuestions = totalCountFor(grade, subject);
  if (totalQuestions === 0){ questionText.textContent='No questions'; choicesEl.innerHTML=''; qIndexEl.textContent=0; qCountEl.textContent=0; themeNote.textContent = 'Pick a grade and subject to launch your quiz.'; return; }
  
  // Start timer on first question
  if (index === 0 && !startTime) {
    startTime = Date.now();
    correctCount = 0;
  }
  
  if (subject === 'math') {
    themeNote.textContent = '� Math: addition, subtraction, multiplication, division, and problem solving.';  } else if (subject === 'english') {
    themeNote.textContent = '📚 English: grammar, vocabulary, sentence structure, and reading comprehension.';
  } else if (subject === 'socialscience') {
    themeNote.textContent = '🌍 Social Science: history, geography, civics, and Indian government.';  } else if (scienceTheme === 'astronomy') {
    themeNote.textContent = '🌌 Astronomy: explore galaxies, stars, planets, nebulae, and heavenly bodies.';
  } else if (scienceTheme === 'biology') {
    themeNote.textContent = '🧬 Biology: learn about cells, organisms, and life.';
  } else if (scienceTheme === 'chemistry') {
    themeNote.textContent = '⚗️ Chemistry: understand molecules, reactions, and compounds.';
  } else if (scienceTheme === 'physics') {
    themeNote.textContent = '⚡ Physics: explore forces, motion, energy, and gravity.';
  }
  qIndexEl.textContent = index + 1;
  qCountEl.textContent = totalQuestions;
  let item;
  let bankKey = subject;
  if (subject === 'science') bankKey = scienceTheme;
  const bankList = (bank[grade] && bank[grade][bankKey]) ? bank[grade][bankKey] : [];
  if (index < bankList.length){ item = bankList[index]; currentCorrect = item.choices[item.correct]; }
  else {
    // generate on the fly, use index as seed
    const genIndex = index;
    if (subject === 'math'){
      const g = generateMathQuestion(grade, genIndex);
      item = {q: g.q, choices: g.choices, correct: g.correctIndex};
      currentCorrect = item.choices[item.correct];
    } else {
      const g = generateScienceQuestion(grade, genIndex, scienceTheme);
      item = {q: g.q, choices: g.choices, correct: g.correctIndex};
      currentCorrect = item.choices[item.correct];
    }
  }
  questionText.textContent = item.q;
  answerEl.textContent=''; answerEl.setAttribute('aria-hidden','true');
  choicesEl.innerHTML = '';
  item.choices.forEach((c,i)=>{
    const btn = document.createElement('button');
    btn.className = 'choice'; btn.dataset.index = i; btn.textContent = c;
    choicesEl.appendChild(btn);
  });
}

if (choicesEl) {
  choicesEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.choice'); if(!btn) return;
    const picked = Number(btn.dataset.index);
    const grade = gradeSelect.value; const subject = subjectSelect.value;
    const bankList = (bank[grade] && bank[grade][subject]) ? bank[grade][subject] : [];
    let correctIndex;
    if (index < bankList.length){ correctIndex = bankList[index].correct; }
    else {
      // regenerate to get correct index
      if (subject === 'math'){ correctIndex = generateMathQuestion(grade, index).correctIndex; }
      else { correctIndex = generateScienceQuestion(grade, index).correctIndex; }
    }
    // mark buttons
    Array.from(choicesEl.children).forEach((b, i)=>{
      b.classList.remove('correct','incorrect');
      if (i === correctIndex) b.classList.add('correct');
      if (i === picked && i !== correctIndex) b.classList.add('incorrect');
    });
    // Track if answer is correct
    if (picked === correctIndex) {
      trackCorrectAnswer();
      // 🎉 TRIGGER CELEBRATION! 🎉
      const rect = btn.getBoundingClientRect();
      triggerCelebration(rect.left + rect.width / 2, rect.top + rect.height / 2);
      btn.classList.add('pulse-glow');
    }
    const correctText = choicesEl.children[correctIndex].textContent;
    if (answerEl) {
      answerEl.textContent = 'Answer: ' + correctText;
      answerEl.setAttribute('aria-hidden','false');
    }
  });
}

function showAnswer(){ if (!choicesEl || !choicesEl.children.length) return; Array.from(choicesEl.children).forEach((b)=>b.classList.add('dim')); const correct = Array.from(choicesEl.children).find(b=>b.classList.contains('correct')); if (!correct){ // force highlight
  const grade=gradeSelect.value, subject=subjectSelect.value; const bankList=(bank[grade]&&bank[grade][subject])?bank[grade][subject]:[]; let correctIndex = (index<bankList.length)?bankList[index].correct: (subject==='math'?generateMathQuestion(grade,index).correctIndex:generateScienceQuestion(grade,index).correctIndex); Array.from(choicesEl.children)[correctIndex].classList.add('correct'); const correctText = Array.from(choicesEl.children)[correctIndex].textContent; if (answerEl) { answerEl.textContent='Answer: '+correctText; answerEl.setAttribute('aria-hidden','false'); } return; } const correctText = correct.textContent; if (answerEl) { answerEl.textContent = 'Answer: ' + correctText; answerEl.setAttribute('aria-hidden','false'); } }

function nextQuestion(){ 
  totalQuestions = Number(totalInput.value) || totalQuestions; 
  index = (index + 1) % totalQuestions; 
  
  // Check if we should trigger mini game
  memoryGameData.questionsAnswered++;
  if (memoryGameData.questionsAnswered >= memoryGameData.nextGameAt) {
    setTimeout(() => {
      showMiniGame();
    }, 500);
  }
  
  renderQuestion(); 
}
function prevQuestion(){ totalQuestions = Number(totalInput.value) || totalQuestions; index = (index - 1 + totalQuestions) % totalQuestions; renderQuestion(); }

function shuffleQuestions(){ // in generator mode randomize index
  const grade = gradeSelect.value; 
  const subject = subjectSelect.value; 
  let bankKey = subject;
  if (subject === 'science') bankKey = scienceThemeSelect.value;
  const bankList = (bank[grade] && bank[grade][bankKey]) ? bank[grade][bankKey] : []; 
  if (bankList.length > 1){ // shuffle bank
    for (let i = bankList.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [bankList[i],bankList[j]]=[bankList[j],bankList[i]] }
    index = 0; renderQuestion();
  } else { randomQuestion(); }
}

function randomQuestion(){ totalQuestions = Number(totalInput.value) || totalQuestions; index = Math.floor(Math.random()*totalQuestions); renderQuestion(); }

function startAuto(){ if (!intervalInput) return; stopAuto(); const sec = Math.max(3, Number(intervalInput.value) || 8); autoTimer = setInterval(nextQuestion, sec*1000); }
function stopAuto(){ if (autoTimer){ clearInterval(autoTimer); autoTimer=null; } }

// Event bindings
if (gradeSelect) gradeSelect.addEventListener('change', ()=>{ index=0; renderQuestion(); });
if (subjectSelect) subjectSelect.addEventListener('change', ()=>{ 
  const isScience = subjectSelect.value === 'science';
  if (scienceThemeLabel) scienceThemeLabel.style.display = isScience ? 'block' : 'none';
  index=0; renderQuestion(); 
});
if (scienceThemeSelect) scienceThemeSelect.addEventListener('change', ()=>{ index=0; renderQuestion(); });
if (totalInput) totalInput.addEventListener('change', ()=>{ index = 0; renderQuestion(); });
if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
if (showAnswerBtn) showAnswerBtn.addEventListener('click', showAnswer);
if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleQuestions);
if (randomBtn) randomBtn.addEventListener('click', randomQuestion);
if (autoToggle) autoToggle.addEventListener('change', ()=>{ if (autoToggle.checked) startAuto(); else stopAuto(); });
if (intervalInput) intervalInput.addEventListener('change', ()=>{ if (autoToggle && autoToggle.checked) startAuto(); });

if (tutorAskBtn) tutorAskBtn.addEventListener('click', runTutorSession);
if (tutorQuestionInput) tutorQuestionInput.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') runTutorSession(); });

// Mini Game Event Listeners
const memoryStartBtn = document.getElementById('memoryStartBtn');
const memoryCloseBtn = document.getElementById('memoryCloseBtn');
if (memoryStartBtn) memoryStartBtn.addEventListener('click', () => {
  const itemsContainer = document.getElementById('memoryItemsContainer');
  if (itemsContainer) itemsContainer.querySelectorAll('.memory-card').forEach(card => card.classList.remove('hidden'));
});
if (memoryCloseBtn) memoryCloseBtn.addEventListener('click', closeMiniGame);

function runTutorSession(){
  if (!tutorQuestionInput || !tutorReply || !tutorGame) return;

  const question = tutorQuestionInput.value.trim();
  if (!question) {
    tutorReply.textContent = 'Please type a question so I can teach you.';
    tutorGame.innerHTML = '';
    tutorQuestionInput.focus();
    return;
  }

  // UI: show loading and prevent duplicate requests
  const askBtn = tutorAskBtn;
  if (askBtn) { askBtn.disabled = true; askBtn.textContent = 'Thinking...'; }
  tutorReply.innerHTML = '<em>Thinking...</em>';
  tutorGame.innerHTML = '';

  // simulate async response to keep UI responsive (TutorLogic is synchronous)
  setTimeout(() => {
    try {
      const reply = TutorLogic.getTutorResponse(question);
      tutorReply.innerHTML = `<strong>${reply.topic}</strong><br>${reply.explanation}<br><br><em>Example:</em> ${reply.example}`;

      tutorGame.innerHTML = '';
      if (reply.game && reply.game.options && reply.game.options.length) {
        const game = document.createElement('div');
        game.innerHTML = `<div class="feedback">${reply.game.prompt}</div>`;
        reply.game.options.forEach((opt, optIndex) => {
          const button = document.createElement('button');
          button.textContent = opt;
          button.addEventListener('click', () => {
            const isCorrect = optIndex === reply.game.correctIndex;
            const fb = game.querySelector('.feedback');
            if (fb) fb.textContent = isCorrect ? reply.game.feedback : 'Try again — the tutor will help you learn.';
            game.querySelectorAll('button').forEach((btn) => btn.disabled = true);
            if (isCorrect) {
              // small UX: clear input and focus for next question
              tutorQuestionInput.value = '';
              tutorQuestionInput.focus();
            }
          });
          game.appendChild(button);
        });
        tutorGame.appendChild(game);
      }
    } catch (err) {
      tutorReply.textContent = 'Sorry, the tutor failed to generate a response.';
      tutorGame.innerHTML = '';
      console.error('Tutor error', err);
    } finally {
      if (askBtn) { askBtn.disabled = false; askBtn.textContent = 'Teach Me'; }
    }
  }, 200);
}

// Initialize
if (scienceThemeLabel) scienceThemeLabel.style.display = 'none';
if (hasQuizUI) {
  renderQuestion();
}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
