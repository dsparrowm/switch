import {
  // createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

export const initialState = {
  isUserLoggedIn: false,
  user: {}
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    logout(state) {
      state.isUserLoggedIn = false;
      state.user = {};
    },
    login(state, action) {
      state.isUserLoggedIn = true;
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    // builder.addCase(fetchUserById.fulfilled, (state, action) => {
    //   // Add user to the state array
    //   state.entities.push(action.payload)
    // })
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = userSlice;
// Extract and export each action creator by name
export const { login, logout } = actions;
// Export the reducer, either as a default or named export
export default reducer;
