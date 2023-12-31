import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const organizationSlice = createSlice({
  name: 'organization',
  initialState: initialState,
  reducers: {
    setOrganization (state, action) {
      // state.org = action.payload;
      Object.assign(state, action.payload);
    }
  }
});

const { actions, reducer } = organizationSlice;
// Extract and export each action creator by name
export const {
  setOrganization
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

export const selectOrganization = (state) => state.organization;
