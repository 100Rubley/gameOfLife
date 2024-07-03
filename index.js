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
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let x = i * cellSize;
        let y = j * cellSize;

        ctx.fillStyle = "white";
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }
}

setup()
render()
console.table(grid)
