import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    idGroup: null,
    idPost: null,
}


export const getid = createSlice({
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

export const { doGetBoxID, doGetGroupID } = getid.actions;

export default getid.reducer;