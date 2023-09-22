import { useState, useRef, useCallback } from "react";
import useInterval from "./hooks/useInterval";

const numRows = 25;
const numCols = 35;

const operations = [
  [0, 1], // right
  [0, -1], // left
  [1, -1], // top left
  [-1, 1], // top right
  [1, 1], // top
  [-1, -1], // bottom
  [1, 0], // bottom right
  [-1, 0], // bottom left
];

const createEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const randomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return randomGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;

        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
  }, []);

  useInterval(() => {
    runSimulation(grid);
  }, 150);

  return (
    <div>
      <h1>Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                // clone the grid
                let newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#ff6600" : undefined,
                border: "1px solid #000",
              }}
            ></div>
          ))
        )}
      </div>

      <div className="buttons flex">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
            }
          }}
        >
          <span>{running ? "Pause" : "Play"}</span>
        </button>

        <button
          onClick={() => {
            setGrid(randomGrid());
          }}
        >
          <span>Seed</span>
        </button>

        <button
          onClick={() => {
            setGrid(createEmptyGrid());
          }}
        >
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default App;