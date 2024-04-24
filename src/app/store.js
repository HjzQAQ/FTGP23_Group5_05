import { configureStore } from '@reduxjs/toolkit';
import toggleMenuReducer from '../features/toggleMenuSlice';
import connectWalletReducer from '../features/ConnectWalletSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

const reducers = combineReducers({
  toggleMenu: toggleMenuReducer,
  connectWallet: connectWalletReducer
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  //devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
  /*reducer: {
    toggleMenu: toggleMenuReducer,
    connectWallet: connectWalletReducer
  }*/
});
