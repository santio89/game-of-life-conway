import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/actions/modal.action';
import { setInfoReducer, setLangReducer } from '../store/actions/theme.action';
import { Link } from 'react-router-dom';
import langList from '../constants/lang';

export default function Modal() {
    const dispatch = useDispatch()
    const modalActive = useSelector(state => state.modal.active)
    const gameInfo = useSelector(state => state.theme.gameInfo)
    const modal = useRef()
    const lang = useSelector(state => state.theme.lang)
    const [currentLang, setCurrentLang] = useState(langList[lang])


    useEffect(() => {
        const closeModalClick = (e) => {
            if (e.target === modal.current) {
                dispatch(setModal(false))
            }
        }

        const closeModalEsc = (e) => {
            if (e.key === "Escape") {
                e.preventDefault()
                dispatch(setModal(false))
            }
        }

        if (modalActive) {
            document.addEventListener("click", closeModalClick)
            document.addEventListener("keydown", closeModalEsc)

            try {
                document.startViewTransition(() => {
                    modal.current.showModal()
                    modal.current.scrollTop = 0;
                });
            } catch {
                modal.current.showModal()
                modal.current.scrollTop = 0;
            }
        } else {
            gameInfo && dispatch(setInfoReducer(false))

            try {
                document.startViewTransition(() => {
                    modal.current.close()
                });
            } catch {
                modal.current.close()
            }
        }

        return () => {
            document.removeEventListener("click", closeModalClick);
            document.removeEventListener("keydown", closeModalEsc);
        }
    }, [modalActive])

    useEffect(() => {
        setCurrentLang(langList[lang])
    }, [lang])

    return (
        <dialog ref={modal} className="modalWrapper">
            <div className="modal">
                <div className="modal__header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                    </svg>
                    <div className="modal__buttonWrapper__lang">
                        <button title='English' className={`modal__lang ${lang === "eng" && "active"}`} onClick={() => { dispatch(setLangReducer(("eng"))) }}>ENG</button>
                        /
                        <button title='Español' className={`modal__lang ${lang === "esp" && "active"}`} onClick={() => { dispatch(setLangReducer(("esp"))) }}>ESP</button>
                    </div>
                </div>
                <div className="modal__body">
                    {
                        lang === "esp" ?
                            <p>
                                El Juego de la Vida de Conway es un autómata celular creado por John Horton Conway en 1970. El universo del Juego de la Vida es una cuadrícula infinita donde cada célula puede estar viva o muerta. El juego evoluciona en generaciones basadas en cuatro reglas simples:
                                <br />
                                <br />
                                - Cualquier célula viva con menos de dos vecinos vivos muere (subpoblación).
                                <br />
                                - Cualquier célula viva con dos o tres vecinos vivos sobrevive a la siguiente generación (supervivencia).
                                <br />
                                - Cualquier célula viva con más de tres vecinos vivos muere (sobrepoblación).
                                <br />
                                - Cualquier célula muerta con exactamente tres vecinos vivos se convierte en una célula viva (reproducción).
                                <br />
                                <br />
                                El juego avanza automáticamente sin intervención del jugador (juego de cero jugadores), y el estado inicial de la cuadrícula determina su evolución. El Juego de la Vida muestra una amplia variedad de patrones, incluyendo patrones estacionarios, oscilantes y móviles.
                                <br />
                                <br />
                                <Link to={currentLang.wikiLink} target="_blank" rel="noopener noreferrer">{currentLang.readMore}</Link>
                            </p>
                            :
                            <p>
                                Conway's Game of Life is a cellular automaton game created by John Horton Conway in 1970. The universe of the Game of Life is an infinite grid where each cell can be alive or dead. The game evolves in generations based on four simple rules:
                                <br />
                                <br />
                                - Any live cell with fewer than two live neighbors dies (underpopulation).
                                <br />
                                - Any live cell with two or three live neighbors survives to the next generation (survival).
                                <br />
                                - Any live cell with more than three live neighbors dies (overpopulation).
                                <br />
                                - Any dead cell with exactly three live neighbors becomes a live cell (reproduction).
                                <br />
                                <br />
                                The game progresses automatically without player input (zero-player game), and the initial state of the grid determines its evolution. The Game of Life showcases a wide variety of patterns, including stationary, oscillating, and moving patterns.
                                <br />
                                <br />
                                <Link to={currentLang.wikiLink} target="_blank" rel="noopener noreferrer">{currentLang.readMore}</Link>
                            </p>
                    }
                    <div className="modal__buttonWrapper">
                        <button className='modal__close' onClick={() => { dispatch(setModal(false)) }}>{lang === "esp" ? "Cerrar" : "Close"}</button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}
