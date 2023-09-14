import {
  // createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

const initialState = {
  selectedMessage: {
    id: 1,
    name: "Annoucement Channel",
    description: "Responsible for driving sales and revenue.",
    members: ["User1", "User2", "User3"],
  },
  messages: [
    {
      id: 1,
      name: "Annoucement Channel",
      description: "Responsible for driving sales and revenue.",
      members: ["User1", "User2", "User3"],
    },
    {
      id: 2,
      name: "Marketing Channel",
      description: "Handles marketing campaigns and promotions.",
      members: ["User4", "User5", "User6"],
    },
    {
      id: 3,
      name: "Engineering Channel",
      description: "Develops and maintains software products.",
      members: ["User7", "User8", "User9"],
    },
    {
      id: 4,
      name: "Human Resources",
      description: "Manages HR functions and employee relations.",
      members: ["User10", "User11", "User12"],
    },
    {
      id: 5,
      name: "Finance Channel",
      description: "Manages financial operations and budgeting.",
      members: ["User13", "User14", "User15"],
    }
  ]
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialState,
  reducers: {
    addNewMessage (state, action) {
      state.messages.push(action.payload);
    },
    setSelectedMessage (state, action) {
      const selected = state.messages.find(({ id }) => id === action.payload);
      state.selectedMessage = selected;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    // builder.addCase(fetchUserById.fulfilled, (state, action) => {
    //   // Add user to the state array
    //   state.entities.push(action.payload)
    // })
  }
});

// Extract the action creators object and the reducer
const { actions, reducer } = messagesSlice;
// Extract and export each action creator by name
export const {
  addNewMessage,
  setSelectedMessage
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
