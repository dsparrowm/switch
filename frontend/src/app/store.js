import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import conversationsReducer from '../features/conversations/conversations';

export const store = configureStore({
  reducer: {
    auth: userReducer,
    messages: conversationsReducer
  }
});
