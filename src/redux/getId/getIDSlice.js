import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    idGroup: null,
    idPost: null,
}


export const getIDSlice = createSlice({
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

export const { doGetBoxID, doGetGroupID } = getIDSlice.actions;

export default getIDSlice.reducer;