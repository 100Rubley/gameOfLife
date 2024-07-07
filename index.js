// DOM objects start
const canvas = document.querySelector('.canvas');
// DOM objects end

const cellSize = 10;
canvas.width = 600;
canvas.height = 400;
const ctx = canvas.getContext('2d');
let grid, cols, rows;

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
  cols = canvas.width / cellSize;
  rows = canvas.height / cellSize;
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

setup()

setInterval(() => render(), 100)

