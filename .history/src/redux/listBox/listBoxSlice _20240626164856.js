import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: []
}


export const listBoxSlice = createSlice({
  name: 'listBox',
  initialState,
  reducers: {
    listBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { listBox } = listBoxSlice.actions;

export default listBoxSlice.reducer;