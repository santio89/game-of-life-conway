export const setCells = (cells) => {

  return async dispatch => {
    dispatch({
      type: "SET_CELLS",
      cells
    })
  }
}
/* 
export const setGen = (gen) => {

  return async dispatch => {
    dispatch({
      type: "SET_GEN",
      gen
    })
  }
}

export const setPop = (pop) => {

  return async dispatch => {
    dispatch({
      type: "SET_POP",
      pop
    })
  }
}
 */