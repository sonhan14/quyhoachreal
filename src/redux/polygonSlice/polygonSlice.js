import { createSlice } from '@reduxjs/toolkit';

const polygonSessionStorage = sessionStorage.getItem('polygons');

const init = {
    boundingboxs: [],
};

const initialState = {
    polygons: init,
};

export const polygonSlice = createSlice({
    name: 'polygons',
    initialState,
    reducers: {
        setPolygons: (state, action) => {
            state.polygons = action.payload;
        },
    },
});

export const { setPolygons } = polygonSlice.actions;
export default polygonSlice.reducer;
