import React, { useCallback, useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { PlayField } from './components/PlayField';
import { clone, reverse, toLower, transpose } from 'ramda';

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
type GameState = 'STOP' | 'PLAY' | 'PAUSE';

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

// TODO: implement the actual algorithm here
const getNextTetromino = (): number => Math.floor(Math.random() * 7);

const rotateTetrominoState = (tetromino: Tetromino) => ({ ...tetromino, state: transpose(reverse(tetromino.state)) });

const getStartingPosition = (tetromino: Tetromino, field: Field) => ({
  y: 0,
  x: Math.floor((field[0].length - tetromino.state[0].length) / 2),
});

const App: React.FC = () => {
  const [field] = useState(emptyField);
  const [fieldToPrint, setFieldToPrint] = useState(field);
  const [currentTetrominoIndex, setCurrentTetrominoIndex] = useState(getNextTetromino);
  const [currentTetromino, setCurrentTetromino] = useState(tetrominoes[currentTetrominoIndex]);
  const [tetrominoPosition, setTetrominoPosition] = useState(getStartingPosition(currentTetromino, field));
  const [move, setMove] = useState(0);
  const [gameState, setGameState] = useState<GameState>('STOP');
  const [speed, setSpeed] = useState(1000);

  const setPlay = () => setGameState('PLAY');
  const setStop = () => setGameState('STOP');
  const setPause = () => setGameState('PAUSE');

  const increaseSpeed = () => setSpeed((currentSpeed) => (currentSpeed += 1000));
  const decreaseSpeed = () => setSpeed((currentSpeed) => (currentSpeed -= 1000));

  const tetrominoPositionRef = useRef({ y: 0, x: 0 });
  tetrominoPositionRef.current = { ...tetrominoPosition };

  const resetField = () => {
    setTetrominoPosition(getStartingPosition(tetrominoes[getNextTetromino()], emptyField));
  };

  const updateField = () => setFieldToPrint(printTetrominoOverField(currentTetromino, field, tetrominoPosition));

  const moveRight = () =>
    setTetrominoPosition((pos) => ({
      x: pos.x + currentTetromino.state[0].length <= field[0].length - 1 ? pos.x + 1 : pos.x,
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

  const rotateTetromino = () => {
    const { x, y } = tetrominoPositionRef.current;
    const isRotateAllowed =
      x + currentTetromino.state.length <= field[0].length && y + currentTetromino.state[0].length <= field.length;

    if (isRotateAllowed) {
      setCurrentTetromino((tetromino) => rotateTetrominoState(tetromino));
    }
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
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
          moveUp();
          break;
        case 's':
        case 'arrowdown':
          moveDown();
          break;
        case 'arrowup':
          rotateTetromino();
          break;
        case 'p':
          prevTetromino();
          break;
        case 'n':
          nextTetromino();
          break;

        default:
          return;
      }
    },
    [currentTetromino],
  );

  useEffect(() => updateField(), [tetrominoPosition, currentTetromino, handleKeyPress]);

  useEffect(() => setCurrentTetromino(tetrominoes[currentTetrominoIndex]), [currentTetrominoIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const ticker = setInterval(() => {
      if (gameState === 'PLAY') {
        setMove((move) => move + 1);
        moveDown();
      }
    }, 1000000 / speed);

    if (gameState === 'STOP') {
      setMove(0);
      resetField();
      console.log('game stopped');
    }

    if (gameState === 'PAUSE') {
      //
    }

    return () => {
      clearInterval(ticker);
    };
  }, [gameState, speed]);

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
        <div className="app-debug-area">
          <p>Debug Controls:</p>
          <div>
            <button onClick={updateField}>R</button>
            <button onClick={moveRight}>{'>'}</button>
            <button onClick={moveLeft}>{'<'}</button>
            <button onClick={moveUp}>{'^'}</button>
            <button onClick={moveDown}>{'v'}</button>
            <button onClick={prevTetromino}>{'Prev.'}</button>
            <button onClick={nextTetromino}>{'Next.'}</button>
            <button onClick={rotateTetromino}>{'Rot'}</button>
          </div>
          <div>Move: {move}</div>
          <div>State: {gameState} </div>
          <div>
            <button onClick={setPlay}>Play</button>
            <button onClick={setStop}>Stop</button>
            <button onClick={setPause}>Pause</button>
          </div>

          <div>Speed: {speed} </div>
          <div>
            <button onClick={increaseSpeed}>+ Speed</button>
            <button onClick={decreaseSpeed}>- Speed</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
