(() => {
  'use strict';

  const themes = ['theme-dark-space', 'theme-ocean-wave', 'theme-cyberpunk', 'theme-sunset', 'theme-emerald-forest', 'theme-solarized'];
  const subjectNames = { math: 'Mathematics', science: 'Science & Physics', english: 'English Grammar', socialscience: 'Social Studies' };
  const pools = {
    science: {
      3: [
        { q: 'What planet is closest to the Sun?', opts: ['Mercury', 'Venus', 'Earth', 'Mars'], a: 0 },
        { q: 'Which part of a plant absorbs water from soil?', opts: ['Leaves', 'Stem', 'Roots', 'Flower'], a: 2 },
        { q: 'What state of matter is water when it freezes?', opts: ['Gas', 'Liquid', 'Solid', 'Plasma'], a: 2 },
        { q: 'Which gas do humans need to breathe?', opts: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], a: 1 },
        { q: 'Which animal is a carnivore?', opts: ['Cow', 'Lion', 'Rabbit', 'Deer'], a: 1 }
      ],
      5: [
        { q: 'What process do plants use to make food from sunlight?', opts: ['Respiration', 'Photosynthesis', 'Evaporation', 'Fermentation'], a: 1 },
        { q: 'Which organ pumps blood through the body?', opts: ['Lungs', 'Brain', 'Heart', 'Liver'], a: 2 },
        { q: 'What force pulls objects toward Earth?', opts: ['Friction', 'Magnetism', 'Gravity', 'Tension'], a: 2 },
        { q: 'Which is a renewable energy source?', opts: ['Coal', 'Solar', 'Petroleum', 'Natural gas'], a: 1 },
        { q: 'What is the center of an atom called?', opts: ['Electron', 'Nucleus', 'Proton', 'Molecule'], a: 1 }
      ],
      8: [
        { q: "Which element has the symbol 'O'?", opts: ['Osmium', 'Gold', 'Oxygen', 'Hydrogen'], a: 2 },
        { q: 'Which law says every action has an equal and opposite reaction?', opts: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", 'Law of Gravitation'], a: 2 },
        { q: 'Which organelle is known as the powerhouse of the cell?', opts: ['Ribosome', 'Mitochondrion', 'Nucleus', 'Golgi body'], a: 1 },
        { q: 'What is the pH of pure water at room temperature?', opts: ['5', '7', '9', '12'], a: 1 },
        { q: 'What type of wave is a sound wave in air?', opts: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Surface'], a: 1 }
      ]
    },
    english: {
      3: [
        { q: "Which word is a noun in 'The happy dog barked loudly.'?", opts: ['happy', 'dog', 'barked', 'loudly'], a: 1 },
        { q: "What is the opposite of 'ancient'?", opts: ['Old', 'Modern', 'Huge', 'Slow'], a: 1 },
        { q: 'Which punctuation mark ends a question?', opts: ['Period', 'Exclamation point', 'Question mark', 'Comma'], a: 2 },
        { q: "What is the plural of 'child'?", opts: ['Childs', 'Children', 'Childrens', 'Childes'], a: 1 }
      ],
      5: [
        { q: "Identify the adjective: 'She wore a beautiful blue dress.'", opts: ['wore', 'beautiful', 'dress', 'she'], a: 1 },
        { q: 'Which sentence is in the past tense?', opts: ['I will run tomorrow.', 'I am running now.', 'I ran yesterday.', 'I run every day.'], a: 2 },
        { q: "Which word means the same as 'enormous'?", opts: ['Tiny', 'Huge', 'Quiet', 'Fast'], a: 1 },
        { q: 'Complete: “I wanted to play outside, ___ it started to rain.”', opts: ['and', 'but', 'so', 'or'], a: 1 }
      ],
      8: [
        { q: 'Which literary device repeats initial consonant sounds?', opts: ['Metaphor', 'Alliteration', 'Hyperbole', 'Personification'], a: 1 },
        { q: 'Which sentence uses passive voice?', opts: ['The chef cooked a meal.', 'The meal was cooked by the chef.', 'The chef is cooking.', 'Cook the meal.'], a: 1 },
        { q: "What does the prefix 'un-' mean in 'unbelievable'?", opts: ['Again', 'Not', 'Before', 'Very'], a: 1 },
        { q: 'Which word is spelled correctly?', opts: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'], a: 0 }
      ]
    },
    socialscience: {
      3: [
        { q: 'What shows map symbols and their meanings?', opts: ['Compass rose', 'Map legend or key', 'Scale', 'Grid'], a: 1 },
        { q: 'How many continents are there?', opts: ['5', '6', '7', '8'], a: 2 },
        { q: 'Which direction does a compass needle usually point?', opts: ['East', 'West', 'North', 'South'], a: 2 }
      ],
      5: [
        { q: 'Which continent is largest by land area?', opts: ['Africa', 'North America', 'Asia', 'Europe'], a: 2 },
        { q: 'What are the three branches of the US government?', opts: ['Executive, Legislative, Judicial', 'Federal, State, Local', 'Senate, House, Cabinet', 'President, Mayor, Governor'], a: 0 },
        { q: 'Which ocean lies between the Americas and Europe/Africa?', opts: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], a: 1 }
      ],
      8: [
        { q: 'Which ancient civilization built the pyramids of Giza?', opts: ['Romans', 'Greeks', 'Ancient Egyptians', 'Mesopotamians'], a: 2 },
        { q: "Which document begins with 'We the People'?", opts: ['Declaration of Independence', 'US Constitution', 'Bill of Rights', 'Magna Carta'], a: 1 },
        { q: 'What trade route historically connected Asia with Europe?', opts: ['The Silk Road', 'Trans-Saharan Route', 'Amber Road', 'Royal Road'], a: 0 }
      ]
    }
  };

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled or full. */ }
    }
  };

  const app = {
    grade: 5,
    subject: 'math',
    theme: themes[0],
    state: null,
    timer: null,
    elements: {},

    init() {
      this.elements = Object.fromEntries([
        'home-screen', 'quiz-screen', 'results-screen', 'grade-selector', 'subject-selector', 'theme-options',
        'theme-menu', 'theme-button', 'question-text', 'options-container', 'question-number', 'question-total',
        'quiz-subject', 'quiz-grade', 'score-counter', 'streak-counter', 'timer-bar', 'final-score',
        'final-accuracy', 'final-streak', 'results-heading', 'leaderboard-dialog', 'leaderboard-list',
        'leaderboard-tabs', 'leaderboard-button', 'leaderboard-close', 'clear-leaderboard', 'start-button',
        'retry-button', 'home-button', 'question-status', 'timer-track'
      ].map(id => [id, document.getElementById(id)]));
      const savedTheme = storage.get('eduquest_theme', themes[0]);
      this.theme = themes.includes(savedTheme) ? savedTheme : themes[0];
      this.renderSetup();
      this.setTheme(this.theme, false);
      this.bindEvents();
    },

    renderSetup() {
      this.elements['grade-selector'].innerHTML = [3, 4, 5, 6, 7, 8].map(grade => `<button type="button" class="grade-option" data-grade="${grade}" aria-pressed="${grade === this.grade}">Grade ${grade}</button>`).join('');
      this.elements['subject-selector'].innerHTML = Object.entries(subjectNames).map(([id, name]) => `<button type="button" class="subject-option" data-subject="${id}" aria-pressed="${id === this.subject}"><span class="subject-icon" aria-hidden="true">${({ math: '➗', science: '🔬', english: '🔤', socialscience: '🌍' })[id]}</span><span><strong>${name}</strong><small data-grade-label>Grade ${this.grade} level</small></span></button>`).join('');
      this.elements['theme-options'].innerHTML = [
        ['theme-dark-space', 'Dark Space', '#6366f1'], ['theme-ocean-wave', 'Ocean Wave', '#0ea5e9'],
        ['theme-cyberpunk', 'Cyberpunk', '#ec4899'], ['theme-sunset', 'Sunset Warmth', '#f97316'],
        ['theme-emerald-forest', 'Emerald Forest', '#10b981'], ['theme-solarized', 'Solarized Dark', '#2aa198']
      ].map(([id, name, color]) => `<button type="button" class="theme-option" data-theme="${id}"><i style="--swatch:${color}"></i>${name}</button>`).join('');
      this.updateGradeLabels();
    },

    bindEvents() {
      this.elements['grade-selector'].addEventListener('click', event => {
        const button = event.target.closest('[data-grade]');
        if (!button) return;
        this.grade = Number(button.dataset.grade);
        this.elements['grade-selector'].querySelectorAll('[data-grade]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        this.updateGradeLabels();
      });
      this.elements['subject-selector'].addEventListener('click', event => {
        const button = event.target.closest('[data-subject]');
        if (!button) return;
        this.subject = button.dataset.subject;
        this.elements['subject-selector'].querySelectorAll('[data-subject]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      });
      this.elements['theme-options'].addEventListener('click', event => {
        const button = event.target.closest('[data-theme]');
        if (button) this.setTheme(button.dataset.theme);
      });
      this.elements['theme-button'].addEventListener('click', () => {
        const menu = this.elements['theme-menu'];
        const opening = menu.hidden;
        menu.hidden = !opening;
        this.elements['theme-button'].setAttribute('aria-expanded', String(opening));
      });
      document.addEventListener('click', event => {
        if (!event.target.closest('.theme-picker')) {
          this.elements['theme-menu'].hidden = true;
          this.elements['theme-button'].setAttribute('aria-expanded', 'false');
        }
      });
      this.elements['leaderboard-dialog'].addEventListener('close', () => this.elements['leaderboard-button'].focus());
      this.elements['leaderboard-tabs'].addEventListener('click', event => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        this.elements['leaderboard-tabs'].querySelectorAll('[data-filter]').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
        this.renderLeaderboard(button.dataset.filter);
      });
      this.elements['leaderboard-button'].addEventListener('click', () => this.showLeaderboard());
      this.elements['leaderboard-close'].addEventListener('click', () => this.elements['leaderboard-dialog'].close());
      this.elements['clear-leaderboard'].addEventListener('click', () => this.clearLeaderboard());
      this.elements['start-button'].addEventListener('click', () => this.startQuiz());
      this.elements['retry-button'].addEventListener('click', () => this.startQuiz());
      this.elements['home-button'].addEventListener('click', () => this.showHome());
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') this.elements['theme-menu'].hidden = true;
      });
    },

    updateGradeLabels() {
      this.elements['subject-selector'].querySelectorAll('[data-grade-label]').forEach(label => { label.textContent = `Grade ${this.grade} level`; });
    },

    setTheme(theme, persist = true) {
      this.theme = themes.includes(theme) ? theme : themes[0];
      document.body.classList.remove(...themes);
      document.body.classList.add(this.theme);
      if (persist) storage.set('eduquest_theme', this.theme);
      this.elements['theme-menu'].hidden = true;
      this.elements['theme-button'].setAttribute('aria-expanded', 'false');
    },

    buildQuestions() {
      if (this.subject === 'math') return Array.from({ length: 10 }, () => this.mathQuestion());
      const key = this.grade <= 4 ? 3 : this.grade <= 6 ? 5 : 8;
      const source = pools[this.subject][key];
      const questions = [];
      let bag = [];
      while (questions.length < 10) {
        if (bag.length === 0) {
          bag = source.map(question => ({ ...question, opts: [...question.opts] }));
          for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
          }
          if (questions.length && bag.length > 1 && bag[bag.length - 1].q === questions[questions.length - 1].q) {
            [bag[bag.length - 1], bag[bag.length - 2]] = [bag[bag.length - 2], bag[bag.length - 1]];
          }
        }
        questions.push(bag.pop());
      }
      return questions;
    },

    mathQuestion() {
      const operations = this.grade <= 4 ? ['+', '-'] : this.grade <= 6 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      const first = Math.floor(Math.random() * (this.grade * 12)) + 5;
      let second = Math.floor(Math.random() * (this.grade * 8)) + 2;
      let answer;
      let prompt;
      if (operation === '+') { answer = first + second; prompt = `What is ${first} + ${second}?`; }
      else if (operation === '-') { second = Math.min(second, first); answer = first - second; prompt = `What is ${first} - ${second}?`; }
      else if (operation === '×') { answer = first * second; prompt = `What is ${first} × ${second}?`; }
      else { second = Math.floor(Math.random() * 9) + 2; answer = Math.floor(Math.random() * 10) + 2; prompt = `What is ${second * answer} ÷ ${second}?`; answer *= 1; }
      const choices = new Set([answer]);
      while (choices.size < 4) choices.add(Math.max(0, answer + (Math.floor(Math.random() * 9) + 1) * (Math.random() < 0.5 ? -1 : 1)));
      const opts = [...choices].sort(() => Math.random() - 0.5).map(String);
      return { q: prompt, opts, a: opts.indexOf(String(answer)) };
    },

    startQuiz() {
      this.state = { questions: this.buildQuestions(), index: 0, score: 0, correct: 0, streak: 0, maxStreak: 0, locked: false };
      this.elements['home-screen'].hidden = true;
      this.elements['results-screen'].hidden = true;
      this.elements['quiz-screen'].hidden = false;
      this.elements['quiz-subject'].textContent = subjectNames[this.subject];
      this.elements['quiz-grade'].textContent = `Grade ${this.grade}`;
      this.showQuestion();
    },

    showQuestion() {
      clearInterval(this.timer);
      const { questions, index } = this.state;
      const question = questions[index];
      this.state.locked = false;
      this.elements['question-number'].textContent = String(index + 1);
      this.elements['question-total'].textContent = String(questions.length);
      this.elements['question-text'].textContent = question.q;
      this.elements['score-counter'].textContent = String(this.state.score);
      this.elements['streak-counter'].textContent = String(this.state.streak);
      this.elements['question-status'].textContent = '';
      this.elements['options-container'].innerHTML = question.opts.map((option, i) => `<button type="button" class="answer-option" data-answer="${i}"><span>${this.escapeHTML(option)}</span><kbd>${String.fromCharCode(65 + i)}</kbd></button>`).join('');
      this.elements['options-container'].querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => this.answer(Number(button.dataset.answer))));
      this.elements['timer-bar'].style.width = '100%';
      this.elements['timer-track'].setAttribute('aria-valuenow', '100');
      let remaining = 15;
      this.timer = setInterval(() => {
        remaining -= 0.1;
        const percentage = Math.max(0, (remaining / 15) * 100);
        this.elements['timer-bar'].style.width = `${percentage}%`;
        this.elements['timer-track'].setAttribute('aria-valuenow', String(Math.round(percentage)));
        if (remaining <= 0) this.answer(-1);
      }, 100);
      this.elements['question-text'].focus({ preventScroll: true });
    },

    answer(selected) {
      if (!this.state || this.state.locked) return;
      this.state.locked = true;
      clearInterval(this.timer);
      const question = this.state.questions[this.state.index];
      const correct = selected === question.a;
      const buttons = [...this.elements['options-container'].querySelectorAll('[data-answer]')];
      buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.a) button.classList.add('correct');
        else if (index === selected) button.classList.add('incorrect');
      });
      if (correct) {
        this.state.correct++;
        this.state.score += 100 + this.state.streak * 20;
        this.state.streak++;
        this.state.maxStreak = Math.max(this.state.maxStreak, this.state.streak);
        this.elements['question-status'].textContent = 'Correct!';
      } else {
        this.state.streak = 0;
        this.elements['question-status'].textContent = selected < 0 ? 'Time is up. The correct answer is highlighted.' : 'Not quite. The correct answer is highlighted.';
      }
      this.elements['score-counter'].textContent = String(this.state.score);
      this.elements['streak-counter'].textContent = String(this.state.streak);
      window.setTimeout(() => {
        if (!this.state) return;
        this.state.index++;
        if (this.state.index < this.state.questions.length) this.showQuestion();
        else this.finishQuiz();
      }, 900);
    },

    finishQuiz() {
      clearInterval(this.timer);
      this.elements['quiz-screen'].hidden = true;
      this.elements['results-screen'].hidden = false;
      const accuracy = Math.round((this.state.correct / this.state.questions.length) * 100);
      this.elements['final-score'].textContent = String(this.state.score);
      this.elements['final-accuracy'].textContent = `${accuracy}%`;
      this.elements['final-streak'].textContent = String(this.state.maxStreak);
      this.elements['results-heading'].textContent = accuracy >= 80 ? 'Brilliant work!' : accuracy >= 50 ? 'Good effort!' : 'Keep practicing!';
      this.elements['results-screen'].querySelector('h2').focus({ preventScroll: true });
      const entries = storage.get('eduquest_leaderboard', []);
      const validEntries = Array.isArray(entries) ? entries.filter(entry => this.validEntry(entry)) : [];
      validEntries.push({ score: this.state.score, grade: this.grade, subject: this.subject, date: new Date().toISOString() });
      validEntries.sort((a, b) => b.score - a.score);
      storage.set('eduquest_leaderboard', validEntries.slice(0, 20));
      this.state = null;
    },

    validEntry(entry) {
      return entry && Number.isFinite(entry.score) && entry.score >= 0 && Number.isInteger(entry.grade) && entry.grade >= 3 && entry.grade <= 8 && Object.hasOwn(subjectNames, entry.subject) && typeof entry.date === 'string';
    },

    showLeaderboard() {
      this.elements['leaderboard-tabs'].innerHTML = [['all', 'All'], ...Object.entries(subjectNames).map(([id, label]) => [id, label])].map(([id, label], i) => `<button type="button" role="tab" data-filter="${id}" aria-selected="${i === 0}">${label}</button>`).join('');
      this.renderLeaderboard('all');
      this.elements['leaderboard-dialog'].showModal();
    },

    renderLeaderboard(filter) {
      const stored = storage.get('eduquest_leaderboard', []);
      const entries = (Array.isArray(stored) ? stored : []).filter(entry => this.validEntry(entry) && (filter === 'all' || entry.subject === filter)).sort((a, b) => b.score - a.score).slice(0, 20);
      const list = this.elements['leaderboard-list'];
      list.replaceChildren();
      if (!entries.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-scores';
        empty.textContent = 'No scores here yet. Finish a quiz to add one!';
        list.append(empty);
        return;
      }
      entries.forEach((entry, index) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-entry';
        const label = document.createElement('span');
        label.textContent = `#${index + 1} · ${subjectNames[entry.subject]} · Grade ${entry.grade}`;
        const score = document.createElement('strong');
        score.textContent = `${entry.score} pts`;
        row.append(label, score);
        list.append(row);
      });
    },

    clearLeaderboard() {
      storage.set('eduquest_leaderboard', []);
      const filter = this.elements['leaderboard-tabs'].querySelector('[aria-selected="true"]')?.dataset.filter || 'all';
      this.renderLeaderboard(filter);
    },

    escapeHTML(value) {
      return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    },

    showHome() {
      clearInterval(this.timer);
      this.state = null;
      this.elements['quiz-screen'].hidden = true;
      this.elements['results-screen'].hidden = true;
      this.elements['home-screen'].hidden = false;
    }
  };

  window.eduQuest = app;
  document.addEventListener('DOMContentLoaded', () => app.init());
})();
