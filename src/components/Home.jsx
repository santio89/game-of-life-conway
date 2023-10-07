import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setThemeReducer, setColorsReducer } from "../store/actions/theme.action";
import { v4 as uuidv4 } from 'uuid';
import Cell from "./Cell";


export default function Home({ rootTheme }) {
    const dispatch = useDispatch()
    const darkTheme = useSelector(state => state.theme.darkTheme)
    const autoColors = useSelector(state => state.theme.autoColors)
    const [cells, setCells] = useState(null)
    const [cellsFilled, setCellsFilled] = useState(false)
    const [cellSize, setCellSize] = useState(60)
    const [cols, setCols] = useState(Math.floor((window.innerWidth) / cellSize))
    const [rows, setRows] = useState(Math.floor((window.innerHeight - 60) / cellSize))
    const [playing, setPlaying] = useState(false)

    const toggleDarkTheme = () => {
        darkTheme ? dispatch(setThemeReducer(false)) : dispatch(setThemeReducer(true))
    }

    const toggleAutoColors = () => {
        autoColors ? dispatch(setColorsReducer(false)) : dispatch(setColorsReducer(true))
    }

    const toggleActive = (index) => {
        const cellsCopy = [...cells]

        const modCell = () => {
            if (cellsCopy[index].active === true) return { ...cellsCopy[index], active: false }
            if (cellsCopy[index].active === false) return { ...cellsCopy[index], active: true }
        }

        cellsCopy[index] = modCell()

        setCells(cellsCopy)
    }

    const updateCellColor = () => {
        const genRandom = () => Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const cellColor = "rgb(" + genRandom() + ", " + genRandom() + ", " + genRandom() + ")"
        document.documentElement.style.setProperty('--main-color', cellColor);
    }

    const calcRandomGen = () => {
        let array = []

        for (let i = 1; i <= cols; i++) {
            for (let j = 1; j <= rows; j++) {
                const isActive = Math.round(Math.random());

                array.push({
                    id: uuidv4(),
                    active: isActive === 1 ? true : false,
                    row: j,
                    col: i
                })
            }
        }
        setCells(array)
    }

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
                } else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols - 1].active) neighbors++
                    /* -1, +cols, +cols-1 */
                } else {
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
                } else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + cols].active) neighbors++
                    if (cellsCopy[i + cols - 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, +cols, +cols-1, -cols, -cols-1 */
                } else {
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
                } else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, -cols, -cols-1 */
                } else {
                    if (cellsCopy[i - 1].active) neighbors++
                    if (cellsCopy[i + 1].active) neighbors++
                    if (cellsCopy[i - cols].active) neighbors++
                    if (cellsCopy[i - cols + 1].active) neighbors++
                    if (cellsCopy[i - cols - 1].active) neighbors++
                    /* -1, +1, -cols, -cols+1, -cols-1 */
                }
            }


            return neighbors
        }

        const newCells = cellsCopy.map((cell, i) => {
            const neighbors = getNeighbors(i)

            if (cell.active) {
                if (neighbors < 2) return { ...cell, active: false } //underpopulation 
                if (neighbors === 2 || neighbors === 3) return { ...cell, active: true } //survives 
                if (neighbors > 3) return { ...cell, active: false } //overpopulation
            } else {
                if (neighbors === 3) return { ...cell, active: true } //reproduction
                else return { ...cell, active: false } //inactivity
            }

            return { ...cell } //default
        })

        autoColors && updateCellColor()
        setCells(newCells)
    }

    const initGame = () => {
        setPlaying(true)
    }

    const stopGame = () => {
        setPlaying(false)
    }

    useEffect(() => {
        rootTheme.current.classList.toggle("light-theme", !darkTheme)
    }, [darkTheme])

    useEffect(() => {
        /* using timeout instead of interval so it iterates over the updated state */
        let timeout = null;
        if (playing) {
            timeout = setTimeout(calcGen, 1500)
        } else {
            clearTimeout(timeout)
        }

        return () => clearTimeout(timeout)
    }, [playing, cells])

    useEffect(() => {
        const fillArray = () => {
            let array = []

            for (let i = 1; i <= cols; i++) {
                for (let j = 1; j <= rows; j++) {
                    array.push({
                        id: uuidv4(),
                        active: false,
                        row: j,
                        col: i
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
                <div className="home__buttons__box">
                    <button title="Play" className={`${playing && "active"}`} onClick={() => initGame()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                    </button>
                    <button title="Pause" className={`${!playing && "active"}`} onClick={() => stopGame()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                        </svg>
                    </button>
                </div>
                <div className="home__buttons__box">
                    <button title="Auto Colors" className={`${autoColors && "active"}`} onClick={() => toggleAutoColors()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-rainbow" viewBox="0 0 16 16">
                            <path d="M8 4.5a7 7 0 0 0-7 7 .5.5 0 0 1-1 0 8 8 0 1 1 16 0 .5.5 0 0 1-1 0 7 7 0 0 0-7-7zm0 2a5 5 0 0 0-5 5 .5.5 0 0 1-1 0 6 6 0 1 1 12 0 .5.5 0 0 1-1 0 5 5 0 0 0-5-5zm0 2a3 3 0 0 0-3 3 .5.5 0 0 1-1 0 4 4 0 1 1 8 0 .5.5 0 0 1-1 0 3 3 0 0 0-3-3zm0 2a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 4 0 .5.5 0 0 1-1 0 1 1 0 0 0-1-1z" />
                        </svg>
                    </button>
                    <button title="Light Theme" className={`${!darkTheme && "active"}`} onClick={() => toggleDarkTheme()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                        </svg>
                    </button>
                    <button title="Randomize" onClick={() => calcRandomGen()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="game-grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gridAutoRows: `${cellSize}px` }}>
                {cellsFilled && cells?.map((cell, index) => {
                    return <Cell key={cell.id} index={index} toggleActive={toggleActive} active={cell.active} />
                })}
            </div>
        </div>
    )
}
