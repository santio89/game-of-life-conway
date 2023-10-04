import { useEffect, useState } from 'react'

export default function Cell({ index, cells, setCells }) {

  const toggleActive = () => {
    const cellsCopy = [...cells]
   
    if (cellsCopy[index].active === true) cellsCopy[index].active = false
    if (cellsCopy[index].active === false) cellsCopy[index].active = true

    setCells(cellsCopy)
  }


  return (
    <div onClick={toggleActive} className={`game-grid__cell ${cells[index].active && "game-grid__cell--active"}`}>
      &nbsp;
    </div>
  )
}
