import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    list: []
}


export const lisForumSlice  = createSlice({
  name: 'listbox',
  initialState,
  reducers: {
    doListBox: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { doListBox } = lisForumSlice .actions;

export default lisForumSlice .reducer;