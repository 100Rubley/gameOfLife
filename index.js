// DOM objects start
const canvas = document.getElementById('canvas');
const randomBtn = document.getElementById('random-btn');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn')
const clearBtn = document.getElementById('clear-btn')
const canvasHeightInput = document.getElementById('field-height')
const canvasWidthInput = document.getElementById('field-width')
const cellSizeInput = document.getElementById('cell-size')
const renderSpeedInput = document.getElementById('render-speed')
const settingsForm = document.getElementById('settings-form')
// DOM objects end

//variables start
const DARK_COLOR = "rgb(51, 51, 51)"
const LIGHT_COLOR = "rgb(0, 204, 0)"

const ON = "on"
const OFF = "off"

const START = "start"
const STOP = "stop"

let cellSize = cellSizeInput.value;
let renderSpeed = renderSpeedInput.value

const ctx = canvas.getContext('2d');
let grid, cols, rows, gameRunning;
//variables end

canvas.width = canvasWidthInput.value;
canvas.height = canvasHeightInput.value;

const startGame = () => {
  startBtn.value = ON
  startBtn.innerHTML = STOP
  if (!gameRunning) {
    gameRunning = setInterval(render, renderSpeed)
  }
}

const pauseGame = () => {
  startBtn.value = OFF
  startBtn.innerHTML = START
  clearInterval(gameRunning)
  gameRunning = null;
}

const flipCell = (e) => {
  const { x, y } = canvas.getBoundingClientRect()
  const mouseX = e.clientX - x;
  const mouseY = e.clientY - y;

  const i = Math.floor(mouseX / cellSize)
  const j = Math.floor(mouseY / cellSize)

  grid[i][j] ? grid[i][j] = 0 : grid[i][j] = 1

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * cellSize;
      const y = j * cellSize;

      if (grid[i][j] === 1) {
        ctx.fillStyle = LIGHT_COLOR;
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      } else {
        ctx.fillStyle = DARK_COLOR;
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);

  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
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
  grid = make2DArray(cols, rows)
}

function render() {
  ctx.fillStyle = DARK_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        const x = i * cellSize;
        const y = j * cellSize;

        ctx.fillStyle = LIGHT_COLOR;
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

setup()

// event handlers start
const onCanvasClick = (e) => {
  pauseGame()
  flipCell(e)
}

const onSubmit = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const { elements } = settingsForm

  if (startBtn.value === ON) {
    pauseGame()
  }

  const data = Array.from(elements).filter(({ name }) => !!name).map(({ name, value }) => ({ name, value }))

  canvas.height = data.find(({ name }) => name === "field-height").value
  canvas.width = data.find(({ name }) => name === "field-width").value
  cellSize = data.find(({ name }) => name === "cell-size").value;
  renderSpeed = data.find(({ name }) => name === "render-speed").value;

  setup()
}

const toggleGame = () => {
  if (startBtn.value === OFF) {
    startGame()
  } else {
    pauseGame()
  }
}

const randomize = () => {
  if (startBtn.value === ON) {
    pauseGame()
  }
  grid = fillWithRandom(make2DArray(cols, rows))
  render()
}

const onClear = () => {
  grid = make2DArray(cols, rows)
  ctx.fillStyle = DARK_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// event handlers end

// eventListeners start
canvas.addEventListener('click', onCanvasClick)
settingsForm.addEventListener('submit', onSubmit)
startBtn.addEventListener('click', toggleGame)
randomBtn.addEventListener('click', randomize)
clearBtn.addEventListener('click', onClear)
// eventListeners end
