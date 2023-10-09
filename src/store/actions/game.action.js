export const setCells = (cells) => {

  return async dispatch => {
    dispatch({
      type: "SET_CELLS",
      cells
    })
  }
}