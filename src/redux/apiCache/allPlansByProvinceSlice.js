import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getALLPlansByProvince } from '../../services/api';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';

const fetchAllPlansByProvince = createAsyncThunk('api/fetchAllPlansByProvince', async (_, { rejectWithValue }) => {
    try {
        const data = await getALLPlansByProvince();
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const allPlansByProvinceSlice = createSlice({
    name: 'allPlansByProvinceSlice',
    initialState: {
        data: [],
        status: THUNK_API_STATUS.DEFAULT,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPlansByProvince.pending, (state) => {
                state.status = THUNK_API_STATUS.PENDING;
            })
            .addCase(fetchAllPlansByProvince.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(fetchAllPlansByProvince.rejected, (state, action) => {
                state.error = action.payload;
                state.status = THUNK_API_STATUS.REJECTED;
            });
    },
});

export { fetchAllPlansByProvince };
export default allPlansByProvinceSlice.reducer;
