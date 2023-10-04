export const setThemeReducer = (darkTheme)=>{
   
    return async dispatch =>{
        dispatch({
            type: "SET_THEME",
            darkTheme
        })
    }
}