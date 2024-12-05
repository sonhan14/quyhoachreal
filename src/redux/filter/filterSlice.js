import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    house: [],
    date: [],
    landArea: [],
    priceRange: [],
};

const filtersSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter(state, action) {
            const { category, id } = action.payload;
            if (state[category]) {
                state[category] = state[category]?.includes(id) ? [] : [id];
            }
        },
        clearFilter(state, action) {
            const { category } = action.payload;
            state[category] = [];
        },
    },
});

export const { setFilter, clearFilter } = filtersSlice.actions;

export default filtersSlice.reducer;
