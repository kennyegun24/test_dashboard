import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";
import roles from "./roles";

const persistConfig = {
  key: "uysdgflfy23uyedewtyfd",
  storage: sessionStorage,
};
let store;
const combinedReducers = combineReducers({
  roles: roles,
});
const persistedReducer = persistReducer(persistConfig, combinedReducers);

store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export { store };
