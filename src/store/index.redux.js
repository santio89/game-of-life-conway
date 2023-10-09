import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import ThemeReducer from './reducers/theme.reducer'
import ModalReducer from "./reducers/modal.reducer";
import GameReducer from "./reducers/game.reducer";
import undoable from 'redux-undo';

const RootReducer = combineReducers({
    theme: ThemeReducer,
    modal: ModalReducer,
    game: undoable(GameReducer, {
        limit: false,
        undoType: "GAME_UNDO",
        clearHistoryType: "GAME_CLEAR_HISTORY"
    }),
})

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ["theme"],
    timeout: 0,
}

const PersistedReducer = persistReducer(persistConfig, RootReducer)

export const store = createStore(PersistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)