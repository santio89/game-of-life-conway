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

export const setGridReducer = (gridMode) => {

    return async dispatch => {
        dispatch({
            type: "SET_GRID",
            gridMode
        })
    }
}

export const setInfoReducer = (gameInfo) => {

    return async dispatch => {
        dispatch({
            type: "SET_INFO",
            gameInfo
        })
    }
}
