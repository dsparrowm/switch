import {
  createSlice
} from '@reduxjs/toolkit';

const initialState = {
  activeTab: {},
  officeSpace: {
    loading: true,
    default: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    setActiveTab (state, action) {
      state.activeTab = action.payload;
    },
    setUpOfficeSpace (state, actions) {
      state.officeSpace = actions.payload;
    }
  }
});

// Extract the action creators object and the reducer
const { actions, reducer } = uiSlice;

export const {
  setActiveTab,
  setUpOfficeSpace
} = actions;

export default reducer;

export const selectActiveTab = (state) => state.ui.activeTab;
export const selectOfficeSpace = (state) => state.ui.officeSpace;
