const initialState = {
    userId: null,
    email: "",
    displayName: "",
    avatar: "",
}


const AuthReducer = (state = initialState, action) => {

    switch (action.type) {
        case "SIGN_IN":
            return {
                ...state,
                userId: action.userId,
                email: action.email,
                displayName: action.displayName,
                avatar: action.avatar,
            }
        case "SIGN_OUT":
            return {
                ...state,
                userId: null,
                email: "",
                displayName: "",
                avatar: ""
            }
        case "UPDATE_DISPLAY_NAME":
            return {
                ...state,
                displayName: action.displayName,
            }
        case "UPDATE_AVATAR":
            return {
                ...state,
                avatar: action.avatar,
            }
        default:
            return state
    }
}

export default AuthReducer