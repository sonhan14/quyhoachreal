import { createSlice } from '@reduxjs/toolkit';

export const listBoxSlice = createSlice({
  name: 'listBox',
  initialState: {
    list: []
  },
  reducers: {
    setListBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { setListBox } = listBoxSlice.actions;

export default listBoxSlice.reducer;