import React, { useCallback, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { PlayField } from './components/PlayField';
import { clone, toLower } from 'ramda';

type Cell = {
  isEmpty: boolean;
  color: string;
};
type Field = Cell[][];
type Tetromino = {
  color: string;
  state: number[][];
};
type TetrominoPosition = {
  x: number;
  y: number;
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

const tetrominoes = [I, J, L, O, S, T, Z];

const printTetrominoOverField = (tetromino: Tetromino, field: Field, position: TetrominoPosition): Field => {
  const { x: xPos, y: yPos } = position;
  const newField = clone(field);

  for (let y = yPos; y <= yPos + tetromino.state.length - 1; y++) {
    for (let x = xPos; x <= xPos + tetromino.state[0].length - 1; x++) {
      const tetrominoX = x - xPos;
      const tetrominoY = y - yPos;
      const isCoordValid = tetrominoX >= 0 && tetrominoY >= 0;

      if (isCoordValid && tetromino.state[tetrominoY][tetrominoX] === 1) {
        newField[y][x] = {
          isEmpty: false,
          color: tetromino.color,
        };
      }
    }
  }

  return newField;
};

const App: React.FC = () => {
  const [field] = useState(emptyField);
  const [fieldToPrint, setFieldToPrint] = useState(field);
  const [tetrominoPosition, setTetrominoPosition] = useState({ y: 0, x: 0 });
  const [currentTetrominoIndex, setCurrentTetrominoIndex] = useState(0);
  const [currentTetromino, setCurrentTetromino] = useState(tetrominoes[currentTetrominoIndex]);

  const updateField = () => setFieldToPrint(printTetrominoOverField(currentTetromino, field, tetrominoPosition));
  const moveRight = () =>
    setTetrominoPosition((pos) => ({
      x: pos.x + currentTetromino.state[0].length < field[pos.y].length ? pos.x + 1 : pos.x,
      y: pos.y,
    }));
  const moveLeft = () => setTetrominoPosition((pos) => ({ x: pos.x > 0 ? pos.x - 1 : pos.x, y: pos.y }));
  const moveDown = () =>
    setTetrominoPosition((pos) => ({
      x: pos.x,
      y: pos.y + currentTetromino.state.length < field.length ? pos.y + 1 : pos.y,
    }));
  const moveUp = () => setTetrominoPosition((pos) => ({ x: pos.x, y: pos.y > 0 ? pos.y - 1 : pos.y }));

  const nextTetromino = () => setCurrentTetrominoIndex((index) => (index < tetrominoes.length - 1 ? index + 1 : index));
  const prevTetromino = () => setCurrentTetrominoIndex((index) => (index > 0 ? index - 1 : index));

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (toLower(event.key)) {
      case 'a':
      case 'arrowleft':
        moveLeft();
        break;
      case 'd':
      case 'arrowright':
        moveRight();
        break;
      case 'w':
      case 'arrowup':
        moveUp();
        break;
      case 's':
      case 'arrowdown':
        moveDown();
        break;

      default:
        return;
    }
  }, []);

  useEffect(() => updateField(), [tetrominoPosition, currentTetromino]);

  useEffect(() => setCurrentTetromino(tetrominoes[currentTetrominoIndex]), [currentTetrominoIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="App">
      <div>
        <h1 className="app-title">
          <img src={reactLogo} className="logo react" alt="React logo" />
          Tetris
        </h1>
      </div>
      <div className="app-main">
        <PlayField data={fieldToPrint} />
        <div>
          <p>Debug Controls:</p>
          <button onClick={updateField}>R</button>
          <button onClick={moveRight}>{'>'}</button>
          <button onClick={moveLeft}>{'<'}</button>
          <button onClick={moveUp}>{'^'}</button>
          <button onClick={moveDown}>{'v'}</button>
          <button onClick={prevTetromino}>{'Prev.'}</button>
          <button onClick={nextTetromino}>{'Next.'}</button>
        </div>
      </div>
    </div>
  );
};

export default App;
