/**
 * game.js — game loop, input, tile states and UI updates.
 * Tile scoring and solver math live in solver.js (single source of truth).
 */
(function () {
  const MAX_TRIES = 6, LEN = 5;
  const { targets, valid } = WORDS;
  const $ = (id) => document.getElementById(id);
  const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "+zxcvbnm-"]; // + = Enter, - = Backspace
  const CLASS = ["absent", "present", "correct"];

  let answer, row, current, over, pool, keyState;

  function newGame() {
    answer = targets[Math.floor(Math.random() * targets.length)];
    row = 0; current = ""; over = false; pool = targets.slice(); keyState = {};
    buildBoard(); buildKeyboard(); updateSolver();
  }

  function buildBoard() {
    const board = $("board"); board.innerHTML = "";
    for (let r = 0; r < MAX_TRIES; r++) {
      const el = document.createElement("div"); el.className = "row"; el.setAttribute("role", "row");
      for (let c = 0; c < LEN; c++) { const t = document.createElement("div"); t.className = "tile"; el.appendChild(t); }
      board.appendChild(el);
    }
  }

  function buildKeyboard() {
    const kb = $("keyboard"); kb.innerHTML = "";
    for (const letters of KEY_ROWS) {
      const r = document.createElement("div"); r.className = "krow";
      for (const ch of letters) {
        const b = document.createElement("button"); b.type = "button";
        b.className = "key" + (ch === "+" || ch === "-" ? " wide" : "");
        b.textContent = ch === "+" ? "Enter" : ch === "-" ? "⌫" : ch;
        b.dataset.key = ch === "+" ? "Enter" : ch === "-" ? "Backspace" : ch;
        b.addEventListener("click", () => handleKey(b.dataset.key));
        r.appendChild(b);
      }
      kb.appendChild(r);
    }
  }

  const tiles = () => $("board").children[row].children;

  function render() {
    [...tiles()].forEach((t, i) => { t.textContent = current[i] || ""; t.classList.toggle("filled", !!current[i]); });
  }

  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove("show"), 1600);
  }

  function handleKey(k) {
    if (over) return;
    if (k === "Enter") return submit();
    if (k === "Backspace") current = current.slice(0, -1);
    else if (/^[a-z]$/.test(k) && current.length < LEN) current += k;
    render();
  }

  function submit() {
    if (current.length < LEN) return toast("Not enough letters");
    if (!valid.has(current)) { toast("Not in word list"); $("board").children[row].classList.add("shake");
      setTimeout(() => $("board").children[row].classList.remove("shake"), 400); return; }
    const pattern = Solver.score(current, answer);
    [...tiles()].forEach((t, i) => t.classList.add(CLASS[pattern[i]]));
    updateKeys(current, pattern);
    pool = Solver.filterCandidates(pool, current, pattern);
    if (current === answer) { over = true; toast("You got it!"); }
    else if (row === MAX_TRIES - 1) { over = true; toast(answer.toUpperCase()); }
    row++; current = "";
    updateSolver();
  }

  /** Keep the strongest known state per key: correct > present > absent. */
  function updateKeys(word, pattern) {
    [...word].forEach((ch, i) => { keyState[ch] = Math.max(keyState[ch] ?? -1, pattern[i]); });
    document.querySelectorAll(".key").forEach((b) => {
      const s = keyState[b.dataset.key];
      if (s !== undefined) b.className = "key " + CLASS[s];
    });
  }

  function updateSolver() {
    const list = $("suggestions"); list.innerHTML = "";
    $("pool").textContent = `${pool.length} possible word${pool.length === 1 ? "" : "s"} left`;
    if (over || !pool.length) return;
    for (const { word, bits } of Solver.rank(pool, 3)) {
      const li = document.createElement("li");
      li.innerHTML = `<span><span class="w">${word}</span><br><span class="bits">${bits.toFixed(2)} bits</span></span>`;
      const b = document.createElement("button"); b.type = "button"; b.textContent = "Use";
      b.addEventListener("click", () => { current = word; render(); }); // one-click auto-fill
      li.appendChild(b); list.appendChild(li);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    handleKey(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  });
  $("new-game").addEventListener("click", (e) => { newGame(); e.target.blur(); });
  newGame();
})();
