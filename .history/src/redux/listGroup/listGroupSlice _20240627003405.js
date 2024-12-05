import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    idGroup: 0
}


export const listGroup = createSlice({
  name: 'listgroup',
  initialState,
  reducers: {
    doListGroup: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { doListGroup } = listGroup.actions;

export default listGroup.reducer;