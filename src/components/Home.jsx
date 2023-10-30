import { useEffect, useState, useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setThemeReducer, setColorReducer, setGridReducer, setShapeReducer, setStatsReducer } from "../store/actions/theme.action";
import { setModal } from "../store/actions/modal.action";
import { setBound, setSize, setSpeed } from "../store/actions/gameSettings.action";
import { setCells } from "../store/actions/game.action";
import Cell from "./Cell";
import { Link } from "react-router-dom";
import langList from "../constants/lang";


export default function Home({ rootTheme }) {
    const dispatch = useDispatch()
    const lang = useSelector(state => state.theme.lang)
    const [currentLang, setCurrentLang] = useState(lang ? langList[lang] : langList["eng"])
    const gameInfo = useSelector(state => state.theme.gameInfo)
    const modalActive = useSelector(state => state.modal.active)
    const [cellsFilled, setCellsFilled] = useState(false)
    const cells = useSelector(state => state.game.present.cells)

    const darkTheme = useSelector(state => state.theme.darkTheme)
    const colorTheme = useSelector(state => state.theme.colorTheme)
    const gridMode = useSelector(state => state.theme.gridMode)
    const cellShape = useSelector(state => state.theme.shape)
    const genStats = useSelector(state => state.theme.stats)

    const boundRange = useSelector(state => state.gameSettings.bound)
    const sizeRange = useSelector(state => state.gameSettings.size)
    const speedRange = useSelector(state => state.gameSettings.speed)

    const [pop, setPop] = useState(0)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth * (boundRange / 100))
    const [windowHeight, setWindowHeight] = useState(window.innerHeight * (boundRange / 100))
    const [cols, setCols] = useState(Math.floor((window.innerWidth * (boundRange / 100) - 4) / sizeRange))
    const [rows, setRows] = useState(Math.floor((window.innerHeight * (boundRange / 100) - 48 - 4) / sizeRange))
    const [playing, setPlaying] = useState(false)
    const [wasPlaying, setWasPlaying] = useState(false)
    const [cellFillMode, setCellFillMode] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)

    const lastTouch = useRef(null)

    const toggleDarkTheme = () => {
        darkTheme ? dispatch(setThemeReducer(false)) : dispatch(setThemeReducer(true))
    }

    const toggleModal = () => {
        modalActive ? dispatch(setModal(false)) : dispatch(setModal(true))
    }

    const setShape = (shape) => {
        dispatch(setShapeReducer(shape))
    }

    const startGame = () => {
        setPlaying(true)
    }

    const stopGame = () => {
        setPlaying(false)
    }

    const resetSettings = () => {
        dispatch(setSpeed(1000))
        dispatch(setSize(60))
        dispatch(setBound(100))
    }

    const countActive = () => {
        let active = 0;
        cells.forEach((cell) => {
            cell.active && active++
        })

        return active
    }

    const toggleActive = (index) => {
        const cellsCopy = [...cells]

        const modCell = () => {
            if (cellsCopy[index].active === true) return { ...cellsCopy[index], active: false }
            if (cellsCopy[index].active === false) return { ...cellsCopy[index], active: true }
        }

        cellsCopy[index] = modCell()

        dispatch(setCells(cellsCopy))
        lastTouch.current = index;
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
        dispatch(setColorReducer(cellColor))
    }

    const fillArray = useCallback(() => {
        if (cellsFilled && !cells.some(cell => cell.active)) return

        let array = []

        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                array.push({
                    id: window.crypto.randomUUID(),
                    row: i,
                    col: j,
                    active: false,
                })
            }
        }

        dispatch(setCells(array))
        dispatch({ type: "GAME_CLEAR_HISTORY" })
        setCellsFilled(true)
    }, [cellsFilled, cells, cols, rows, dispatch])

    const reFillArray = useCallback(() => {
        let array = []
        let cellsCopy = [...cells]

        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                let found = 0;

                cellsCopy.forEach(cell => {
                    if (cell.row === i && cell.col === j) {
                        found = 1;
                        array.push(cell)
                    }
                })

                !found && array.push({
                    id: window.crypto.randomUUID(),
                    row: i,
                    col: j,
                    active: false,
                })
            }
        }

        dispatch(setCells(array))
    }, [cells, cols, rows, dispatch])

    const calcRandomGen = useCallback(() => {
        let array = []

        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                array.push({
                    id: window.crypto.randomUUID(),
                    row: i,
                    col: j,
                    active: Math.random() >= .5 ? true : false,
                })
            }
        }
        dispatch(setCells(array))
    }, [cols, rows, dispatch])

    const calcGen = useCallback(() => {
        const cellsCopy = [...cells]
        if (!cellsCopy.some(cell => cell.active)) return

        const getNeighbors = (i) => {
            const size = cols * rows;
            let neighbors = 0;
            /* neighbors can potentially be -1, +1, -cols, -cols-1, -cols+1, +cols, +cols-1, +cols-1 */

            if (i >= cols && i < (size - cols)) {
                /* middle rows */

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
            } else if (i < cols) {
                /* first row, -cols not neighbor */

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
            } else if (i >= (size - cols)) {
                /* last row, +cols not neighbor */

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
    }, [cells, cols, rows, dispatch])

    useEffect(() => {
        rootTheme.current.classList.toggle("light-theme", !darkTheme)
    }, [darkTheme])

    useEffect(() => {
        colorTheme && document.documentElement.style.setProperty('--main-color', colorTheme);
    }, [colorTheme])

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

    useEffect(() => {
        genStats && setPop(countActive())
    }, [cells])

    useEffect(() => {
        genStats && setPop(countActive())
    }, [genStats])

    useEffect(() => {
        /* debounce re-size */
        const debounce = setTimeout(() => {
            setCols(Math.floor((window.innerWidth * (boundRange / 100) - 4) / sizeRange))
            setRows(Math.floor((window.innerHeight * (boundRange / 100) - 48 - 4) / sizeRange))
        }, 250)

        return () => clearTimeout(debounce)
    }, [sizeRange, boundRange, windowWidth, windowHeight])

    useEffect(() => {
        cells && reFillArray()
        dispatch({ type: "GAME_CLEAR_HISTORY" })
    }, [cols, rows])

    useEffect(() => {
        lang && setCurrentLang(langList[lang])
    }, [lang])

    useEffect(() => {
        document.title = currentLang && currentLang?.siteTitle;
    }, [currentLang])

    useEffect(() => {
        fillArray()
        const adjustGrid = () => {
            setWindowWidth(window.innerWidth * (boundRange / 100))
            setWindowHeight(window.innerHeight * (boundRange / 100))
        }

        window.addEventListener("resize", adjustGrid)

        /* game info check */
        gameInfo && dispatch(setModal(true))

        return () => window.removeEventListener("resize", adjustGrid)
    }, [])

    return (
        <div className="home">
            <div className="home__buttons">
                <div className="home__buttons__box">
                    <nav>
                        <Link className="mainHeader__site" to={"/"}><h1>{currentLang?.gameLife}</h1></Link>
                    </nav>
                    <button title={currentLang?.info} className={`${modalActive && "active"}`} onClick={() => toggleModal()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                        </svg>
                    </button>
                </div>
                <div className="home__buttons__box">
                    <button title={currentLang?.run} className={`${playing && "active"}`} onClick={() => startGame()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                    </button>
                    <button title={currentLang?.pause} className={`${!playing && "active"}`} onClick={() => stopGame()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                        </svg>
                    </button>
                    <button title={currentLang?.randomize} onClick={() => calcRandomGen()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                        </svg>
                    </button>
                    <div className="home__buttons__settings">
                        <button title={currentLang?.settings} className={`${settingsOpen && "active"}`} onClick={() => setSettingsOpen(settingsOpen => !settingsOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                            </svg>
                        </button>
                        {
                            settingsOpen &&
                            <div className={`home__buttons__settings__opts ${settingsOpen && "active"}`}>
                                <div className="home__buttons__settings__theme">
                                    <button className={darkTheme ? "" : "active"} title={currentLang?.lightTheme} onClick={() => toggleDarkTheme()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                                            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                                        </svg>
                                    </button>
                                    <button title={currentLang?.themeColor} onClick={() => updateCellColor()} className="active">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-rainbow" viewBox="0 0 16 16">
                                            <path d="M8 4.5a7 7 0 0 0-7 7 .5.5 0 0 1-1 0 8 8 0 1 1 16 0 .5.5 0 0 1-1 0 7 7 0 0 0-7-7zm0 2a5 5 0 0 0-5 5 .5.5 0 0 1-1 0 6 6 0 1 1 12 0 .5.5 0 0 1-1 0 5 5 0 0 0-5-5zm0 2a3 3 0 0 0-3 3 .5.5 0 0 1-1 0 4 4 0 1 1 8 0 .5.5 0 0 1-1 0 3 3 0 0 0-3-3zm0 2a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 4 0 .5.5 0 0 1-1 0 1 1 0 0 0-1-1z" />
                                        </svg>
                                    </button>
                                    <div className="shapeContainer">
                                        <button title={currentLang?.squareShape} className={cellShape === "square" && "active"} onClick={() => setShape("square")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-square-fill" viewBox="0 0 16 16">
                                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />
                                            </svg>
                                        </button>
                                        <button title={currentLang?.circleShape} className={cellShape === "circle" && "active"} onClick={() => setShape("circle")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
                                                <circle cx="8" cy="8" r="8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="boundRange" title={currentLang?.universeBound}>
                                    <label htmlFor="boundRange">{currentLang?.bound}</label>
                                    <input onChange={(e) => {
                                        dispatch(setBound(e.target.value));
                                    }} value={boundRange} id="boundRange" type="range" min="40" max="100" />
                                </div>
                                <div className="sizeRange" title={currentLang?.cellSize}>
                                    <label htmlFor="sizeRange">{currentLang?.size}</label>
                                    <input onChange={(e) => {
                                        dispatch(setSize(e.target.value));
                                    }} value={sizeRange} id="sizeRange" type="range" min="24" max="96" />
                                </div>
                                <div className="speedRange" title={currentLang?.speedRange}>
                                    <label htmlFor="speedRange">{currentLang?.speed}</label>
                                    <input onChange={(e) => dispatch(setSpeed(e.target.value))} value={speedRange} id="speedRange" type="range" min="0" max="1984" /* |1984-2000|=16ms(60fps) */ />
                                </div>
                                <div className="genStats" title={currentLang?.showPop}>
                                    <label htmlFor="genStats">Pop.</label>
                                    <span>
                                        <input onChange={() => dispatch(setStatsReducer(!genStats))} checked={genStats} id="genStats" type="checkbox" />
                                    </span>
                                </div>
                                <div className="genBtns">
                                    {
                                        <button title={currentLang?.toggleGrid} onClick={() => { gridMode ? dispatch(setGridReducer(false)) : dispatch(setGridReducer(true)) }} className={`${gridMode && "active"}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grid-3x3" viewBox="0 0 16 16">
                                                <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zM1.5 1a.5.5 0 0 0-.5.5V5h4V1H1.5zM5 6H1v4h4V6zm1 4h4V6H6v4zm-1 1H1v3.5a.5.5 0 0 0 .5.5H5v-4zm1 0v4h4v-4H6zm5 0v4h3.5a.5.5 0 0 0 .5-.5V11h-4zm0-1h4V6h-4v4zm0-5h4V1.5a.5.5 0 0 0-.5-.5H11v4zm-1 0V1H6v4h4z" />
                                            </svg>
                                        </button>
                                    }
                                    <button title={currentLang?.prevGen} onClick={() => {
                                        dispatch({ type: "GAME_UNDO" })
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                        </svg>
                                    </button>
                                    <button title={currentLang?.nextGen} onClick={calcGen}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="clearBtns">
                                    <button title={currentLang?.resetSettings} onClick={resetSettings}>{currentLang?.reset}</button>
                                    <button title={currentLang?.clearCells} onClick={fillArray}>{currentLang?.clear}</button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
            {genStats &&
                <div className="gen-stats" title={currentLang?.population}>
                    <p>Pop.: <span>{pop}</span></p>
                </div>
            }
            <div className="game-grid-wrapper">
                <div aria-label="Cells grid" className={`game-grid ${boundRange != 100 && "bound "}`} style={{
                    gridTemplateColumns: `repeat(${cols}, ${sizeRange}px)`, gridTemplateRows: `repeat(${rows}, ${sizeRange}px)`,
                    gridAutoRows: `${sizeRange}px`,
                    gridAutoColumns: `${sizeRange}px`,
                    width: `${boundRange != 100 ? (window.innerWidth * (boundRange / 100)) + "px" : "100%"}`,
                    height: `${boundRange != 100 ? (window.innerHeight * (boundRange / 100) - 48) + "px" : "100%"}`
                }} onPointerDown={cellFillStart} onPointerUp={cellFillEnd} onTouchEnd={cellFillEnd} onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (cell) {
                        if (lastTouch.current == cell.dataset.index) return
                        toggleActive(cell.dataset.index)
                    }
                }}>
                    {cellsFilled && cells?.map((cell, index) => {
                        return <Cell key={cell.id} index={index} toggleActive={toggleActive} active={cell.active} cellFillMove={cellFillMove} gridMode={gridMode} lastTouch={lastTouch} cellShape={cellShape} />
                    })}
                </div>
            </div>
        </div>
    )
}
