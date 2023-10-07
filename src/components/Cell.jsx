export default function Cell({ index, active, toggleActive, cellFillMove }) {

  return (
    <div className={`game-grid__cell ${active && "game-grid__cell--active"}`} onMouseDown={() => toggleActive(index)} onMouseEnter={() => cellFillMove(index)}  >
      &nbsp;
    </div>
  )
}
