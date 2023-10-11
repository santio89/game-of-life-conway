export default function Cell({ index, active, toggleActive, cellFillMove, universeSample }) {

  return (
    <div aria-label={`${active ? "Cell: alive" : "Cell: dead"}`} className={`game-grid__cell ${active && "game-grid__cell--active"} ${universeSample && "universeSample"}`} onPointerDown={() => toggleActive(index)} onMouseEnter={() => cellFillMove(index)}  >
      &nbsp;
    </div>
  )
}
