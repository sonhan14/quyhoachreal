import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    idGroup: null,
    idPost: null,
}


export const getidSlice = createSlice({
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

export const { doGetBoxID, doGetGroupID } = getidSlice.actions;

export default getidSlice.reducer;