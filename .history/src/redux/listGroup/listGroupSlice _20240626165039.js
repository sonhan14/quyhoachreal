import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: []
}


export const listBoxSlice = createSlice({
  name: 'listbox',
  initialState,
  reducers: {
    doListBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { doListBox } = listBoxSlice.actions;

export default listBoxSlice.reducer;