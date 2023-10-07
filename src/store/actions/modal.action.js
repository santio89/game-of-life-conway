export const setModal = (active) => {

    return async dispatch => {
        dispatch({
            type: "SET_MODAL",
            active
        })
    }
}
