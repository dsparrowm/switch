import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import conversationsReducer from '../features/conversations/conversationSlice';
import messagesReducer from '../features/conversations/messageSlice';


export const store = configureStore({
  reducer: {
    auth: userReducer,
    conversations: conversationsReducer,
    messages: messagesReducer
  }
});
