import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const listMarkerSlice = createSlice({
    name: 'listMarker',
    initialState,
    reducers: {
        setListMarker(state, action) {
            return action.payload
        },
        
    },
});

export const { setListMarker, clearListMarker } = listMarkerSlice.actions;
export default listMarkerSlice.reducer;
