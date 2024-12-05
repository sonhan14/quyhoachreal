import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        districtId: null,
        data: null
    },
    reducers: {
        setDistrictId: (state, action) => {
            state.districtId = action.payload;
        },
        setMapData: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setDistrictId, setMapData } = mapSlice.actions;
export default mapSlice.reducer;
