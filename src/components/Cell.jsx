export default function Cell({ index, active, toggleActive }) {


  return (
    <div onClick={()=>toggleActive(index)} className={`game-grid__cell ${active && "game-grid__cell--active"}`}>
      &nbsp;
    </div>
  )
}
