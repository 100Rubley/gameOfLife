let grid, cols = 10, rows = 10;

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
  grid = fillWithRandom(make2DArray(cols, rows))
}

setup()
console.table(grid)
