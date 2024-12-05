import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: []
}


export const listGroup = createSlice({
  name: 'listgroup',
  initialState,
  reducers: {
    doListBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { doListBox } = listGroup.actions;

export default listGroup.reducer;