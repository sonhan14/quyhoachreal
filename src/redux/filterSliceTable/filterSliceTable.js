import { createSlice } from '@reduxjs/toolkit';

const initialState = { query: {} };
const filterSliceTable = createSlice({
    name: 'filterSliceTable',
    initialState,
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        resetQuery: (state, action) => {
            state.query = { page: 1 };
        },
    },
});

export const { setQuery, resetQuery } = filterSliceTable.actions;
export default filterSliceTable;
