const initialState = {
    /* bound 40-100 */
    bound: 100,
    /* size 24-96, mid 60 */
    size: 24,
    /* speed 0-1984, mid 1000 */
    speed: 1984
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