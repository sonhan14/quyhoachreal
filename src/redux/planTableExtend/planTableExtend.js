import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
};

export const planTableExtend = createSlice({
    name: 'planTableExtend',
    initialState,
    reducers: {
        setIsOpenTablePlan: (state, action) => {
            state.isOpen = action.payload;
        },
    },
});

export const { setIsOpenTablePlan } = planTableExtend.actions;
export default planTableExtend;
