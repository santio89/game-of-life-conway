const initialState = {
    darkTheme: true,
    colorTheme: "rgb(70, 171, 226)",
    gridMode: false,
    gameInfo: true,
    lang: "eng",
    shape: "square"
}

const ThemeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, darkTheme: action.darkTheme }
        case 'SET_COLOR':
            return { ...state, colorTheme: action.colorTheme }
        case 'SET_GRID':
            return { ...state, gridMode: action.gridMode }
        case 'SET_INFO':
            return { ...state, gameInfo: action.gameInfo }
        case 'SET_LANG':
            return { ...state, lang: action.lang }
        case 'SET_SHAPE':
            return { ...state, shape: action.shape }
        default:
            return state
    }
}

export default ThemeReducer
