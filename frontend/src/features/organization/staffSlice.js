import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orgStaffs: [],
  departmentMembers: []
};

const usersSlice = createSlice({
  name: 'staffs',
  initialState: initialState,
  reducers: {
    setOrgStaffs (state, action) {
      // set Organisation users
      state.orgStaffs = action.payload;
    },
    setDepartmentMembers (state, action) { 
      // set Organisation Department users
      state.departmentMembers = action.payload;
    }
  }
});

const { actions, reducer } = usersSlice;
// Extract and export each action creator by name
export const {
  setOrgStaffs,
  setDepartmentMembers
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

export const selectOrganizationStaffs = (state) => state.staffs.orgStaffs;
export const selectDepartmentMembers = (state) => state.staffs.departmentMembers;