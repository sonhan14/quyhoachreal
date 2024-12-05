import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    idGroup: null,
    idPost: null,
}


export const listGroup = createSlice({
  name: 'getid',
  initialState,
  reducers: {
    doGetBoxID: (state, action) => {
      state.idGroup = action.payload;
    },
    doGetGroupID: (state, action) => {
      state.idPost = action.payload;
    }
  }
});

export const { doGetBoxID, doGetGroupID } = listGroup.actions;

export default listGroup.reducer;