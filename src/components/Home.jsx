import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setThemeReducer } from "../store/actions/theme.action";
import { setModal } from "../store/actions/modal.action";
import { setCells } from "../store/actions/game.action";
import { v4 as uuidv4 } from 'uuid';
import Cell from "./Cell";
import { Link } from "react-router-dom";


export default function Home({ rootTheme }) {
    const dispatch = useDispatch()
    const darkTheme = useSelector(state => state.theme.darkTheme)
    const modalActive = useSelector(state => state.modal.active)
    const [cellsFilled, setCellsFilled] = useState(false)
    const cells = useSelector(state => state.game.present.cells)
    const [sizeRange, setSizeRange] = useState(60)
    const [speedRange, setSpeedRange] = useState(1000)
    const [boundRange, setBoundRange] = useState(100)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth * (boundRange / 100))
    const [windowHeight, setWindowHeight] = useState(window.innerHeight * (boundRange / 100))
    const [cols, setCols] = useState(Math.floor((window.innerWidth * (boundRange / 100) - 4) / sizeRange))
    const [rows, setRows] = useState(Math.floor((window.innerHeight * (boundRange / 100) - 48 - 4) / sizeRange))
    const [playing, setPlaying] = useState(false)
    const [wasPlaying, setWasPlaying] = useState(false)
    const [cellFillMode, setCellFillMode] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)

    const toggleDarkTheme = () => {
        darkTheme ? dispatch(setThemeReducer(false)) : dispatch(setThemeReducer(true))
    }

    const toggleModal = () => {
        modalActive ? dispatch(setModal(false)) : dispatch(setModal(true))
    }

    const startGame = () => {
        setPlaying(true)
    }

    const stopGame = () => {
        setPlaying(false)
    }

    const resetSettings = () => {
        setSpeedRange(1000)
        setSizeRange(60)
        setBoundRange(100)
    }

    const toggleActive = (index) => {
        const cellsCopy = [...cells]

        const modCell = () => {
            if (cellsCopy[index].active === true) return { ...cellsCopy[index], active: false }
            if (cellsCopy[index].active === false) return { ...cellsCopy[index], active: true }
        }

        cellsCopy[index] = modCell()

        dispatch(setCells(cellsCopy))
    }

    const cellFillStart = () => {
        playing ? setWasPlaying(true) : setWasPlaying(false)
        stopGame()
        setCellFillMode(true)
    }
    const cellFillEnd = () => {
        wasPlaying && startGame()
        setCellFillMode(false)
    }
    const cellFillMove = (index) => {
        if (cellFillMode) {
            toggleActive(index)
        }
    }

    const updateCellColor = () => {
        const genRandom = () => Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const cellColor = "rgb(" + genRandom() + ", " + genRandom() + ", " + genRandom() + ")"
        document.documentElement.style.setProperty('--main-color', cellColor);
    }

    const fillArray = () => {
        let array = []

        for (let i = 1; i <= cols; i++) {
            for (let j = 1; j <= rows; j++) {
                array.push({
                    id: uuidv4(),
                    active: false,
                })
            }
        }
        dispatch(setCells(array))
        dispatch({ type: "GAME_CLEAR_HISTORY" })
        setCellsFilled(true)
    }

    const reFillArray = () => {
        const size = cols * rows
        let array = [...cells]

        /* hacky method for dynamic resize */
        for (let i = 1; i <= size; i++) {
            array.push({
                id: uuidv4(),
                active: false,
            })
        }

        if (array.length > size) {
            const diff = array.length - size;
            array.splice(array.length - diff,
                diff);
        }

        dispatch(setCells(array))
        setCellsFilled(true)
    }

    const calcRandomGen = () => {
        let array = []

        for (let i = 1; i <= cols; i++) {
            for (let j = 1; j <= rows; j++) {
                const isActive = Math.round(Math.random() * 2);

                array.push({
                    id: uuidv4(),
                    active: isActive === 0 ? true : false,
                })
            }
        }
        dispatch(setCells(array))
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
                    if (cellsCopy[i + 1]?.active) neighbors++
                    if (cellsCopy[i + cols]?.active) neighbors++
                    if (cellsCopy[i + cols + 1]?.active) neighbors++
                    /* +1, +cols, +cols+1 */

                    /* last column, +1 not neighbor */
                } else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1]?.active) neighbors++
                    if (cellsCopy[i + cols]?.active) neighbors++
                    if (cellsCopy[i + cols - 1]?.active) neighbors++
                    /* -1, +cols, +cols-1 */
                } else {
                    if (cellsCopy[i - 1]?.active) neighbors++

                    if (cellsCopy[i + 1]?.active) neighbors++

                    if (cellsCopy[i + cols]?.active) neighbors++

                    if (cellsCopy[i + cols + 1]?.active) neighbors++
                    if (cellsCopy[i + cols - 1]?.active) neighbors++
                    /* -1, +1, +cols, +cols+1, +cols-1 */
                }
            }

            /* middle rows */
            if (i >= cols && i < (size - cols)) {
                /* first column, -1 not neighbor */
                if (i % cols === 0) {
                    if (cellsCopy[i + 1]?.active) neighbors++
                    if (cellsCopy[i + cols]?.active) neighbors++
                    if (cellsCopy[i + cols + 1]?.active) neighbors++
                    if (cellsCopy[i - cols]?.active) neighbors++
                    if (cellsCopy[i - cols + 1]?.active) neighbors++
                    /* +1, +cols, +cols+1, -cols, -cols+1 */

                    /* last column, +1 not neighbor */
                } else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1]?.active) neighbors++
                    if (cellsCopy[i + cols]?.active) neighbors++
                    if (cellsCopy[i + cols - 1]?.active) neighbors++
                    if (cellsCopy[i - cols]?.active) neighbors++
                    if (cellsCopy[i - cols - 1]?.active) neighbors++
                    /* -1, +cols, +cols-1, -cols, -cols-1 */
                } else {
                    if (cellsCopy[i - 1]?.active) neighbors++
                    if (cellsCopy[i + 1]?.active) neighbors++
                    if (cellsCopy[i + cols]?.active) neighbors++
                    if (cellsCopy[i + cols + 1]?.active) neighbors++
                    if (cellsCopy[i + cols - 1]?.active) neighbors++
                    if (cellsCopy[i - cols]?.active) neighbors++
                    if (cellsCopy[i - cols + 1]?.active) neighbors++
                    if (cellsCopy[i - cols - 1]?.active) neighbors++
                    /* -1, +1, +cols, +cols+1, +cols-1, -cols, -cols+1, -cols-1 */
                }
            }

            /* last row, +cols not neighbor */
            if (i >= (size - cols)) {
                /* first column, -1 not neighbor */
                if (i % cols === 0) {
                    if (cellsCopy[i + 1]?.active) neighbors++
                    if (cellsCopy[i - cols]?.active) neighbors++
                    if (cellsCopy[i - cols + 1]?.active) neighbors++
                    /* +1, -cols, -cols+1 */

                    /* last column, +1 not neighbor */
                } else if ((i + 1) % cols === 0) {
                    if (cellsCopy[i - 1]?.active) neighbors++
                    if (cellsCopy[i - cols]?.active) neighbors++
                    if (cellsCopy[i - cols - 1]?.active) neighbors++
                    /* -1, -cols, -cols-1 */
                } else {
                    if (cellsCopy[i - 1]?.active) neighbors++
                    if (cellsCopy[i + 1]?.active) neighbors++
                    if (cellsCopy[i - cols]?.active) neighbors++
                    if (cellsCopy[i - cols + 1]?.active) neighbors++
                    if (cellsCopy[i - cols - 1]?.active) neighbors++
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

            return { ...cell } //fallback
        })

        dispatch(setCells(newCells))
    }

    useEffect(() => {
        rootTheme.current.classList.toggle("light-theme", !darkTheme)
    }, [darkTheme])

    useEffect(() => {
        /* using timeout instead of interval so it iterates over the updated state */
        let timeout = null;
        if (playing) {
            timeout = setTimeout(calcGen, Math.abs(speedRange - 2000))
        } else {
            clearTimeout(timeout)
        }

        return () => clearTimeout(timeout)
    }, [playing, cells])

    /*     useEffect(() => {
            setSizeRange(size)
        }, [size])
        useEffect(() => {
            setSpeedRange(speed)
        }, [speed])
        useEffect(() => {
            setBoundRange(bound)
        }, [bound]) */

    useEffect(() => {
        setCols(Math.floor((window.innerWidth * (boundRange / 100) - 4) / sizeRange))
        setRows(Math.floor((window.innerHeight * (boundRange / 100) - 48 - 4) / sizeRange))
    }, [sizeRange, windowWidth, windowHeight, boundRange])

    useEffect(() => {
        dispatch({ type: "GAME_CLEAR_HISTORY" })
    }, [sizeRange, speedRange, boundRange])

    useEffect(() => {
        cells && reFillArray()
    }, [cols, rows])

    useEffect(() => {
        fillArray()
        const adjustGrid = () => {
            setWindowWidth(window.innerWidth * (boundRange / 100))
            setWindowHeight(window.innerHeight * (boundRange / 100))
        }

        window.addEventListener("resize", adjustGrid)

        return () => window.removeEventListener("resize", adjustGrid)
    }, [])

    return (
        <div className="home">
            <div className="home__buttons">
                <div className="home__buttons__box">
                    <nav>
                        <Link className="mainHeader__site" to={"/"}><h1>Game of Life</h1></Link>
                    </nav>
                    <button title="Info" className={`${modalActive && "active"}`} onClick={() => toggleModal()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                        </svg>
                    </button>
                </div>
                <div className="home__buttons__box">
                    <button title="Play" className={`${playing && "active"}`} onClick={() => startGame()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                    </button>
                    <button title="Pause" className={`${!playing && "active"}`} onClick={() => stopGame()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                        </svg>
                    </button>
                    <div className="home__buttons__settings">
                        <button title="Settings" className={`${settingsOpen && "active"}`} onClick={() => setSettingsOpen(settingsOpen => !settingsOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                            </svg>
                        </button>
                        {
                            settingsOpen &&
                            <div className={`home__buttons__settings__range ${settingsOpen && "active"}`}>
                                <div className="sizeRange" title="Cell size">
                                    <label htmlFor="sizeRange">Size</label>
                                    <input onChange={(e) => setSizeRange(e.target.value)} value={sizeRange} id="sizeRange" type="range" min="24" max="96" />
                                </div>
                                <div className="speedRange" title="Generation speed">
                                    <label htmlFor="speedRange">Speed</label>
                                    <input onChange={(e) => setSpeedRange(e.target.value)} value={speedRange} id="speedRange" type="range" min="0" max="2000" />
                                </div>
                                <div className="boundRange" title="Universe bound">
                                    <label htmlFor="boundRange">Bound</label>
                                    <input onChange={(e) => setBoundRange(e.target.value)} value={boundRange} id="boundRange" type="range" min="40" max="100" />
                                </div>
                                <div className="genBtns">
                                    <button title="Previous generation (modifying settings resets history)" onClick={() => {
                                        dispatch({ type: "GAME_UNDO" })
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                        </svg>
                                    </button>
                                    <button title="Next generation" onClick={calcGen}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="clearBtns">
                                    <button title="Reset settings" onClick={resetSettings}>Reset</button>
                                    <button title="Clear cells" onClick={fillArray}>Clear</button>
                                </div>
                            </div>
                        }

                    </div>

                    {
                        darkTheme ?
                            <button title="Light Theme" onClick={() => toggleDarkTheme()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                                    <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                                </svg>
                            </button>
                            :
                            <button title="Dark Theme" onClick={() => toggleDarkTheme()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-moon-fill" viewBox="0 0 16 16">
                                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                                </svg>
                            </button>
                    }
                    <button title="Auto Color" onClick={() => updateCellColor()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-rainbow" viewBox="0 0 16 16">
                            <path d="M8 4.5a7 7 0 0 0-7 7 .5.5 0 0 1-1 0 8 8 0 1 1 16 0 .5.5 0 0 1-1 0 7 7 0 0 0-7-7zm0 2a5 5 0 0 0-5 5 .5.5 0 0 1-1 0 6 6 0 1 1 12 0 .5.5 0 0 1-1 0 5 5 0 0 0-5-5zm0 2a3 3 0 0 0-3 3 .5.5 0 0 1-1 0 4 4 0 1 1 8 0 .5.5 0 0 1-1 0 3 3 0 0 0-3-3zm0 2a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 4 0 .5.5 0 0 1-1 0 1 1 0 0 0-1-1z" />
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
            <div className="game-grid-wrapper">
                <div className={`game-grid ${boundRange != 100 && "bound "}`} style={{ gridTemplateColumns: `repeat(${cols}, ${sizeRange}px)`, gridTemplateRows: `repeat(${rows}, ${sizeRange}px)`, gridAutoRows: `${sizeRange}px`, gridAutoColumns: `${sizeRange}px`, width: `${boundRange != 100 ? (window.innerWidth * (boundRange / 100)) + "px" : "100%"}`, height: `${boundRange != 100 ? (window.innerHeight * (boundRange / 100) - 48) + "px" : "100%"}` }} onMouseDown={cellFillStart} onMouseUp={cellFillEnd}>
                    {cellsFilled && cells?.map((cell, index) => {
                        return <Cell key={cell.id} index={index} toggleActive={toggleActive} active={cell.active} cellFillMove={cellFillMove} />
                    })}
                </div>
            </div>

        </div>
    )
}
