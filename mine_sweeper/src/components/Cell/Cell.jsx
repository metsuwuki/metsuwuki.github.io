const numberClass = (value) => (value > 0 ? `cell cell--open cell--n${value}` : 'cell cell--open');

function Cell({ cell, disabled, tapMode, onOpen, onFlag }) {
  const handleMouseDown = (event) => {
    event.preventDefault();

    if (disabled) return;

    if (event.button === 0) {
      if (tapMode === 'flag') {
        onFlag(cell.row, cell.col);
        return;
      }

      onOpen(cell.row, cell.col);
    }

    if (event.button === 2) {
      onFlag(cell.row, cell.col);
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const className = [
    cell.isOpen ? numberClass(cell.adjacentMines) : 'cell',
    cell.isFlagged ? 'cell--flagged' : '',
    cell.isMine && cell.isOpen ? 'cell--mine' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      type="button"
      aria-label={`Row ${cell.row + 1}, column ${cell.col + 1}`}
      aria-pressed={cell.isOpen}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {cell.isOpen && !cell.isMine && cell.adjacentMines > 0 ? cell.adjacentMines : null}
    </button>
  );
}

export default Cell;
