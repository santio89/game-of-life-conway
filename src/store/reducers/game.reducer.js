const initialState = {
  cells: [],
  /* gen: 0,
  pop: 0, */
}

const GameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CELLS':
      return { ...state, cells: action.cells }
/*     case 'SET_GEN':
      return { ...state, gen: action.gen }
    case 'SET_POP':
      return { ...state, pop: action.pop } */
    default:
      return state

  }
}

export default GameReducer