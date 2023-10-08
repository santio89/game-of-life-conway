import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/actions/modal.action';

export default function Modal() {
    const modalActive = useSelector(state => state.modal.active)
    const dispatch = useDispatch()
    const modal = useRef()
    const [textLang, setTextLang] = useState("eng")


    useEffect(() => {
        const closeModalClick = (e) => {
            if (e.target === modal.current) {
                modal.current.close()
                dispatch(setModal(false))
            }
        }

        const closeModalEsc = (e) => {
            if (e.key === "Escape") {
                e.preventDefault()
                try {
                    document.startViewTransition(() => {
                        modal.current.close()
                    });
                } catch {
                    modal.current.close()
                }
            }
        }

        if (modalActive) {
            document.addEventListener("click", closeModalClick)
            document.addEventListener("keydown", closeModalEsc)

            try {
                document.startViewTransition(() => {
                    modal.current.showModal()
                });
            } catch {
                modal.current.showModal()
            }
        } else {
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

    return (
        <dialog ref={modal} className="modalWrapper">
            <div className="modal">
                {
                    textLang === "esp" ?
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
                        </p>
                }
                <div className="modal__buttonWrapper">
                    <div className="modal__buttonWrapper__lang">
                        <button className={`modal__lang ${textLang === "eng" && "active"}`} onClick={() => { setTextLang("eng") }}>ENG</button>
                        /
                        <button className={`modal__lang ${textLang === "esp" && "active"}`} onClick={() => { setTextLang("esp") }}>ESP</button>
                    </div>
                    <button className='modal__close' onClick={() => { dispatch(setModal(false)) }}>{textLang==="esp"?"Cerrar":"Close"}</button>
                </div>
            </div>
        </dialog>
    )
}
