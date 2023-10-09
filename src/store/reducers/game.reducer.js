const initialState = {
  cells: [],
  size: 60,
  speed: 1000, 
  bound: 100,
}

const GameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CELLS':
      return { ...state, cells: action.cells }
    case 'SET_SIZE':
      return { ...state, size: action.size }
    case 'SET_BOUND':
      return { ...state, bound: action.bound }
    case 'SET_SPEED':
      return { ...state, speed: action.speed }
    default:
      return state

  }
}

export default GameReducer