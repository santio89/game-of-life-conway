import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setModal } from '../store/actions/modal.action';

export default function Modal() {
    const modalActive = useSelector(state => state.modal.active)
    const dispatch = useDispatch()
    const modal = useRef()


    useEffect(() => {
        const closeModalClick = (e) => {
            console.log(e.target)
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
                <button className='modal__close' onClick={() => { dispatch(setModal(false)) }}>Close</button>
            </div>
        </dialog>
    )
}
