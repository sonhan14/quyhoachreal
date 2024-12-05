import { createSlice } from '@reduxjs/toolkit';
initialState: {
    list: []
  },
export const listBoxSlice = createSlice({
  name: 'listBox',
  reducers: {
    listBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { listBox } = listBoxSlice.actions;

export default listBoxSlice.reducer;