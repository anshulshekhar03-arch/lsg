


// --- ELEMENTS ---
const gateway = document.getElementById('gateway');
const startBtn = document.getElementById('start-btn');
const mainContent = document.getElementById('main-content');
const music = document.getElementById('bg-music');
const visualizer = document.getElementById('audio-visualizer');

// --- GATEWAY & AUDIO ---
startBtn.addEventListener('click', () => {
  gateway.style.opacity = '0';
  
  // Start Music
  music.volume = 0;
  music.play();
  let vol = 0;
  let fade = setInterval(() => {
    if (vol < 0.3) { vol += 0.02; music.volume = vol; }
    else clearInterval(fade);
  }, 100);

  setTimeout(() => {
    gateway.style.display = 'none';
    mainContent.classList.remove('hidden');
    document.querySelector('.calligraphy-text').classList.add('draw-text');
    visualizer.classList.add('show');
  }, 2000);
});

// --- SCROLL TIMELINE GRAPH LOGIC ---
const timelineLine = document.getElementById('t-line');
const timelineSection = document.querySelector('.timeline-section');

window.addEventListener('scroll', () => {
  const sectionTop = timelineSection.offsetTop;
  const sectionHeight = timelineSection.offsetHeight;
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  if (scrollY + windowHeight > sectionTop) {
    let drawPercentage = ((scrollY + windowHeight - sectionTop) / (sectionHeight)) * 100;
    drawPercentage = Math.min(Math.max(drawPercentage, 0), 100);
    timelineLine.style.height = `${drawPercentage}%`;
  }
});

// --- INTERSECTION OBSERVERS ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2
};

// 1. Timeline Cards
const timelineObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
  timelineObserver.observe(item);
});

// 2. Dashboard Stats
const statObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach((card, index) => {
  setTimeout(() => statObserver.observe(card), index * 200);
});

// 3. Geography Map
const geoObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('draw-geo');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const mapCard = document.querySelector('.map-card');
if(mapCard) geoObserver.observe(mapCard);

// 4. Soundtrack Carousel
const trackObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.track-card').forEach((card, index) => {
  setTimeout(() => trackObserver.observe(card), index * 200);
});

// 5. Projections Chart
const chartObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('draw-chart');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const chartContainer = document.querySelector('.chart-container');
if(chartContainer) chartObserver.observe(chartContainer);

// 6. Constants Grid
const gridObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pills = entry.target.querySelectorAll('.glass-pill');
      pills.forEach((pill, index) => {
        setTimeout(() => {
          pill.classList.add('visible');
        }, index * 150);
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const constantsSection = document.querySelector('.constants-section');
if(constantsSection) gridObserver.observe(constantsSection);


// --- FINALE: TACTILE PRESS & HOLD ---
const tactileBox = document.getElementById('tactile-box');
const holdRing = document.getElementById('hold-ring');
const heartbeatContainer = document.getElementById('heartbeat-container');
const heartbeatSvg = document.querySelector('.heartbeat-svg path');

let holdTimer;
let holdProgress = 0;

function startHold(e) {
  if(e.type === 'touchstart') e.preventDefault();
  
  let vol = music.volume;
  let swell = setInterval(() => {
    if(vol < 0.6) { vol += 0.05; music.volume = vol; }
    else clearInterval(swell);
  }, 100);

  holdTimer = setInterval(() => {
    holdProgress += 2;
    holdRing.style.width = `${holdProgress}%`;
    holdRing.style.height = `${holdProgress}%`;

    if (holdProgress >= 100) {
      triggerFinale();
    }
  }, 40);
}

function stopHold() {
  clearInterval(holdTimer);
  if (holdProgress < 100) {
    holdProgress = 0;
    holdRing.style.width = `0%`;
    holdRing.style.height = `0%`;
    music.volume = 0.3;
  }
}

function triggerFinale() {
  clearInterval(holdTimer);
  tactileBox.style.display = 'none';
  
  setTimeout(() => {
    heartbeatContainer.classList.remove('hidden');
    heartbeatSvg.classList.add('draw-beat');
  }, 500);
}

tactileBox.addEventListener('mousedown', startHold);
tactileBox.addEventListener('mouseup', stopHold);
tactileBox.addEventListener('mouseleave', stopHold);
tactileBox.addEventListener('touchstart', startHold);
tactileBox.addEventListener('touchend', stopHold);

// --- SOUNDTRACK INTERACTIVITY ---
const trackCards = document.querySelectorAll('.track-card');
const trackPlayer = document.getElementById('track-player');
let currentPlayingCard = null;

trackCards.forEach(card => {
  card.addEventListener('click', () => {
    const songSrc = card.getAttribute('data-song');
    const indicator = card.querySelector('.play-indicator');

    // 1. If clicking the currently playing song -> Pause it
    if (currentPlayingCard === card && !trackPlayer.paused) {
      trackPlayer.pause();
      card.classList.remove('playing');
      indicator.innerHTML = "▶ PLAY"; // Switched back to Play
      
      // Resume the main background music softly
      music.play();
      return;
    }

    // 2. Reset all cards visually
    trackCards.forEach(c => {
      c.classList.remove('playing');
      c.querySelector('.play-indicator').innerHTML = "▶ PLAY";
    });

    // 3. Pause main background music
    music.pause();

    // 4. Play the selected track
    trackPlayer.src = songSrc;
    trackPlayer.play();
    
    // 5. Update UI for the active card
    card.classList.add('playing');
    indicator.innerHTML = "⏸ PAUSE"; // Clearly indicates they can pause it
    currentPlayingCard = card;
  });
});

// 6. When the track ends naturally, revert to main bg music
trackPlayer.addEventListener('ended', () => {
  if (currentPlayingCard) {
    currentPlayingCard.classList.remove('playing');
    currentPlayingCard.querySelector('.play-indicator').innerHTML = "▶ PLAY";
  }
  music.play();
});
