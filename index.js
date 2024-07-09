// DOM objects start
const canvas = document.getElementById('canvas');
const randomBtn = document.getElementById('random-btn');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn')
const canvasHeightInput = document.getElementById('field-height')
const canvasWidthInput = document.getElementById('field-width')
const cellSizeInput = document.getElementById('cell-size')
const renderSpeedInput = document.getElementById('render-speed')
const settingsForm = document.getElementById('settings-form')

// DOM objects end
let cellSize = cellSizeInput.value;
let renderSpeed = renderSpeedInput.value
canvas.width = canvasWidthInput.value;
canvas.height = canvasHeightInput.value;
const ctx = canvas.getContext('2d');
let grid, cols, rows, gameRunning;

const startGame = () => {
  startBtn.value = 'on'
  startBtn.innerHTML = 'stop'
  if (!gameRunning) {
    gameRunning = setInterval(render, renderSpeed)
  }
}

const pauseGame = () => {
  startBtn.value = 'off'
  startBtn.innerHTML = 'start'
  clearInterval(gameRunning)
  gameRunning = null;
}

const toggleGame = () => {
  if (startBtn.value === 'off') {
    setup()
    startGame()
  } else {
    pauseGame()
  }
}

const randomize = () => {
  if (startBtn.value === 'on') {
    pauseGame()
  }
  grid = fillWithRandom(make2DArray(cols, rows))
  render()
}

const onSubmit = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const { elements } = settingsForm

  if (startBtn.value === 'on') {
    pauseGame()
  }

  const data = Array.from(elements).filter(({ name }) => !!name).map(({ name, value }) => ({ name, value }))
  
  canvas.height = data.find(({ name }) => name === "field-height").value
  canvas.width = data.find(({ name }) => name === "field-width").value
  cellSize = data.find(({ name }) => name === "cell-size").value;
  renderSpeed = data.find(({ name }) => name === "render-speed").value;

  setup()
}

settingsForm.addEventListener('submit', onSubmit)
startBtn.addEventListener('click', toggleGame)
randomBtn.addEventListener('click', randomize)

function make2DArray(cols, rows) {
  let arr = new Array(cols);

  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}

function fillWithRandom(grid) {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = Math.floor(Math.random() * 2)
    }
  }

  return grid;
}

function setup() {
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  grid = fillWithRandom(make2DArray(cols, rows))
}

function render() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        const x = i * cellSize;
        const y = j * cellSize;

        ctx.fillStyle = "white";
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }

  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const current = grid[i][j];
      const neighbors = countNeighdors(grid, i, j);

      if (current === 0 && neighbors === 3) {
        next[i][j] = 1;
      } else if (current === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = current;
      }
    }
  }

  grid = next;
}

function countNeighdors(grid, x, y) {
  let sum = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const col = (x + i + cols) % cols; // это перенос индекса, если дано 10 клеток, то для 9ой: (9 + 1 + 10) % 10 = 0
      const row = (y + j + rows) % rows;

      sum += grid[col][row]
    }
  }
  sum -= grid[x][y] // вычитаем значение текущей клетки
  return sum
}

//https://github.com/MaksBmt/initi_test/blob/master/index.js

