const PASSCODE = "1207";
const HINT = "Hint: your birthday (DDMM) 💗";
const NAME = "Cutie";
const LOCK_PHOTO = "Img/flower.jpg";
const GIFTS = [
  { emoji: "💌", message: "I want to annoy you for the rest of your life 🐧" },
  { emoji: "🌸", message: "You make ordinary days feel like celebrations" },
  { emoji: "⭐", message: "May this year be full of little wins & warm moments" },
];
const MEMORIES = [
  { src: "Img/memory-1.jpg", caption: "golden hours ☁️", tilt: -4 },
  { src: "Img/memory-2.jpg", caption: "sweetest days 🍦", tilt: 3 },
  { src: "Img/memory-3.jpg", caption: "party mode 🎈", tilt: -2 },
  { src: "Img/memory-4.jpg", caption: "you & flowers 🌷", tilt: 4 },
];
const CONFETTI_COLORS = ["#f8b4c4", "#ffd97d", "#a8d8ea", "#ff8fa3", "#fff1c9"];
/* ====== State machine ====== */
const app = document.getElementById("app");
const stages = { lock: renderLock, wrong: renderWrong, cake: renderCake, gifts: renderGifts, memories: renderMemories, letter: renderLetter };
function go(stage) {
  app.innerHTML = "";
  // remove any leftover confetti from previous screens
  document.querySelectorAll(".confetti-piece").forEach((n) => n.remove());
  stages[stage]();
}
function tpl(id) { return document.getElementById(id).content.firstElementChild.cloneNode(true); }
function $(root, sel) { return root.querySelector(`[data-role="${sel}"]`); }
/* ====== Confetti ====== */
function spawnConfetti(count = 40) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "confetti-piece";
    const size = 6 + Math.random() * 8;
    const round = Math.random() > 0.5;
    s.style.left = Math.random() * 100 + "vw";
    s.style.width = size + "px";
    s.style.height = size * (round ? 1 : 0.5) + "px";
    s.style.backgroundColor = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    s.style.borderRadius = round ? "50%" : "2px";
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.animationDuration = 3 + Math.random() * 3 + "s";
    document.body.appendChild(s);
  }
}
/* ====== Lock ====== */
function renderLock() {
  const node = tpl("tpl-lock");
  $(node, "photo").src = LOCK_PHOTO;
  $(node, "hint").textContent = HINT;
  const dots = $(node, "dots");
  const keypad = $(node, "keypad");
  const keypadWrap = $(node, "keypad-wrap");
  let entered = "";
  function drawDots() {
    dots.innerHTML = "";
    for (let i = 0; i < PASSCODE.length; i++) {
      const d = document.createElement("div");
      d.className = "dot";
      d.textContent = entered[i] ? "✱" : "";
      dots.appendChild(d);
    }
  }
  drawDots();
  ["1","2","3","4","5","6","7","8","9","*","0","#"].forEach((k) => {
    const b = document.createElement("button");
    b.className = "keypad-key";
    b.textContent = k;
    b.setAttribute("aria-label", "Key " + k);
    b.addEventListener("click", () => {
      if (entered.length < PASSCODE.length) { entered += k; drawDots(); }
    });
    keypad.appendChild(b);
  });
  $(node, "clear").addEventListener("click", () => { entered = ""; drawDots(); });
  $(node, "unlock").addEventListener("click", () => {
    if (entered === PASSCODE) {
      go("cake");
    } else {
      keypadWrap.classList.add("animate-shake");
      setTimeout(() => {
        keypadWrap.classList.remove("animate-shake");
        entered = "";
        go("wrong");
      }, 550);
    }
  });
  app.appendChild(node);
}
/* ====== Wrong ====== */
function renderWrong() {
  const node = tpl("tpl-wrong");
  $(node, "retry").addEventListener("click", () => go("lock"));
  app.appendChild(node);
}
/* ====== Cake ====== */
function renderCake() {
  const node = tpl("tpl-cake");
  $(node, "greet").textContent = `Happy Birthday, ${NAME}! 🎂`;
  const btn = $(node, "cake-btn");
  const flames = $(node, "flames");
  const img = $(node, "cake-img");
  const hint = $(node, "cake-hint");
  const nextWrap = $(node, "next-wrap");
  btn.addEventListener("click", () => {
    flames.style.display = "none";
    img.classList.remove("animate-float");
    hint.textContent = "Yay! Your wish is on its way ✨";
    nextWrap.hidden = false;
  }, { once: true });
  $(node, "next").addEventListener("click", () => go("gifts"));
  app.appendChild(node);
  spawnConfetti(40);
}
/* ====== Gifts ====== */
function renderGifts() {
  const node = tpl("tpl-gifts");
  const wrap = $(node, "gifts");
  const nextBtn = $(node, "next");
  const opened = GIFTS.map(() => false);
  GIFTS.forEach((gift, i) => {
    const cell = document.createElement("div");
    cell.className = "gift-cell";
    const btn = document.createElement("button");
    btn.className = "gift-btn animate-float";
    btn.style.animationDelay = i * 0.4 + "s";
    btn.setAttribute("aria-label", `Open gift ${i + 1}`);
    btn.innerHTML = `<img src="Img/penguin-gift.png" alt="Penguin holding a gift" class="gift-img" />`;
    btn.addEventListener("click", () => {
      opened[i] = true;
      cell.innerHTML = `
        <div class="animate-pop gift-card">
          <div class="gift-emoji">${gift.emoji}</div>
          <p class="gift-msg">${gift.message}</p>
        </div>`;
      if (opened.every(Boolean)) nextBtn.hidden = false;
    });
    cell.appendChild(btn);
    wrap.appendChild(cell);
  });
  nextBtn.addEventListener("click", () => go("memories"));
  app.appendChild(node);
}
function renderMemories() {
  const node = tpl("tpl-memories");
  const strip = $(node, "strip");
  MEMORIES.forEach((m, i) => {
    const tilt = m.tilt ?? (i % 2 === 0 ? -4 : 3);
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.style.transform = `rotate(${tilt}deg)`;
    fig.innerHTML = `<img src="${m.src}" alt="${m.caption}" /><figcaption>${m.caption}</figcaption>`;
    strip.appendChild(fig);
  });
  $(node, "next").addEventListener("click", () => go("letter"));
  app.appendChild(node);
}

/* ====== Letter ====== */
function renderLetter() {
  const node = tpl("tpl-letter");
  const closed = $(node, "closed");
  const opened = $(node, "opened");
  $(node, "name").textContent = NAME;
  $(node, "open").addEventListener("click", () => {
    closed.hidden = true;
    opened.hidden = false;
    spawnConfetti(30);
  });
  const hearts = $(node, "hearts");
  $(node, "love").addEventListener("click", () => {
    const h = document.createElement("span");
    h.className = "heart-particle";
    h.textContent = "💗";
    h.style.left = (30 + Math.random() * 40) + "%";
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 1700);
  });
  app.appendChild(node);
}
/* ====== Boot ====== */
go("lock");
