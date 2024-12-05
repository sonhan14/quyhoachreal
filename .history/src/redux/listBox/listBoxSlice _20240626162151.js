import { createSlice } from '@reduxjs/toolkit';

export const listBoxSlice = createSlice({
  name: 'listBox',
  initialState: {
    list: []
  },
  reducers: {
    listBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { listBox } = listBoxSlice.actions;

export default listBoxSlice.reducer;