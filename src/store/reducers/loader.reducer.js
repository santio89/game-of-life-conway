const initialState = {
    authLoader: false,
    presetLoader: true,
    defaultPresetLoader: true,
    renamePresetLoader: false,
    deletePresetLoader: false,
    updateDisplayNameLoader: false,
    updateAvatarLoader: false,
}


const LoaderReducer = (state = initialState, action) => {

    switch (action.type) {
        case "SET_AUTH_LOADER":
            return {
                ...state,
                authLoader: action.authLoader,
            }
        case "SET_PRESET_LOADER":
            return {
                ...state,
                presetLoader: action.presetLoader,
            }
        case "SET_DEFAULT_PRESET_LOADER":
            return {
                ...state,
                defaultPresetLoader: action.defaultPresetLoader,
            }
        case "SET_DISPLAY_NAME_LOADER":
            return {
                ...state,
                updateDisplayNameLoader: action.updateDisplayNameLoader,
            }
        case "SET_AVATAR_LOADER":
            return {
                ...state,
                updateAvatarLoader: action.updateAvatarLoader,
            }
        case "SET_RENAME_PRESET_LOADER":
            return {
                ...state,
                renamePresetLoader: action.renamePresetLoader,
            }
        case "SET_DELETE_PRESET_LOADER":
            return {
                ...state,
                deletePresetLoader: action.deletePresetLoader,
            }
        default:
            return state
    }
}

export default LoaderReducer