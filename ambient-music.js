(() => {
  if (document.getElementById('hubMusicControls')) return;

  const enabledKey = 'learning-hub-ambient-music-enabled';
  const volumeKey = 'learning-hub-ambient-music-volume';
  const stageNames = ['Outer Rim', 'Ion Drift', 'Shadow Belt', 'Event Horizon', 'Deep Core'];
  const chords = [
    [130.81, 164.81, 196.00, 246.94],
    [110.00, 130.81, 164.81, 220.00],
    [87.31, 110.00, 130.81, 174.61],
    [98.00, 123.47, 146.83, 196.00]
  ];
  const melody = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392.00];
  let audioContext = null;
  let masterGain = null;
  let musicEnabled = false;
  let chordIndex = 0;
  let gameStage = 0;
  let transitionTimer = null;
  const scheduledTimers = new Set();
  let activeVoices = [];

  const styles = document.createElement('style');
  styles.textContent = `
    .hub-music-controls {
      position: fixed;
      right: max(14px, env(safe-area-inset-right));
      bottom: max(14px, env(safe-area-inset-bottom));
      z-index: 2147483000;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px 12px;
      border: 1px solid rgba(125, 211, 252, 0.36);
      border-radius: 15px;
      background: rgba(8, 13, 35, 0.9);
      color: #e6f3ff;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.36), 0 0 18px rgba(0, 212, 255, 0.12);
      backdrop-filter: blur(12px);
      font: 13px/1.2 system-ui, sans-serif;
    }
    .hub-music-toggle {
      border: 0;
      border-radius: 10px;
      padding: 8px 10px;
      background: linear-gradient(135deg, #0ea5e9, #7c3aed);
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .hub-music-toggle:hover { filter: brightness(1.12); }
    .hub-music-toggle:focus-visible,
    .hub-music-volume:focus-visible { outline: 2px solid #67e8f9; outline-offset: 2px; }
    .hub-music-volume-wrap { display: grid; gap: 3px; min-width: 88px; color: #b8c7e0; font-size: 10px; }
    .hub-music-volume { width: 88px; accent-color: #38bdf8; cursor: pointer; }
    .hub-music-stage {
      padding: 6px 8px;
      border: 1px solid rgba(192, 132, 252, 0.35);
      border-radius: 9px;
      color: #e9d5ff;
      background: rgba(126, 34, 206, 0.18);
      font-size: 10px;
      white-space: nowrap;
    }
    @media (max-width: 420px) {
      .hub-music-controls { gap: 6px; padding: 7px 8px; }
      .hub-music-toggle { padding: 8px; font-size: 11px; }
      .hub-music-volume-wrap { min-width: 68px; }
      .hub-music-volume { width: 68px; }
    }
  `;
  document.head.appendChild(styles);

  const controls = document.createElement('div');
  controls.id = 'hubMusicControls';
  controls.className = 'hub-music-controls';
  controls.innerHTML = `
    <button class="hub-music-toggle" type="button" aria-pressed="false">♫ Play music</button>
    <label class="hub-music-volume-wrap">Low volume
      <input class="hub-music-volume" type="range" min="0" max="15" step="1" value="7" aria-label="Ambient music volume">
    </label>
      <span class="hub-music-stage" aria-live="polite" hidden></span>
  `;
  document.body.appendChild(controls);

  const toggleButton = controls.querySelector('.hub-music-toggle');
  const volumeSlider = controls.querySelector('.hub-music-volume');
  const stageBadge = controls.querySelector('.hub-music-stage');

  try {
    const savedVolumeValue = localStorage.getItem(volumeKey);
    const savedVolume = Number(savedVolumeValue);
    if (savedVolumeValue !== null && Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 15) {
      volumeSlider.value = String(savedVolume);
    }
  } catch (error) {
    // Keep the quiet default when local storage is unavailable.
  }

  function mountControls() {
    const fullscreenTarget = document.fullscreenElement;
    const parent = fullscreenTarget || document.body;
    if (controls.parentElement !== parent) parent.appendChild(controls);
  }

  function setButtonState(label, enabled) {
    toggleButton.textContent = label;
    toggleButton.setAttribute('aria-pressed', String(enabled));
  }

  function getAudioContext() {
    if (audioContext) return audioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Web Audio is not supported in this browser.');
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = Number(volumeSlider.value) / 100;
    masterGain.connect(audioContext.destination);
    return audioContext;
  }

  function clearTimers() {
    if (transitionTimer !== null) {
      clearTimeout(transitionTimer);
      transitionTimer = null;
    }
    scheduledTimers.forEach(timer => clearTimeout(timer));
    scheduledTimers.clear();
  }

  function fadeOutVoices() {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    activeVoices.forEach(({ oscillator, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        oscillator.stop(now + 0.85);
      } catch (error) {
        // A voice may already be stopping as the next chord begins.
      }
    });
    activeVoices = [];
  }

  function playPadTone(frequency, amplitude, waveform = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = waveform;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(amplitude, now + 1.1);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    activeVoices.push({ oscillator, gain });
  }

  function playMelodyNote(frequency) {
    if (!musicEnabled || !audioContext || audioContext.state !== 'running') return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.75);
  }

  function playDeepPulse(frequency) {
    if (!musicEnabled || !audioContext || audioContext.state !== 'running') return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.58);
  }

  function startChord(index) {
    if (!musicEnabled || !audioContext) return;
    fadeOutVoices();
    chordIndex = index % chords.length;
    const semitoneShift = Math.max(0, gameStage - 1) * -2;
    const depthTuning = Math.pow(2, semitoneShift / 12);
    const chord = chords[chordIndex].map(frequency => frequency * depthTuning);
    chord.forEach((frequency, toneIndex) => {
      playPadTone(frequency, toneIndex === 3 ? 0.055 : 0.09);
    });

    if (gameStage >= 2) {
      playPadTone(chord[0] / 2, 0.08, 'triangle');
    }
    if (gameStage >= 4) {
      playPadTone(chord[2] * 2, 0.025);
    }

    const melodyInterval = gameStage >= 5 ? 560 : gameStage >= 3 ? 680 : 820;
    melody.forEach((baseFrequency, noteIndex) => {
      const frequency = baseFrequency * depthTuning;
      const timer = setTimeout(() => {
        scheduledTimers.delete(timer);
        playMelodyNote(frequency);
      }, noteIndex * melodyInterval);
      scheduledTimers.add(timer);
    });

    if (gameStage >= 3) {
      const pulseInterval = gameStage >= 5 ? 720 : 980;
      for (let beat = 0; beat < 6; beat++) {
        const timer = setTimeout(() => {
          scheduledTimers.delete(timer);
          playDeepPulse(chord[0] / 2);
        }, beat * pulseInterval);
        scheduledTimers.add(timer);
      }
    }

    transitionTimer = setTimeout(() => startChord(chordIndex + 1), 8200);
  }

  function setGameStage(stage) {
    const nextStage = Math.max(0, Math.min(stageNames.length, Math.floor(Number(stage) || 0)));
    if (nextStage === gameStage) return;
    gameStage = nextStage;
    stageBadge.hidden = gameStage === 0;
    stageBadge.textContent = gameStage === 0 ? '' : `Depth ${gameStage} · ${stageNames[gameStage - 1]}`;
    if (musicEnabled && audioContext?.state === 'running') {
      clearTimers();
      startChord(chordIndex);
    }
  }

  window.learningHubMusic = Object.freeze({ setGameStage });

  async function startMusic(automatic = false) {
    try {
      musicEnabled = true;
      const context = getAudioContext();
      if (context.state !== 'running') await context.resume();
      if (context.state !== 'running') throw new Error('Audio needs a tap to start.');
      masterGain.gain.setTargetAtTime(Number(volumeSlider.value) / 100, context.currentTime, 0.18);
      clearTimers();
      startChord(chordIndex);
      setButtonState('♫ Music on', true);
      try {
        localStorage.setItem(enabledKey, 'true');
      } catch (error) {
        // Playback still works for this page if storage is unavailable.
      }
    } catch (error) {
      musicEnabled = false;
      toggleButton.title = error.message;
      setButtonState(automatic ? '▶ Tap to resume' : '♫ Audio unavailable', false);
    }
  }

  function stopMusic() {
    musicEnabled = false;
    clearTimers();
    fadeOutVoices();
    setButtonState('♫ Play music', false);
    try {
      localStorage.setItem(enabledKey, 'false');
    } catch (error) {
      // Playback is still stopped for this page.
    }
  }

  toggleButton.addEventListener('click', () => {
    if (musicEnabled) stopMusic();
    else void startMusic(false);
  });

  volumeSlider.addEventListener('input', () => {
    const volume = Number(volumeSlider.value);
    try {
      localStorage.setItem(volumeKey, String(volume));
    } catch (error) {
      // The selected volume remains active for this page.
    }
    if (audioContext && masterGain) {
      masterGain.gain.setTargetAtTime(volume / 100, audioContext.currentTime, 0.12);
    }
  });

  document.addEventListener('fullscreenchange', mountControls);
  mountControls();

  try {
    if (localStorage.getItem(enabledKey) === 'true') void startMusic(true);
  } catch (error) {
    // Music stays opt-in if local storage is unavailable.
  }
})();
