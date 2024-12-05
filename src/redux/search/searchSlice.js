import { createSlice } from '@reduxjs/toolkit';

const defaultLocation = {
    displayName: 'Hà Nội, Đông Anh',
    provinceName: 'Hà Nội',
    districtName: 'Đông Anh',
    lat: '21.0283334',
    lon: '105.854041',
};

const initialState = {
    searchResult: defaultLocation,
};

export const searchQuery = createSlice({
    name: 'search',
    initialState,
    reducers: {
        doSearch: (state, action) => {
            state.searchResult = action.payload;
        },
        resetToDefault: (state) => {
            state.searchResult = defaultLocation;
        },
        backToMyLocation: (state, action) => {
            state.searchResult = action.payload;
        },
        setCurrentLocation: (state, action) => {
            state.searchResult = action.payload;
        },
    },
});

export const { doSearch, resetToDefault, setCurrentLocation, backToMyLocation } = searchQuery.actions;
export default searchQuery.reducer;
