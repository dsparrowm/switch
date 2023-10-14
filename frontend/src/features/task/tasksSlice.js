import {
  createSlice
} from '@reduxjs/toolkit';

const initialState = {
  tasksList: []
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    setTasksList (state, action) {
      state.tasksList = action.payload;
    },
    addTask (state, action) {
      state.tasksList.push(action.payload);
    },
    updateTaskStatus (state, action) {
      const { taskId, newStatus } = action.payload;
      const foundTask = state.tasksList.find(({ id }) => id === taskId);
      if (foundTask) {
        foundTask.status = newStatus;
      }
    }
  }
});

// Extract the action creators object and the reducer
const { actions, reducer } = tasksSlice;

export const {
  setTasksList,
  addTask,
  updateTaskStatus
} = actions;

export default reducer;

export const selectAllTasks = (state) => state.tasks.tasksList;
