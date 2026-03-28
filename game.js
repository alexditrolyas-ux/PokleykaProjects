const width = 8;
const colors = ["red", "blue", "green", "yellow", "purple"];

let board = [];
let score = 0;
const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
let first = null;

// --------------------
function createBoard() {
  boardEl.innerHTML = "";
  board = [];
  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement("div");
    setCell(cell, randomColor());
    cell.dataset.id = i;
    board.push(cell);
    boardEl.appendChild(cell);
  }
  scoreEl.innerText = "Очки: " + score;
}

// --------------------
function setCell(cell, color, special = null) {
  cell.className = "cell " + color;
  if (special) cell.classList.add(special);
}

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// --------------------
// Ход игрока
boardEl.addEventListener("click", e => {
  const target = e.target;
  if (!target.classList.contains("cell")) return;

  if (!first) {
    first = target;
    first.classList.add("selected");
  } else {
    swap(first, target);
    activateSpecial(first);
    activateSpecial(target);

    first.classList.remove("selected");
    first = null;

    gameLoop();
  }
});

// --------------------
function swap(a, b) {
  const temp = a.className;
  a.className = b.className;
  b.className = temp;
}

// --------------------
function activateSpecial(cell) {
  if (cell.classList.contains("bomb")) explode(cell);
  if (cell.classList.contains("lightning")) clearColor(cell);
}

function explode(cell) {
  const id = Number(cell.dataset.id);
  const row = Math.floor(id / width);
  const col = id % width;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < width && c >= 0 && c < width) {
        removeCell(r * width + c);
      }
    }
  }
}

function clearColor(cell) {
  const color = cell.classList[1];
  board.forEach((c, i) => {
    if (c.classList.contains(color)) removeCell(i);
  });
}

function removeCell(i) {
  if (!board[i] || !board[i].classList[1]) return;
  board[i].classList.add("match");
  setTimeout(() => {
    board[i].className = "cell";
    score += 10;
    scoreEl.innerText = "Очки: " + score;
  }, 200);
}

function colorOf(i) {
  return board[i].classList[1];
}

function setSpecial(i, type) {
  board[i].classList.add(type);
}

// --------------------
// Проверка совпадений
function checkMatches() {
  let matched = new Set();

  // Горизонталь
  for (let row = 0; row < width; row++) {
    let streakColor = null;
    let streak = [];
    for (let col = 0; col < width; col++) {
      let i = row * width + col;
      let c = colorOf(i);
      if (c && c === streakColor) streak.push(i);
      else {
        if (streak.length >= 3) streak.forEach(x => matched.add(x));
        streakColor = c;
        streak = c ? [i] : [];
      }
    }
    if (streak.length >= 3) streak.forEach(x => matched.add(x));
  }

  // Вертикаль
  for (let col = 0; col < width; col++) {
    let streakColor = null;
    let streak = [];
    for (let row = 0; row < width; row++) {
      let i = row * width + col;
      let c = colorOf(i);
      if (c && c === streakColor) streak.push(i);
      else {
        if (streak.length >= 3) streak.forEach(x => matched.add(x));
        streakColor = c;
        streak = c ? [i] : [];
      }
    }
    if (streak.length >= 3) streak.forEach(x => matched.add(x));
  }

  matched.forEach(i => {
    if (board[i].classList.contains("bomb")) explode(board[i]);
    if (board[i].classList.contains("lightning")) clearColor(board[i]);
    removeCell(i);
  });

  return matched.size > 0;
}

// --------------------
// Падение и заполнение
function drop() {
  for (let col = 0; col < width; col++) {
    let empty = [];
    for (let row = width - 1; row >= 0; row--) {
      let i = row * width + col;
      if (!colorOf(i)) empty.push(i);
      else if (empty.length > 0) {
        let target = empty.shift();
        board[target].className = board[i].className;
        board[i].className = "cell";
        empty.push(i);
      }
    }
    empty.forEach(i => setCell(board[i], randomColor()));
  }
}

// --------------------
// Игровой цикл
function gameLoop() {
  if (checkMatches()) {
    setTimeout(() => {
      drop();
      setTimeout(() => gameLoop(), 250);
    }, 250);
  }
}

// --------------------
createBoard();