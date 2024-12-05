import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: [],
    listgroup:[],
    listuser:[],
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
    },
    doListUser: (state, action) => {
      state.listuser = action.payload;
    }
  }
});

export const { doListBox, doListGroup, doListUser } = lisForumSlice.actions;

export default lisForumSlice.reducer;