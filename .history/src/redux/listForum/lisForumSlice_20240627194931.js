import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: [],
    listgroup:[]
}


export const lisForumSlice = createSlice({
  name: 'listbox',
  initialState,
  reducers: {
    doListBox: (state, action) => {
      state.list = action.payload;
    },
    doListGroup: (state, action) => {
      state.listgroup = action.payload;
    }
  }
});

export const { doListBox } = lisForumSlice.actions;

export default lisForumSlice.reducer;