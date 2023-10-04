import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import Cell from "./Cell";


export default function Home() {
    const [cells, setCells] = useState(null)
    const [cellsFilled, setCellsFilled] = useState(false)
    const [cols, setCols] = useState(10);
    const [rows, setRows] = useState(5)
    const [cellSize, setCellSize] = useState(80)
    const [genInterval, setGenInterval] = useState(null)
    const [playing, setPlaying] = useState(false)

    const calcGen = () => {
        const cellsCopy = [...cells]

        const getNeighbors = (i) => {
            const size = cols * rows;
            let neighbors = 0;
            /* neighbors can potentially be -1, +1, -cols, -cols-1, -cols+1, +cols, +cols-1, +cols-1 */

            /* first row, -cols not neighbor */
            if (i < cols) {
                /* first column, -1 not neighbor */
                if (i % cols === 0) {
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols + 1].active) neighbors++
                    /* +1, +cols, +cols+1 */
                }

                /* last column, +1 not neighbor */
                else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols - 1].active) neighbors++
                    /* -1, +cols, +cols-1 */
                }

                /* middle columns */
                else {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols + 1].active) neighbors++
                    if (cellsCopy[i + cols - 1].active) neighbors++
                    /* -1, +1, +cols, +cols+1, +cols-1 */
                }
            }

            /* middle rows */
            if (i >= cols && i < (size - cols)) {
                /* first column, -1 not neighbor */
                if (i % cols === 0) {
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols + 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols + 1].active) neighbors++
                    /* +1, +cols, +cols+1, -cols, -cols+1 */
                }

                /* last column, +1 not neighbor */
                else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols - 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, +cols, +cols-1, -cols, -cols-1 */
                }

                /* middle columns */
                else {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols + 1].active) neighbors++
                    if (cellsCopy[i + cols - 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols + 1].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, +1, +cols, +cols+1, +cols-1, -cols, -cols+1, -cols-1 */
                }
            }

            /* last row, +cols not neighbor */
            if (i >= (size - cols)) {
                /* first column, -1 not neighbor */
                if (i % cols === 0) {
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols + 1].active) neighbors++
                    /* +1, -cols, -cols+1 */
                }

                /* last column, +1 not neighbor */
                else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, -cols, -cols-1 */
                }

                /* middle columns */
                else {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols + 1].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, +1, -cols, -cols+1, -cols-1 */
                }
            }

            /* console.log(i + JSON.stringify(cellsCopy[i]) + " neighbors " + neighbors) */

            return neighbors
        }

        const newCells = cellsCopy.map((cell, i) => {
            const neighbors = getNeighbors(i)
            /* const rand = Math.floor(Math.random() * (2) + 1)
            if (rand === 1) {
                cell.active = true
            } else {
                cell.active = false
            } */

            if (cell.active) {
                if (neighbors < 2) cell.active = false //underpopulation 
                if (neighbors === 2 || neighbors === 3) cell.active = true //survives 
                if (neighbors > 3) cell.active = false //overpopulation
            } else {
                if (neighbors === 3) cell.active = true //reproduction
            }


            return cell
        })

        setCells(newCells)
    }

    const initGame = () => {
        setGenInterval(setInterval(calcGen, 1000))
        setPlaying(true)
    }

    const stopGame = () => {
        clearInterval(genInterval)
        setPlaying(false)
    }

    useEffect(() => {
        const fillArray = () => {
            const array = []

            for (let i = 1; i <= cols; i++) {
                for (let j = 1; j <= rows; j++) {
                    array.push({
                        id: uuidv4(),
                        active: false,
                        /* row: j,
                        col: i, */
                    })
                }
            }
            setCells(array)
            setCellsFilled(true)
        }

        fillArray()
    }, [])

    return (
        <div className="home">
            <div className="home__buttons">
                <button className={`${playing && "active"}`} onClick={() => initGame()}>PLAY</button>
                <button className={`${!playing && "active"}`} onClick={() => stopGame()}>PAUSE</button>
            </div>
            <div className="game-grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gridAutoRows: `${cellSize}px` }}>
                {cellsFilled && cells?.map((cell, index) => {
                    return <Cell key={cell.id} index={index} cells={cells} setCells={setCells} />
                })}
            </div>
        </div>
    )
}
