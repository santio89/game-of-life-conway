export const setBound = (bound) => {

    return async dispatch => {
        dispatch({
            type: "SET_BOUND",
            bound
        })
    }
}

export const setSize = (size) => {

    return async dispatch => {
        dispatch({
            type: "SET_SIZE",
            size
        })
    }
}

export const setSpeed = (speed) => {

    return async dispatch => {
        dispatch({
            type: "SET_SPEED",
            speed
        })
    }
}
