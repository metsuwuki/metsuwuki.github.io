import { BOARD_SIZE } from '../constants.js';

const createCell = (row, col) => ({
  id: `${row}-${col}`,
  row,
  col,
  isMine: false,
  isOpen: false,
  isFlagged: false,
  adjacentMines: 0,
});

export const createEmptyBoard = (size = BOARD_SIZE) =>
  Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => createCell(row, col)),
  );

export const getNeighbors = (board, row, col) => {
  const neighbors = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue;

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;

      if (board[nextRow]?.[nextCol]) {
        neighbors.push(board[nextRow][nextCol]);
      }
    }
  }

  return neighbors;
};

export const createBoard = ({ size = BOARD_SIZE, mines, safeCell }) => {
  const board = createEmptyBoard(size);
  const blocked = new Set();

  if (safeCell) {
    blocked.add(`${safeCell.row}-${safeCell.col}`);
    getNeighbors(board, safeCell.row, safeCell.col).forEach((cell) => blocked.add(cell.id));
  }

  let plantedMines = 0;
  while (plantedMines < mines) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    const cell = board[row][col];

    if (cell.isMine || blocked.has(cell.id)) continue;

    cell.isMine = true;
    plantedMines += 1;
  }

  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      adjacentMines: cell.isMine
        ? 0
        : getNeighbors(board, cell.row, cell.col).filter((neighbor) => neighbor.isMine).length,
    })),
  );
};

const cloneBoard = (board) => board.map((row) => row.map((cell) => ({ ...cell })));

const floodOpenSafeCells = (board, startCell) => {
  const queue = [startCell];

  while (queue.length > 0) {
    const cell = queue.shift();

    if (cell.isOpen || cell.isFlagged || cell.isMine) continue;

    cell.isOpen = true;

    if (cell.adjacentMines !== 0) continue;

    getNeighbors(board, cell.row, cell.col).forEach((neighbor) => {
      if (!neighbor.isOpen && !neighbor.isFlagged && !neighbor.isMine) {
        queue.push(neighbor);
      }
    });
  }
};

export const toggleFlag = (board, row, col) => {
  const nextBoard = cloneBoard(board);
  const cell = nextBoard[row][col];

  if (cell.isOpen) return nextBoard;

  cell.isFlagged = !cell.isFlagged;
  return nextBoard;
};

export const openCell = (board, row, col) => {
  const nextBoard = cloneBoard(board);
  const startCell = nextBoard[row][col];

  if (startCell.isFlagged) {
    return { board: nextBoard, hitMine: false };
  }

  if (startCell.isOpen) {
    if (startCell.adjacentMines === 0) {
      return { board: nextBoard, hitMine: false };
    }

    const neighbors = getNeighbors(nextBoard, row, col);
    const markedMineCount = neighbors.filter((cell) => cell.isFlagged || (cell.isMine && cell.isOpen)).length;
    const untouchedNeighbors = neighbors.filter((cell) => !cell.isOpen && !cell.isFlagged);
    const missingMineCount = startCell.adjacentMines - markedMineCount;

    if (missingMineCount > 0 && untouchedNeighbors.length === missingMineCount) {
      untouchedNeighbors.forEach((cell) => {
        cell.isFlagged = true;
      });

      return { board: nextBoard, hitMine: false };
    }

    if (markedMineCount !== startCell.adjacentMines) {
      return { board: nextBoard, hitMine: false };
    }

    const cellsToOpen = untouchedNeighbors;

    if (cellsToOpen.some((cell) => cell.isMine)) {
      return { board: revealMines(nextBoard), hitMine: true };
    }

    cellsToOpen.forEach((cell) => floodOpenSafeCells(nextBoard, cell));
    return { board: nextBoard, hitMine: false };
  }

  if (startCell.isMine) {
    return { board: revealMines(nextBoard), hitMine: true };
  }

  floodOpenSafeCells(nextBoard, startCell);

  return { board: nextBoard, hitMine: false };
};

export const revealMines = (board) =>
  board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isOpen: cell.isOpen || cell.isMine,
    })),
  );

export const hasWon = (board) =>
  board.every((row) => row.every((cell) => cell.isMine || cell.isOpen));

export const countFlags = (board) =>
  board.reduce((total, row) => total + row.filter((cell) => cell.isFlagged).length, 0);
