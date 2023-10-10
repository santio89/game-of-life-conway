export const setThemeReducer = (darkTheme) => {

    return async dispatch => {
        dispatch({
            type: "SET_THEME",
            darkTheme
        })
    }
}

export const setColorReducer = (colorTheme) => {

    return async dispatch => {
        dispatch({
            type: "SET_COLOR",
            colorTheme
        })
    }
}
