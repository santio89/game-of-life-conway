export default function Cell({ index, active, toggleActive, cellFillMove }) {

  return (
    <div aria-label={`${active ? "Cell: alive" : "Cell: dead"}`} className={`game-grid__cell ${active && "game-grid__cell--active"}`} onMouseDown={() => toggleActive(index)} onMouseEnter={() => cellFillMove(index)}  >
      &nbsp;
    </div>
  )
}
