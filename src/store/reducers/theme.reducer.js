const initialState = {
    darkTheme: true,
    colorTheme: "rgb(70, 171, 226)",
    gridMode: true,
    gameInfo: true,
    lang: "eng",
    shape: "square",
    stats: true,
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
        case 'SET_STATS':
            return { ...state, stats: action.stats }
        default:
            return state
    }
}

export default ThemeReducer
