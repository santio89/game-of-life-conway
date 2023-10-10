const initialState = {
    darkTheme: true,
    colorTheme: "rgb(70, 171, 226)"
}

const ThemeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, darkTheme: action.darkTheme }
        case 'SET_COLOR':
            return { ...state, colorTheme: action.colorTheme }
        default:
            return state
    }
}

export default ThemeReducer
