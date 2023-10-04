import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import ThemeReducer from './reducers/theme.reducer'
import AuthReducer from "./reducers/auth.reducer";
import LoaderReducer from "./reducers/loader.reducer";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const RootReducer = combineReducers({
    theme: ThemeReducer,
    auth: AuthReducer,
    loader: LoaderReducer
})

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ["theme", "auth"],
    timeout: 0,
}

const PersistedReducer = persistReducer(persistConfig, RootReducer)

export const store = createStore(PersistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)