import {
  // createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

const initialState = {
  activeConversations: {},
  departments: [],
  privates: []
}

const conversationSlice = createSlice({
  name: 'conversations',
  initialState: initialState,
  reducers: {
    addNewDepartmentConversation (state, action) {
      state.departments.push(action.payload);
    },
    setActiveConversation (state, action) {
      state.activeConversations = action.payload;
    },
    setDepartmentConversation (state, action) {
      state.departments = action.payload;
    }
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = conversationSlice;
// Extract and export each action creator by name
export const {
  addNewConversation,
  setActiveConversation,
  setDepartmentConversation
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

export const selectActiveConversation = (state) => state.activeConversations;
