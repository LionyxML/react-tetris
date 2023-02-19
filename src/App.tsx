import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { PlayField } from './components/PlayField';

type Cell = {
  isEmpty: boolean;
  color: string;
};
type Field = Cell[][];
type Tetromino = {
  color: string;
  state: number[][];
};

const emptyCell: Cell = { isEmpty: true, color: 'inherit' };
const emptyField: Field = Array.from(Array(20), () => new Array(10).fill(emptyCell));

const I: Tetromino = { color: 'lightblue', state: [[1, 1, 1, 1]] };
const J: Tetromino = {
  color: 'blue',
  state: [
    [1, 0, 0],
    [1, 1, 1],
  ],
};
const L: Tetromino = {
  color: 'orange',
  state: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};
const O: Tetromino = {
  color: 'yellow',
  state: [
    [1, 1],
    [1, 1],
  ],
};
const S: Tetromino = {
  color: 'lightgreen',
  state: [
    [0, 1, 1],
    [1, 1, 0],
  ],
};
const T: Tetromino = {
  color: 'purple',
  state: [
    [0, 1, 0],
    [1, 1, 1],
  ],
};
const Z: Tetromino = {
  color: 'red',
  state: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

const tetrominoes = { I, J, L, O, S, T, Z };

const printTetrominoOverField = (tetromino: Tetromino, field: Field): Field => {
  const xPos = 1;
  const yPos = 5;

  // TODO: CONTINUE FROM HERE

  return field.map((_y, y) =>
    _y.map((_x, x) => {
      if (x === xPos && y === yPos && tetromino.state[y - yPos][x - xPos] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 1 && y === yPos && tetromino.state[y - yPos][x - xPos - 1] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 2 && y === yPos && tetromino.state[y - yPos][x - xPos - 2] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 3 && y === yPos && tetromino.state[y - yPos][x - xPos - 3] === 1) {
        return { isEmpty: false, color: 'red' };
      }

      if (x === xPos && y === yPos + 1 && tetromino.state[y - yPos - 1][x - xPos] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 1 && y === yPos + 1 && tetromino.state[y - yPos - 1][x - xPos - 1] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 2 && y === yPos + 1 && tetromino.state[y - yPos - 1][x - xPos - 2] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 3 && y === yPos + 1 && tetromino.state[y - yPos - 1][x - xPos - 3] === 1) {
        return { isEmpty: false, color: 'red' };
      }

      if (x === xPos && y === yPos + 2 && tetromino.state[y - yPos - 2][x - xPos] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 1 && y === yPos + 2 && tetromino.state[y - yPos - 2][x - xPos - 1] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 2 && y === yPos + 2 && tetromino.state[y - yPos - 2][x - xPos - 2] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 3 && y === yPos + 2 && tetromino.state[y - yPos - 2][x - xPos - 3] === 1) {
        return { isEmpty: false, color: 'red' };
      }

      if (x === xPos && y === yPos + 3 && tetromino.state[y - yPos - 3][x - xPos] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 1 && y === yPos + 3 && tetromino.state[y - yPos - 3][x - xPos - 1] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 2 && y === yPos + 3 && tetromino.state[y - yPos - 3][x - xPos - 2] === 1) {
        return { isEmpty: false, color: 'red' };
      }
      if (x === xPos + 3 && y === yPos + 3 && tetromino.state[y - yPos - 3][x - xPos - 3] === 1) {
        return { isEmpty: false, color: 'red' };
      }

      return { isEmpty: true, color: 'inherit' };

      // return xPos === x && yPos === y ? { isEmpty: false, color: 'red' } : { isEmpty: true, color: 'inherit' };
    }),
  );
};

const App: React.FC = () => {
  const [field, setField] = useState(emptyField);

  const currentTetromino = tetrominoes.I;

  const handleClick = () => setField(printTetrominoOverField(currentTetromino, field));

  return (
    <div className="App">
      <div>
        <h1 className="app-title">
          <img src={reactLogo} className="logo react" alt="React logo" />
          Tetris
        </h1>
        <button onClick={handleClick}>+</button>
      </div>
      <PlayField data={field} />
    </div>
  );
};

export default App;
