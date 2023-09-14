import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import messagesReducer from '../features/messages/messages';

export const store = configureStore({
  reducer: {
    auth: userReducer,
    messages: messagesReducer
  }
});
