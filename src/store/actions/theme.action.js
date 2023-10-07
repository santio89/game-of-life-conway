export const setThemeReducer = (darkTheme) => {

    return async dispatch => {
        dispatch({
            type: "SET_THEME",
            darkTheme
        })
    }
}

export const setColorsReducer = (autoColors) => {

    return async dispatch => {
        dispatch({
            type: "SET_COLORS",
            autoColors
        })
    }
}