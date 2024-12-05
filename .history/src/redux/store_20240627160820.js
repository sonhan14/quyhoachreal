

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from '../redux/account/accountSlice';
import listBoxReducer from './listForum/lisForumSlice';
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
import  listGroupReducer  from './getId/getIDSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  //blacklist: ['account'] // account will not be persisted
}

const rootReducer = combineReducers({
  account: accountReducer,
  listbox: listBoxReducer,
  getid: listGroupReducer,
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
