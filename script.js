const text = "Plotting distance...";
const typingText = document.getElementById("typing-text");

const beginBtn = document.getElementById("begin-btn");

const music = document.getElementById("bg-music");

const heartScene = document.getElementById("heart-scene");

const intro = document.getElementById("intro");

const nextBtn = document.getElementById("next-btn");

const galaxyScene = document.getElementById("galaxy-scene");

const finalBtn = document.getElementById("final-btn");

const finalScene = document.getElementById("final-scene");

const secretBtn = document.getElementById("secret-btn");

const secretMessage = document.getElementById("secret-message");

let index = 0;

/* TYPING */

function typeLetter() {

  if(index < text.length) {

    typingText.innerHTML += text.charAt(index);

    index++;

    setTimeout(typeLetter, 100);

  } else {

    beginBtn.style.opacity = 1;
  }
}

typeLetter();

/* BEGIN */

beginBtn.addEventListener("click", () => {

  music.volume = 0.2;

  music.play();

  intro.style.transition = "opacity 2s";

  intro.style.opacity = 0;

  setTimeout(() => {

    intro.style.display = "none";

    heartScene.style.display = "flex";

  }, 2000);
});

/* HEART -> GALAXY */

nextBtn.addEventListener("click", () => {

  heartScene.style.opacity = 0;

  setTimeout(() => {

    heartScene.style.display = "none";

    galaxyScene.style.display = "block";

  }, 1000);
});

/* GALAXY -> FINAL */

finalBtn.addEventListener("click", () => {

  galaxyScene.style.opacity = 0;

  setTimeout(() => {

    galaxyScene.style.display = "none";

    finalScene.style.display = "flex";

  }, 1000);
});

/* SONG MESSAGE */

// function showMessage(title, text) {

//   document.getElementById("song-title").innerText = title;

//   document.getElementById("song-text").innerText = text;

//   document.getElementById("song-message").style.opacity = 1;
// }

let activeStar = null;

function showMessage(title, text, element) {

  const messageBox = document.getElementById("song-message");

  // TOGGLE OFF if same star clicked again
  if (activeStar === element && messageBox.style.opacity == 1) {

    messageBox.style.opacity = 0;

    activeStar = null;

    return;
  }

  activeStar = element;

  document.getElementById("song-title").innerText = title;

  document.getElementById("song-text").innerText = text;

  // get star position
  const rect = element.getBoundingClientRect();

  // position popup near star
  messageBox.style.left = `${rect.left - 110}px`;

  messageBox.style.top = `${rect.top + 30}px`;

  // show popup
  messageBox.style.opacity = 1;
  messageBox.style.transform = "scale(1)";
}

galaxyScene.addEventListener("click", (e) => {

  // if click is NOT on a star
  if (!e.target.closest(".song-star")) {

    document.getElementById("song-message").style.opacity = 0;
    messageBox.style.transform = "scale(0.9)";

    activeStar = null;
  }
});

/* SECRET MESSAGE */

secretBtn.addEventListener("click", () => {

  secretMessage.style.display = "block";

});