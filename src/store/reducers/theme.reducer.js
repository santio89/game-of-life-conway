const initialState = {
    darkTheme: true,
}

const ThemeReducer = (state=initialState, action) => {
    switch(action.type){
        case 'SET_THEME':
            return {...state, darkTheme: action.darkTheme}
        default: 
            return state
    }
}

export default ThemeReducer
