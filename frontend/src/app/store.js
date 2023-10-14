import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// import { apiSlice } from '../features/api/apiSlice';

import authReducer from '../features/auth/authSlice';
import conversationsReducer from '../features/conversations/conversationSlice';
import messagesReducer from '../features/conversations/messageSlice';
import organizationReducer from '../features/organization/organizationSlice';
import staffsReducers from '../features/organization/staffSlice';
import uiReducers from '../features/ui/uiSlice';
import tasksReducers from '../features/task/tasksSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui']
};

const rootReducer = combineReducers({
  auth: authReducer,
  conversations: conversationsReducer,
  messages: messagesReducer,
  organization: organizationReducer,
  staffs: staffsReducers,
  ui: uiReducers,
  tasks: tasksReducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
  // [apiSlice.reducerPath]: apiSlice.reducer,
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
  // [thunk]
});

export const persistor = persistStore(store);
