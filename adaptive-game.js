// Game state
var gameState = {
    subject: null,
    difficulty: null,
    currentQuestion: 0,
    score: 0,
    totalQuestions: 0,
    selectedAnswer: null,
    questions: []
};

// Question database organized by subject and difficulty
const questionDatabase = {
    arithmetic: {
        easy: [
            { q: "What is 5 + 3?", options: ["8", "7", "9", "6"], correct: 0 },
            { q: "What is 10 - 4?", options: ["6", "7", "8", "5"], correct: 0 },
            { q: "What is 2 × 3?", options: ["6", "5", "7", "4"], correct: 0 },
            { q: "What is 12 ÷ 3?", options: ["4", "5", "3", "6"], correct: 0 },
            { q: "What is 7 + 2?", options: ["9", "8", "10", "6"], correct: 0 },
            { q: "What is 15 - 5?", options: ["10", "9", "11", "8"], correct: 0 },
            { q: "What is 4 × 2?", options: ["8", "7", "9", "6"], correct: 0 },
            { q: "What is 20 ÷ 4?", options: ["5", "6", "4", "7"], correct: 0 },
        ],
        medium: [
            { q: "What is 25 + 17?", options: ["42", "40", "43", "41"], correct: 0 },
            { q: "What is 100 - 37?", options: ["63", "65", "62", "64"], correct: 0 },
            { q: "What is 12 × 5?", options: ["60", "55", "65", "50"], correct: 0 },
            { q: "What is 144 ÷ 12?", options: ["12", "11", "13", "10"], correct: 0 },
            { q: "What is 33 + 48?", options: ["81", "80", "82", "79"], correct: 0 },
            { q: "What is 99 - 54?", options: ["45", "44", "46", "43"], correct: 0 },
            { q: "What is 15 × 4?", options: ["60", "55", "65", "50"], correct: 0 },
            { q: "What is 256 ÷ 16?", options: ["16", "15", "17", "14"], correct: 0 },
        ],
        hard: [
            { q: "What is (15 + 25) × 2?", options: ["80", "75", "85", "70"], correct: 0 },
            { q: "What is 144 ÷ 12 + 8?", options: ["20", "19", "21", "18"], correct: 0 },
            { q: "What is 50% of 240?", options: ["120", "115", "125", "110"], correct: 0 },
            { q: "What is 7² (7 squared)?", options: ["49", "48", "50", "47"], correct: 0 },
            { q: "What is (100 - 40) ÷ 3?", options: ["20", "19", "21", "18"], correct: 0 },
            { q: "What is 25% of 80?", options: ["20", "19", "21", "18"], correct: 0 },
            { q: "What is 5³ (5 cubed)?", options: ["125", "120", "130", "115"], correct: 0 },
            { q: "What is 11 × 11?", options: ["121", "120", "122", "119"], correct: 0 },
        ]
    },
    geography: {
        easy: [
            { q: "What is the capital of France?", options: ["Paris", "Lyon", "Marseille", "Nice"], correct: 0 },
            { q: "Which is the largest continent?", options: ["Asia", "Africa", "Europe", "Americas"], correct: 0 },
            { q: "What is the capital of Japan?", options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"], correct: 0 },
            { q: "Which country is famous for kangaroos?", options: ["Australia", "New Zealand", "Papua New Guinea", "Fiji"], correct: 0 },
            { q: "What is the capital of Spain?", options: ["Madrid", "Barcelona", "Valencia", "Seville"], correct: 0 },
            { q: "Which ocean is the largest?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], correct: 0 },
            { q: "What is the capital of Brazil?", options: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"], correct: 0 },
            { q: "Which is the hottest continent?", options: ["Africa", "Asia", "South America", "Australia"], correct: 0 },
        ],
        medium: [
            { q: "What is the capital of Switzerland?", options: ["Bern", "Zurich", "Geneva", "Basel"], correct: 0 },
            { q: "Which country has the most islands?", options: ["Sweden", "Norway", "Indonesia", "Philippines"], correct: 0 },
            { q: "What is the longest river in the world?", options: ["Nile", "Amazon", "Yangtze", "Mississippi"], correct: 0 },
            { q: "Which mountain range is home to Mount Everest?", options: ["Himalayas", "Andes", "Rockies", "Alps"], correct: 0 },
            { q: "What is the capital of New Zealand?", options: ["Wellington", "Auckland", "Christchurch", "Dunedin"], correct: 0 },
            { q: "Which desert is the largest in the world?", options: ["Antarctica", "Sahara", "Arabian", "Gobi"], correct: 0 },
            { q: "What is the capital of Egypt?", options: ["Cairo", "Alexandria", "Giza", "Aswan"], correct: 0 },
            { q: "Which continent is crossed by the equator?", options: ["South America", "Africa", "Asia", "All of the above"], correct: 3 },
        ],
        hard: [
            { q: "What is the capital of Bhutan?", options: ["Thimphu", "Paro", "Punakha", "Wangdue"], correct: 0 },
            { q: "Which is the only country in the world with no capital?", options: ["Vatican City", "Monaco", "Nauru", "Mauritius"], correct: 0 },
            { q: "What is the deepest ocean trench?", options: ["Mariana Trench", "Tonga Trench", "Philippine Trench", "Kuril-Kamchatka"], correct: 0 },
            { q: "Which is the smallest country in the world?", options: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"], correct: 0 },
            { q: "What is the capital of Suriname?", options: ["Paramaribo", "Georgetown", "Port of Spain", "Castries"], correct: 0 },
            { q: "Which country has the most time zones?", options: ["France", "Russia", "United States", "China"], correct: 0 },
            { q: "What is the highest mountain outside of Asia?", options: ["Mount Aconcagua", "Mount McKinley", "Mount Elbrus", "Kilimanjaro"], correct: 0 },
            { q: "Which capital is the highest in the world?", options: ["La Paz", "Mexico City", "Bogotá", "Quito"], correct: 0 },
        ]
    },
    space: {
        easy: [
            { q: "What is the closest planet to the Sun?", options: ["Mercury", "Venus", "Earth", "Mars"], correct: 0 },
            { q: "How many planets are in our solar system?", options: ["8", "9", "10", "7"], correct: 0 },
            { q: "What is the largest planet?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correct: 0 },
            { q: "What is the Sun made of?", options: ["Hydrogen & Helium", "Iron & Nickel", "Water", "Rock"], correct: 0 },
            { q: "Which planet has rings?", options: ["Saturn", "Jupiter", "Uranus", "Neptune"], correct: 0 },
            { q: "What is the smallest planet?", options: ["Mercury", "Venus", "Mars", "Earth"], correct: 0 },
            { q: "What causes day and night on Earth?", options: ["Earth's rotation", "Earth's orbit", "Moon's movement", "Sun's movement"], correct: 0 },
            { q: "How many moons does Mars have?", options: ["2", "1", "3", "0"], correct: 0 },
        ],
        medium: [
            { q: "What is the average distance from Earth to the Sun called?", options: ["Astronomical Unit", "Light Year", "Parsec", "Kilometer"], correct: 0 },
            { q: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Mercury", "Jupiter"], correct: 0 },
            { q: "What is the Great Red Spot on Jupiter?", options: ["A storm", "A volcano", "A crater", "An aurora"], correct: 0 },
            { q: "How long does it take Earth to orbit the Sun?", options: ["365 days", "364 days", "366 days", "360 days"], correct: 0 },
            { q: "What is the frozen moon of Jupiter?", options: ["Europa", "Io", "Ganymede", "Callisto"], correct: 0 },
            { q: "Which planet rotates backwards?", options: ["Venus", "Mercury", "Uranus", "Neptune"], correct: 0 },
            { q: "What is a light year?", options: ["Distance light travels in a year", "Time for light to travel", "Speed of light", "Age of the universe"], correct: 0 },
            { q: "How many rings does Saturn have?", options: ["Thousands", "Hundreds", "Dozens", "Only 7"], correct: 0 },
        ],
        hard: [
            { q: "What is the Oort Cloud?", options: ["Theoretical cloud of icy objects", "A star cluster", "A nebula", "Comets in the asteroid belt"], correct: 0 },
            { q: "Which exoplanet is most similar to Earth?", options: ["Proxima Centauri b", "Kepler-452b", "TRAPPIST-1e", "Gliese 667Cc"], correct: 0 },
            { q: "What is the escape velocity from Earth?", options: ["11.2 km/s", "10 km/s", "12.5 km/s", "9.8 km/s"], correct: 0 },
            { q: "What causes the precession of Earth's axis?", options: ["Gravitational pull of the Moon and Sun", "Solar wind", "Asteroids", "Earth's rotation"], correct: 0 },
            { q: "What is the cosmic microwave background?", options: ["Radiation from Big Bang", "Light from stars", "Solar radiation", "Earth's heat"], correct: 0 },
            { q: "How many AU is the edge of our solar system?", options: ["100,000", "1,000", "10,000", "1"], correct: 0 },
            { q: "What is the Kuiper Belt?", options: ["Region of icy bodies beyond Neptune", "Asteroid belt between Mars and Jupiter", "Ring system", "Debris disk"], correct: 0 },
            { q: "What is a parsec?", options: ["3.26 light years", "Distance to nearest star", "Size of solar system", "Quantum measurement"], correct: 0 },
        ]
    },
    puzzle: {
        easy: [
            { q: "I speak without a mouth. What am I?", options: ["Echo", "Wind", "Water", "Fire"], correct: 0 },
            { q: "What has hands but cannot clap?", options: ["Clock", "Watch", "Ruler", "Compass"], correct: 0 },
            { q: "I have cities but no houses. What am I?", options: ["Map", "Drawing", "Book", "Painting"], correct: 0 },
            { q: "What gets wet while drying?", options: ["Towel", "Sponge", "Cloth", "Paper"], correct: 0 },
            { q: "I have keys but no locks. What am I?", options: ["Piano", "Keyboard", "Door", "Safe"], correct: 0 },
            { q: "What can travel around the world while staying in a corner?", options: ["Stamp", "Letter", "Package", "Coin"], correct: 0 },
            { q: "What has a head and a tail but no body?", options: ["Coin", "Kite", "Arrow", "Pen"], correct: 0 },
            { q: "What is full of keys but cannot open any door?", options: ["Piano", "Harmonica", "Keyboard", "Xylophone"], correct: 0 },
        ],
        medium: [
            { q: "What is always coming but never arrives?", options: ["Tomorrow", "Today", "Yesterday", "Next week"], correct: 0 },
            { q: "I am taken from a mine and shut up in a wooden case. What am I?", options: ["Pencil lead", "Diamond", "Coal", "Gold"], correct: 0 },
            { q: "The more you take, the more you leave behind. What am I?", options: ["Footsteps", "Memories", "Time", "Darkness"], correct: 0 },
            { q: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", options: ["The letter R", "Spring flowers", "Rain", "Easter"], correct: 0 },
            { q: "What word becomes shorter when you add 2 letters to it?", options: ["Short", "Long", "Small", "Big"], correct: 0 },
            { q: "I am not alive, but I grow. I don't have lungs, but I need air. What am I?", options: ["Fire", "Mold", "Rust", "Frost"], correct: 0 },
            { q: "What has a ring but no finger?", options: ["Phone", "Bell", "Trumpet", "Drum"], correct: 0 },
            { q: "What can run but never walk?", options: ["Water", "Wind", "Electricity", "Sound"], correct: 0 },
        ],
        hard: [
            { q: "A man pushes his car to a hotel and tells the owner he's bankrupt. What happened?", options: ["Playing Monopoly", "Car broke down", "Lost all money", "Insurance issue"], correct: 0 },
            { q: "What has a neck but no head?", options: ["Bottle", "Giraffe", "Shirt", "Necklace"], correct: 0 },
            { q: "I'm light as a feather, yet the strongest person can't hold me for five minutes. What am I?", options: ["Breath", "Air", "Wind", "Thought"], correct: 0 },
            { q: "What has cities but no houses, forests but no trees, and water but no fish?", options: ["Map", "Painting", "Drawing", "Diagram"], correct: 0 },
            { q: "If you have me, you want to share me. If you share me, you haven't got me. What am I?", options: ["Secret", "Money", "Food", "Knowledge"], correct: 0 },
            { q: "What comes once in a minute, twice in a moment, and never in one hundred years?", options: ["The letter M", "A sound", "A thought", "A second"], correct: 0 },
            { q: "What can you catch but not throw?", options: ["Cold", "Fish", "Ball", "Fire"], correct: 0 },
            { q: "I am an odd number. Take away one letter and I become even. What number am I?", options: ["Seven", "Five", "Nine", "Three"], correct: 0 },
        ]
    }
};

// Shuffle array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Select subject
function selectSubject(subject, el) {
    gameState.subject = subject;
    document.querySelectorAll('#subjectScreen .subject-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (el) el.classList.add('active');
    
    // Show difficulty screen
    document.getElementById('subjectScreen').classList.remove('active');
    document.getElementById('difficultyScreen').classList.add('active');
}

// Go back from difficulty to subject
function goBackSubject() {
    document.getElementById('difficultyScreen').classList.remove('active');
    document.getElementById('subjectScreen').classList.add('active');
    gameState.subject = null;
}

// Select difficulty
function selectDifficulty(difficulty, el) {
    gameState.difficulty = difficulty;
    document.querySelectorAll('#difficultyScreen .difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (el) el.classList.add('active');
    
    // Start game
    startGame();
}

// Start game
function startGame() {
    gameState.questions = shuffleArray([...questionDatabase[gameState.subject][gameState.difficulty]]);
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.totalQuestions = gameState.questions.length;
    
    document.getElementById('difficultyScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    // Update progress dots
    updateProgressDots();
    
    // Load first question
    loadQuestion();
}

// Update progress dots
function updateProgressDots() {
    const container = document.getElementById('progressDots');
    container.innerHTML = '';
    for (let i = 0; i < gameState.totalQuestions; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i === gameState.currentQuestion) dot.classList.add('active');
        if (i < gameState.currentQuestion) dot.classList.add('completed');
        container.appendChild(dot);
    }
}

// Load question
function loadQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    document.getElementById('questionText').textContent = question.q;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').style.display = 'none';
    gameState.selectedAnswer = null;
    
    updateProgressDots();
}

// Select answer
function selectAnswer(index) {
    if (gameState.selectedAnswer !== null) return; // Prevent changing answer
    
    gameState.selectedAnswer = index;
    const question = gameState.questions[gameState.currentQuestion];
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach((btn, i) => {
        btn.setAttribute('aria-pressed', String(i === index || i === question.correct));
        if (i === question.correct) {
            btn.classList.add('correct');
        }
        if (i === index && i !== question.correct) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });
    
    // Check if correct
    const isCorrect = index === question.correct;
    if (isCorrect) {
        gameState.score++;
    }
    
    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.classList.add('show');
    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.textContent = '✓ Correct! Great job!';
    } else {
        feedback.classList.add('incorrect');
        feedback.textContent = '✗ Incorrect. Keep learning!';
    }
    
    // Update score
    document.getElementById('scoreValue').textContent = gameState.score;
    
    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

// Next question
function nextQuestion() {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < gameState.totalQuestions) {
        loadQuestion();
    } else {
        endGame();
    }
}

// End game
function endGame() {
    const accuracy = Math.round((gameState.score / gameState.totalQuestions) * 100);
    
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    document.getElementById('finalScore').textContent = `${gameState.score}/${gameState.totalQuestions}`;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
}

// Play again with same subject and difficulty
function playAgain() {
    gameState.selectedAnswer = null;
    document.getElementById('resultsScreen').classList.remove('active');
    startGame();
}

// Change subject
function changeSubject() {
    gameState = {
        subject: null,
        difficulty: null,
        currentQuestion: 0,
        score: 0,
        totalQuestions: 0,
        selectedAnswer: null,
        questions: []
    };
    
    // Clear active buttons
    document.querySelectorAll('.subject-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    
    // Go back to subject screen
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('subjectScreen').classList.add('active');
}
