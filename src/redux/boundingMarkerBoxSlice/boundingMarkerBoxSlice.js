import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllImageInBoundingBox } from '../../services/api';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';

const getBoudingboxData = createAsyncThunk('api/getBoudingBox', async (args, { rejectWithValue }) => {
    try {
        const { southWest, northEast } = args;
        const data = await getAllImageInBoundingBox(southWest, northEast);
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState = {
    boudingboxData: [],
    status: THUNK_API_STATUS.DEFAULT,
    error: null,
};

const boudingboxSlice = createSlice({
    name: 'boudingboxData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBoudingboxData.pending, (state) => {
                state.status = THUNK_API_STATUS.PENDING;
                state.boudingboxData = [];
            })
            .addCase(getBoudingboxData.fulfilled, (state, action) => {
                state.status = THUNK_API_STATUS.SUCCESS;
                state.boudingboxData = action.payload;
            })
            .addCase(getBoudingboxData.rejected, (state) => {
                state.status = THUNK_API_STATUS.REJECTED;
            });
    },
});

// export const {} = boudingboxData.actions;

export { getBoudingboxData };
export default boudingboxSlice.reducer;
