export const setCells = (cells) => {

  return async dispatch => {
    dispatch({
      type: "SET_CELLS",
      cells
    })
  }
}

/* export const setSize = (size) => {

  return async dispatch => {
    dispatch({
      type: "SET_SIZE",
      size
    })
  }
}

export const setBound = (bound) => {

  return async dispatch => {
    dispatch({
      type: "SET_BOUND",
      bound
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

export const setAll = (cells, size, bound, speed) =>{
 
  return async dispatch => {
    dispatch({
      type: "SET_ALL",
      cells,
      size,
      bound,
      speed
    })
  }
} */