// --- 1. DYNAMIC CANVAS PARTICLES & GLOW CURSOR ---
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const cursorGlow = document.getElementById('cursor-glow');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.6;
    this.speedY = Math.random() * 0.4 + 0.15;
    this.speedX = (Math.random() - 0.5) * 0.25;
    this.opacity = Math.random() * 0.5 + 0.15;
    this.color = Math.random() > 0.4 ? '255, 0, 127' : '244, 217, 158';
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < 0) this.y = canvas.height;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
  }
  draw() {
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = Array.from({ length: 50 }, () => new Particle());

function renderLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(renderLoop);
}
renderLoop();

// --- 2. GATEWAY & AUDIO SYSTEM ---
const gateway = document.getElementById('gateway');
const startBtn = document.getElementById('start-btn');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');
const trackPlayer = document.getElementById('track-player');
const audioPill = document.getElementById('audio-pill');
const pillTitle = document.getElementById('pill-title');
const pillToggleBtn = document.getElementById('pill-toggle-btn');

startBtn.addEventListener('click', () => {
  gateway.style.opacity = '0';

  bgMusic.volume = 0;
  bgMusic.play().catch(() => {});
  
  let currentVol = 0;
  const fade = setInterval(() => {
    if (currentVol < 0.35) {
      currentVol += 0.02;
      bgMusic.volume = currentVol;
    } else {
      clearInterval(fade);
    }
  }, 80);

  setTimeout(() => {
    gateway.style.display = 'none';
    mainContent.classList.remove('hidden');
    audioPill.classList.remove('hidden');
  }, 1600);
});

// Audio Pill Controls
pillToggleBtn.addEventListener('click', () => {
  const activeAudio = !trackPlayer.paused ? trackPlayer : bgMusic;
  if (activeAudio.paused) {
    activeAudio.play();
    pillToggleBtn.innerText = '⏸';
  } else {
    activeAudio.pause();
    pillToggleBtn.innerText = '▶';
  }
});

// --- 3. TIMELINE SCROLL OBSERVER ---
const timelineLine = document.getElementById('t-line');
const timelineContainer = document.querySelector('.timeline-container');

window.addEventListener('scroll', () => {
  if (!timelineContainer) return;
  const rect = timelineContainer.getBoundingClientRect();
  const windowH = window.innerHeight;

  if (rect.top < windowH && rect.bottom > 0) {
    const progress = Math.min(Math.max((windowH - rect.top) / rect.height * 100, 0), 100);
    timelineLine.style.height = `${progress}%`;
  }
});

const timelineEntries = document.querySelectorAll('.timeline-entry');
const entryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

timelineEntries.forEach(item => entryObserver.observe(item));

// --- 4. LIGHTBOX INTERACTIVITY ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.polaroid-wrapper').forEach(item => {
  item.addEventListener('click', () => {
    const fullSrc = item.getAttribute('data-full');
    const note = item.getAttribute('data-caption');
    const fallbackSrc = item.querySelector('img').src;

    lightboxImg.src = fullSrc || fallbackSrc;
    lightboxCaption.textContent = note;
    lightbox.classList.remove('hidden');
  });
});

lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.add('hidden');
});

// --- 5. TURNTABLE & VINYL LOGIC ---
const vinylDisc = document.getElementById('vinyl-disc');
const tonearm = document.getElementById('tonearm');
const discLabel = document.getElementById('disc-label');
const trackRows = document.querySelectorAll('.track-row');

trackRows.forEach(row => {
  row.addEventListener('click', () => {
    const songSrc = row.getAttribute('data-song');
    const title = row.getAttribute('data-title');
    const isCurrentlyActive = row.classList.contains('active');

    // If currently playing -> toggle pause
    if (isCurrentlyActive && !trackPlayer.paused) {
      trackPlayer.pause();
      vinylDisc.classList.remove('spinning');
      tonearm.classList.remove('engaged');
      row.querySelector('.track-cue-btn').innerText = 'Play';
      bgMusic.play();
      pillTitle.innerText = 'Main Score';
      return;
    }

    // Switch tracks
    trackRows.forEach(r => {
      r.classList.remove('active');
      r.querySelector('.track-cue-btn').innerText = 'Play';
    });

    row.classList.add('active');
    row.querySelector('.track-cue-btn').innerText = 'Pause';
    discLabel.innerText = title.substring(0, 10);
    pillTitle.innerText = title;

    // Crossfade: pause ambient background music
    bgMusic.pause();

    trackPlayer.src = songSrc;
    trackPlayer.play().catch(() => {});

    // Animate tonearm and spinning vinyl
    tonearm.classList.add('engaged');
    vinylDisc.classList.add('spinning');
  });
});

trackPlayer.addEventListener('ended', () => {
  vinylDisc.classList.remove('spinning');
  tonearm.classList.remove('engaged');
  trackRows.forEach(r => {
    r.classList.remove('active');
    r.querySelector('.track-cue-btn').innerText = 'Play';
  });
  bgMusic.play();
  pillTitle.innerText = 'Main Score';
});

// --- 6. TACTILE FINALE ---
const tactileBox = document.getElementById('tactile-box');
const holdRing = document.getElementById('hold-ring');
const heartbeatContainer = document.getElementById('heartbeat-container');
const heartbeatPath = document.querySelector('.heartbeat-svg path');

let holdTimer;
let holdProgress = 0;

function startHold(e) {
  if (e.type === 'touchstart') e.preventDefault();
  
  holdTimer = setInterval(() => {
    holdProgress += 2.5;
    holdRing.style.width = `${holdProgress}%`;
    holdRing.style.height = `${holdProgress}%`;

    if (holdProgress >= 100) {
      clearInterval(holdTimer);
      triggerCelebration();
    }
  }, 30);
}

function stopHold() {
  clearInterval(holdTimer);
  if (holdProgress < 100) {
    holdProgress = 0;
    holdRing.style.width = '0%';
    holdRing.style.height = '0%';
  }
}

function triggerCelebration() {
  tactileBox.style.display = 'none';
  heartbeatContainer.classList.remove('hidden');
  heartbeatPath.classList.add('draw-beat');
}

tactileBox.addEventListener('mousedown', startHold);
tactileBox.addEventListener('mouseup', stopHold);
tactileBox.addEventListener('mouseleave', stopHold);
tactileBox.addEventListener('touchstart', startHold);
tactileBox.addEventListener('touchend', stopHold);


// --- LIVE TIME COUNTER (Since Day 1: April 15, 2026) ---
const START_DATE = new Date('2026-04-15T00:00:00');

function updateLiveCounter() {
  const now = new Date();
  const diff = now - START_DATE;

  if (diff < 0) return;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const pad = (n) => String(n).padStart(2, '0');

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-minutes');
  const secsEl = document.getElementById('count-seconds');

  if (daysEl) daysEl.textContent = pad(days);
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minsEl) minsEl.textContent = pad(minutes);
  if (secsEl) secsEl.textContent = pad(seconds);
}

setInterval(updateLiveCounter, 1000);
updateLiveCounter();

// --- CAPSULE REVEAL INTERACTION ---
const capsules = document.querySelectorAll('.capsule');
const storyCard = document.getElementById('capsule-modal-card');
const storyText = document.getElementById('capsule-story-text');

capsules.forEach(cap => {
  cap.addEventListener('click', () => {
    capsules.forEach(c => c.classList.remove('active'));
    cap.classList.add('active');

    const detail = cap.getAttribute('data-detail');
    storyText.textContent = `"${detail}"`;
    storyCard.classList.remove('hidden');
  });
});
