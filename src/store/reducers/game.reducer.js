const initialState = {
  cells: []
}

const GameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CELLS':
      return { cells: action.cells }
    default:
      return state

  }
}

export default GameReducer