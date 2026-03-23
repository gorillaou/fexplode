const explodeBtn = document.getElementById("explodeBtn");
const restartBtn = document.getElementById("restartBtn");
const statusText = document.getElementById("status");

let exploded = false;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function playExplosionSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const boom = ctx.createOscillator();
  const boomGain = ctx.createGain();
  boom.type = "sawtooth";
  boom.frequency.setValueAtTime(140, now);
  boom.frequency.exponentialRampToValueAtTime(30, now + 0.8);
  boomGain.gain.setValueAtTime(0.0001, now);
  boomGain.gain.exponentialRampToValueAtTime(0.85, now + 0.02);
  boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  boom.connect(boomGain).connect(ctx.destination);
  boom.start(now);
  boom.stop(now + 0.95);

  const crack = ctx.createOscillator();
  const crackGain = ctx.createGain();
  crack.type = "square";
  crack.frequency.setValueAtTime(900, now);
  crack.frequency.exponentialRampToValueAtTime(120, now + 0.18);
  crackGain.gain.setValueAtTime(0.0001, now);
  crackGain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  crack.connect(crackGain).connect(ctx.destination);
  crack.start(now);
  crack.stop(now + 0.24);
}

function spawnParticles(count = 170) {
  const colors = ["#ffd166", "#ff9f1c", "#ff6d00", "#ff3d2e", "#ffe8a3", "#ffffff"];

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.setProperty("--dx", `${rand(-720, 720)}px`);
    particle.style.setProperty("--dy", `${rand(-500, 500)}px`);
    particle.style.setProperty("--size", `${rand(3, 10)}px`);
    particle.style.setProperty("--color", colors[Math.floor(rand(0, colors.length))]);
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
  }
}

function triggerExplosion(source) {
  if (exploded) return;
  exploded = true;

  document.body.classList.add("exploding");
  statusText.textContent = `F detected via ${source}. Earth is no longer available.`;

  spawnParticles();
  playExplosionSound();

  setTimeout(() => {
    document.body.classList.add("aftermath");
    statusText.textContent = "Mission accomplished: the world exploded.";
    restartBtn.hidden = false;
  }, 1200);
}

explodeBtn.addEventListener("click", () => triggerExplosion("button"));

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key.toLowerCase() === "f") {
    triggerExplosion("keyboard");
  }
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});
