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
  // Image generation elements
const imagePromptInput = document.getElementById('imagePromptInput');
const imageApiKeyInput = document.getElementById('imageApiKeyInput');
const imageGenerateBtn = document.getElementById('imageGenerateBtn');
const imageStatus = document.getElementById('imageStatus');
const imagePreview = document.getElementById('imagePreview');

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

// Multiple-choice BANK: each entry has {q, choices: [...], correct}
bank = {
  '4': {
    math: [
      {q: 'What is 6 × 7?', choices:['36','42','48','56'], correct:1},
      {q: 'What is 81 ÷ 9?', choices:['7','8','9','10'], correct:2},
      {q: 'Add: 234 + 178', choices:['402','412','422','432'], correct:1},
      {q: 'What is the perimeter of a rectangle 5 m by 3 m?', choices:['15','16','20','30'], correct:3},
      {q: 'What is 9²?', choices:['18','27','81','72'], correct:2}
    ],
    biology: [
      {q: 'What is the main organ that pumps blood?', choices:['Brain','Heart','Lungs','Liver'], correct:1},
      {q: 'Plants make their own food using sunlight. What is this process called?', choices:['Digestion','Breathing','Photosynthesis','Fermentation'], correct:2},
      {q: 'How many legs does an insect have?', choices:['4','6','8','10'], correct:1},
      {q: 'Which of these is a mammal?', choices:['Penguin','Salmon','Whale','Ostrich'], correct:2},
      {q: 'What do plants need to grow?', choices:['Sunlight, water, and soil','Ice, sand, and salt','Fire, wood, and rocks','Concrete, plastic, and steel'], correct:0}
    ],
    chemistry: [
      {q: 'What is the main gas we breathe?', choices:['Nitrogen','Oxygen','Carbon dioxide','Hydrogen'], correct:1},
      {q: 'What happens when you mix baking soda and vinegar?', choices:['It freezes','It boils','It fizzes','It becomes invisible'], correct:2},
      {q: 'What is water made of?', choices:['Hydrogen and carbon','Oxygen and nitrogen','Hydrogen and oxygen','Carbon and oxygen'], correct:2},
      {q: 'Which of these is a metal?', choices:['Oxygen','Plastic','Iron','Nitrogen'], correct:2},
      {q: 'What is the smallest part of matter?', choices:['Molecule','Atom','Dust','Drop'], correct:1}
    ],
    physics: [
      {q: 'What force pulls objects toward Earth?', choices:['Magnetism','Electricity','Gravity','Friction'], correct:2},
      {q: 'If you drop a ball, what happens?', choices:['It floats up','It falls down','It stays in place','It disappears'], correct:1},
      {q: 'What do you need to make something move?', choices:['Heat','Speed','Force','Time'], correct:2},
      {q: 'Which is the fastest: sound or light?', choices:['Sound','Light','They are the same speed','Neither travels'], correct:1},
      {q: 'What does a magnet do?', choices:['Makes heat','Attracts metal','Breaks things','Creates wind'], correct:1}
    ],
    astronomy: [
      {q: 'What shape is most galaxies?', choices:['Square','Spiral','Triangle','Star'], correct:1},
      {q: 'Which is the largest planet in our solar system?', choices:['Saturn','Mars','Jupiter','Neptune'], correct:2},
      {q: 'What is a group of stars called?', choices:['Galaxy','Nebula','Constellation','Asteroid'], correct:2},
      {q: 'How many moons does Earth have?', choices:['0','1','2','3'], correct:1},
      {q: 'What do we call a star that exploded?', choices:['Comet','Supernova','Planet','Moon'], correct:1}
    ]
  },
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
    ]
  }
};


function seededRng(seed){
  let x = seed % 2147483647; if (x <= 0) x += 2147483646;
  return function(){ x = (x * 16807) % 2147483647; return (x-1) / 2147483646; };
}

function generateMathQuestion(grade, i){
  const rng = seededRng(i + (grade==='7'?7000:4000));
  if (grade === '4'){
    const a = Math.floor(rng()*8)+2;
    const b = Math.floor(rng()*8)+2;
    const templates = [
      {q: (a,b)=>`What is ${a} + ${b}?`, ans: a+b},
      {q: (a,b)=>`What is ${a} × ${b}?`, ans: a*b},
      {q: (a,b)=>`Subtract: ${a+b} - ${a}`, ans: b},
      {q: (a,b)=>`What is ${a} - ${b}?`, ans: a-b}
    ];
    const pick = templates[Math.floor(rng()*templates.length)];
    const q = pick.q(a,b);
    const correct = pick.ans;
    const choices = makeDistractorsNumber(correct, rng);
    return {q, choices, correctIndex: choices.indexOf(String(correct))};
  } else {
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
}

function generateScienceQuestion(grade, i, theme){
  const rng = seededRng(i + (grade==='7'?7700:4700));
  
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
  
  if (subject === 'math') {
    themeNote.textContent = '� Math: addition, subtraction, multiplication, division, and problem solving.';
  } else if (scienceTheme === 'astronomy') {
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
    const correctText = choicesEl.children[correctIndex].textContent;
    if (answerEl) {
      answerEl.textContent = 'Answer: ' + correctText;
      answerEl.setAttribute('aria-hidden','false');
    }
  });
}

function showAnswer(){ if (!choicesEl || !choicesEl.children.length) return; Array.from(choicesEl.children).forEach((b)=>b.classList.add('dim')); const correct = Array.from(choicesEl.children).find(b=>b.classList.contains('correct')); if (!correct){ // force highlight
  const grade=gradeSelect.value, subject=subjectSelect.value; const bankList=(bank[grade]&&bank[grade][subject])?bank[grade][subject]:[]; let correctIndex = (index<bankList.length)?bankList[index].correct: (subject==='math'?generateMathQuestion(grade,index).correctIndex:generateScienceQuestion(grade,index).correctIndex); Array.from(choicesEl.children)[correctIndex].classList.add('correct'); const correctText = Array.from(choicesEl.children)[correctIndex].textContent; if (answerEl) { answerEl.textContent='Answer: '+correctText; answerEl.setAttribute('aria-hidden','false'); } return; } const correctText = correct.textContent; if (answerEl) { answerEl.textContent = 'Answer: ' + correctText; answerEl.setAttribute('aria-hidden','false'); } }

function nextQuestion(){ totalQuestions = Number(totalInput.value) || totalQuestions; index = (index + 1) % totalQuestions; renderQuestion(); }
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

// Image generation: helper to create a simple SVG placeholder
function createPlaceholderDataUrl(prompt){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'>
    <defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#0ea5e9'/><stop offset='1' stop-color='#06b6d4'/></linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)' />
    <g fill='#071025' font-family='Arial,Helvetica,sans-serif' font-size='28'>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#e6f8ff' font-weight='700'>${escapeHtml(prompt || 'Placeholder Image')}</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function generateImage(){
  if (!imagePromptInput || !imageGenerateBtn || !imagePreview || !imageStatus) return;
  const prompt = imagePromptInput.value.trim();
  if (!prompt){ imageStatus.textContent = 'Type a short prompt for the image.'; return; }

  const apiKey = imageApiKeyInput ? imageApiKeyInput.value.trim() : '';
  imageGenerateBtn.disabled = true; imageGenerateBtn.textContent = 'Generating...'; imageStatus.textContent = '';
  imagePreview.innerHTML = '';

  try {
    if (apiKey){
      // Call OpenAI Images (or compatible) endpoint. User must supply a valid key.
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + apiKey },
        body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1024' })
      });
      if (!res.ok) throw new Error('Image API error: ' + res.status);
      const data = await res.json();
      // Response may include b64_json or a url
      const imgData = (data && data.data && data.data[0]) ? data.data[0] : null;
      let src = '';
      if (imgData && imgData.b64_json) src = 'data:image/png;base64,' + imgData.b64_json;
      else if (imgData && imgData.url) src = imgData.url;
      if (src){ const img = document.createElement('img'); img.src = src; img.style.maxWidth='100%'; img.style.height='auto'; imagePreview.appendChild(img); imageStatus.textContent = 'Image generated.'; }
      else { imageStatus.textContent = 'No image returned by API.'; imagePreview.innerHTML = '<div style="padding:18px;color:var(--muted)">No image</div>'; }
    } else {
      // Fallback: create a simple SVG placeholder locally
      const src = createPlaceholderDataUrl(prompt);
      const img = document.createElement('img'); img.src = src; img.style.maxWidth='100%'; img.style.height='auto'; imagePreview.appendChild(img);
      imageStatus.textContent = 'Placeholder image generated (no API key).';
    }
  } catch (err){
    console.error('generateImage error', err);
    imageStatus.textContent = 'Failed to generate image: ' + (err.message || err);
    imagePreview.innerHTML = '<div style="padding:18px;color:var(--muted)">Error</div>';
  } finally {
    imageGenerateBtn.disabled = false; imageGenerateBtn.textContent = 'Generate Image';
  }
}

if (imageGenerateBtn) imageGenerateBtn.addEventListener('click', generateImage);
if (imagePromptInput) imagePromptInput.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') generateImage(); });

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
