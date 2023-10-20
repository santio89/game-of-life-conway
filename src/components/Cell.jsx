export default function Cell({ index, active, toggleActive, cellFillMove, gridMode }) {

  return (
    <div className={`game-grid__cell ${active && "game-grid__cell--active"} ${gridMode && "game-grid__cell--gridMode"}`} onPointerDown={() => { toggleActive(index) }} onMouseEnter={() => cellFillMove(index)} data-index={index}>
      &nbsp;
    </div>
  )
}
