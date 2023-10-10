const initialState = {
    bound: 100,
    size: 60,
    speed: 1000
}

const GameSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_BOUND':
            return { ...state, bound: action.bound }
        case 'SET_SIZE':
            return { ...state, size: action.size }
        case 'SET_SPEED':
            return { ...state, speed: action.speed }
        default:
            return state

    }
}

export default GameSettingsReducer