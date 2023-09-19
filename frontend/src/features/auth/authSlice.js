import {
  // createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

export const initialState = {
  isUserLoggedIn: false,
  user: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout (state) {
      state.isUserLoggedIn = false;
      state.user = null;
    },
    login (state, action) {
      state.isUserLoggedIn = true;
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    }
  }
});

// Extract the action creators object and the reducer
const { actions, reducer } = authSlice;
// Extract and export each action creator by name
export const { login, logout } = actions;
// Export the reducer, either as a  default or named export
export default reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentUserToken = (state) => state.auth.token;
