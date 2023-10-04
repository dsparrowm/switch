import {
  createSlice
} from '@reduxjs/toolkit';

const initialState = {
  tasksList: {}
};

const uiSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    setTasks (state, action) {
      state.tasksList = action.payload;
    },
    addTask (state, actions) {
      state.tasksList.push(actions.payload);
    }
  }
});

// Extract the action creators object and the reducer
const { actions, reducer } = uiSlice;

export const {
  setTasks,
  addTask
} = actions;

export default reducer;

export const selectAllTasks = (state) => state.tasks.tasksList;
