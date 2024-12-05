

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from '../redux/account/accountSlice';
import listBoxReducer from './listBox/listBoxSlice ';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { listGroupReducer } from './listGroup/listGroupSlice ';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  //blacklist: ['account'] // account will not be persisted
}

const rootReducer = combineReducers({
  account: accountReducer,
  listbox: listBoxReducer,
  listgroup: listGroupReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store);

export { store, persistor };
