import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import authReducer from '../features/auth/authSlice';
import conversationsReducer from '../features/conversations/conversationSlice';
import messagesReducer from '../features/conversations/messageSlice';
import organizationReducer from '../features/organization/organizationSlice';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authReducer,
  conversations: conversationsReducer,
  messages: messagesReducer,
  organization: organizationReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export const persistor = persistStore(store);