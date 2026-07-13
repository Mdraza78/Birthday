/* ===== Config ===== */
const PASSCODE = "2003"; // change to a meaningful date
const NAME = "My Love";    // change to their name

const HINT = "The day we became us 🗝️";
const GREETING = "It's your special day! 🎉";

const MEMORIES = [
  { src: "Img/memory-1.jpg", caption: "golden hours ☁️", tilt: -5 },
  { src: "Img/memory-2.jpg", caption: "sweetest days 🍦", tilt: 3 },
  { src: "Img/memory-3.jpg", caption: "party mode 🎈", tilt: -2 },
  { src: "Img/memory-4.jpg", caption: "you & flowers 🌷", tilt: 4 },
];

const GIFTS = [
  { emoji: "🧸", message: "A lifetime of hugs, whenever you need them." },
  { emoji: "🌙", message: "Every night ends with you in my thoughts." },
  { emoji: "✈️", message: "Adventures with you are my favorite kind." },
  { emoji: "☕", message: "Slow mornings and coffee dates, always." },
];

const PHOTO = "Img/flower.jpg";

const VIDEO_CAPTION = "a little moment, just for you 🎬";

/* ===== Router-ish ===== */
const app = document.getElementById("app");

function go(screen) {
  app.innerHTML = "";
  switch (screen) {
    case "lock": renderLock(); break;
    case "wrong": renderWrong(); break;
    case "cake": renderCake(); break;
    case "gifts": renderGifts(); break;
    case "memories": renderMemories(); break;
    case "video": renderVideo(); break;
    case "letter": renderLetter(); break;
  }
}

/* ===== Helpers ===== */
function tpl(id) {
  return document.getElementById(id).content.cloneNode(true);
}
function $(root, role) {
  return root.querySelector(`[data-role="${role}"]`);
}
function spawnConfetti(count = 30) {
  const colors = ["#f2c94c", "#d94a6b", "#f4c8d1", "#fbf5e9", "#6b2436"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.width = (6 + Math.random() * 8) + "px";
    piece.style.height = (10 + Math.random() * 12) + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.animationDuration = (2 + Math.random() * 3) + "s";
    piece.style.animationDelay = Math.random() * 1 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

/* ===== Lock ===== */
function renderLock() {
  const node = tpl("tpl-lock");
  $(node, "photo").src = PHOTO;
  $(node, "hint").textContent = HINT;
  const dots = $(node, "dots");
  const keypad = $(node, "keypad");
  let input = "";

  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.dataset.index = i;
    dots.appendChild(dot);
  }

  for (let i = 1; i <= 9; i++) {
    const key = document.createElement("button");
    key.className = "keypad-key";
    key.textContent = i;
    key.addEventListener("click", () => enter(i));
    keypad.appendChild(key);
  }

  // spacer keeps 0 centered on the last row
  keypad.appendChild(document.createElement("div")).className = "keypad-spacer";

  const zero = document.createElement("button");
  zero.className = "keypad-key";
  zero.textContent = "0";
  zero.addEventListener("click", () => enter(0));
  keypad.appendChild(zero);

  keypad.appendChild(document.createElement("div")).className = "keypad-spacer";

  function updateDots() {
    dots.querySelectorAll(".dot").forEach((d, i) => {
      d.textContent = i < input.length ? "●" : "";
    });
  }
  function enter(n) {
    if (input.length < 4) {
      input += n;
      updateDots();
    }
    if (input.length === 4) {
      setTimeout(check, 200);
    }
  }
  function check() {
    if (input === PASSCODE) go("cake");
    else go("wrong");
  }
  $(node, "clear").addEventListener("click", () => { input = ""; updateDots(); });
  $(node, "unlock").addEventListener("click", check);
  app.appendChild(node);
}

/* ===== Wrong ===== */
function renderWrong() {
  const node = tpl("tpl-wrong");
  $(node, "retry").addEventListener("click", () => go("lock"));
  app.appendChild(node);
}

/* ===== Cake ===== */
function renderCake() {
  const node = tpl("tpl-cake");
  $(node, "greet").textContent = GREETING;
  const btn = $(node, "cake-img");
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

/* ===== Gifts ===== */
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

/* ===== Memories ===== */
function renderMemories() {
  const node = tpl("tpl-memories");
  const strip = $(node, "strip");
  MEMORIES.forEach((m, i) => {
    const tilt = m.tilt ?? (i % 2 === 0 ? -4 : 3);
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.style.transform = `rotate(${tilt}deg)`;
    fig.style.animationDelay = `${i * 0.25}s`;
    fig.innerHTML = `<img src="${m.src}" alt="${m.caption}"/><figcaption>${m.caption}</figcaption>`;
    strip.appendChild(fig);
  });
  $(node, "next").addEventListener("click", () => go("video"));
  app.appendChild(node);
}

/* ===== Video ===== */
function renderVideo() {
  const node = tpl("tpl-video");
  $(node, "caption").textContent = VIDEO_CAPTION;

  const video = $(node, "video");
  const source = $(node, "source");
  const empty = $(node, "empty");
  const fileInput = $(node, "file-input");
  let objectUrl = null;

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);

    source.src = objectUrl;
    video.load();
    video.hidden = false;
    empty.hidden = true;
    video.play().catch(() => {});
  });

  $(node, "next").addEventListener("click", () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    go("letter");
  });
  app.appendChild(node);
}

/* ===== Letter ===== */
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

/* ===== Boot ===== */
go("lock");