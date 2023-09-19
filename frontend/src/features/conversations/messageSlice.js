import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: []
};

const messageSlice = createSlice({
  name: 'messages',
  initialState: initialState,
  reducers: {
    addNewMessage (state, action) {
      state.messages.push(action.payload);
    },
    setMessages (state, action) {
      state.messages = action.payload;
    }
  }
});

const { actions, reducer } = messageSlice;
// Extract and export each action creator by name
export const {
  addNewMessage,
  setMessages,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

export const selectMessages = (state) => state.messages.messages;