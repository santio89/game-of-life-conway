export default function Cell({ index, active, toggleActive, cellFillMove, gridMode, cellShape }) {

  return (
    <div className={`game-grid__cell ${active && "game-grid__cell--active"} ${gridMode && "game-grid__cell--gridMode"} ${cellShape}`} onPointerDown={() => { toggleActive(index) }} onMouseEnter={() => cellFillMove(index)} data-index={index}>
      &nbsp;
    </div>
  )
}
