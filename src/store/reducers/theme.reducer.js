const initialState = {
    darkTheme: true,
    autoColors: false,
}

const ThemeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, darkTheme: action.darkTheme }
        case 'SET_COLORS':
            return { ...state, autoColors: action.autoColors }
        default:
            return state
    }
}

export default ThemeReducer
