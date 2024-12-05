import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    quyhoach: [],
    quyhoachByProvince: [],
};

export const searchQuery = createSlice({
    name: 'plansSelected',
    initialState,
    reducers: {
        setPlansInfo: (state, action) => {
            state.quyhoach = action.payload;
        },
        setPlanByProvince: (state, action) => {
            state.quyhoachByProvince = action.payload;
        },
    },
});

export const { setPlansInfo, setPlanByProvince } = searchQuery.actions;
export default searchQuery;
