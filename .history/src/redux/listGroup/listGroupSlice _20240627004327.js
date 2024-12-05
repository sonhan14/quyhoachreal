import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    idGroup: null
}


export const listGroup = createSlice({
  name: 'listgroup',
  initialState,
  reducers: {
    doListGroup: (state, action) => {
      state.idGroup = action.payload;
    }
  }
});

export const { doListGroup } = listGroup.actions;

export default listGroup.reducer;