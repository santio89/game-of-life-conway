const initialState = {
    active: false,
}

const ModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MODAL':
            return { ...state, active: action.active }
        default:
            return state
    }
}

export default ModalReducer
