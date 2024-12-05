// features/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPlansDetails } from '../../services/api';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';

const getTreePlans = createAsyncThunk('api/getTreePlans', async (_, { rejectWithValue, getState }) => {
    const planningDataIndex = 1;
    // const state = getState();
    // if (state.treePlans.treeOriginal.length > 0) {
    //     return state.treePlans.treeOriginal;
    // }
    try {
        const data = await getAllPlansDetails();
        const tree = data[planningDataIndex].map((province) => {
            return {
                title: province.name_tinh,
                key: `province-${province.id_tinh}`,
                children: province.quan_huyen_1_tinh
                    .map((dis) => {
                        return {
                            title: dis.name_huyen,
                            key: `district-${dis.id_huyen}`,
                            children: dis.quyhoach.map((plan) => {
                                return {
                                    title: `${plan.description} Mã quy hoạch: ${plan.id_quyhoach}-${plan.idProvince}`,
                                    key: `plan-${plan.id_quyhoach}-${plan.idProvince}`,
                                };
                            }),
                        };
                    })
                    .filter((item) => item.children.length !== 0),
            };
        });
        // console.log(tree, 'tree');
        return tree;
    } catch (error) {
        return rejectWithValue(error);
    }
});
const initialState = {
    treeOriginal: [],
    searchTreeData: [],
    status: THUNK_API_STATUS.DEFAULT,
    error: null,
    expandedKeys: [],
    autoExpandParent: false,
    searchTerm: '',
    treeCheckedKeys: [],
};
const treePlans = createSlice({
    name: 'treePlans',
    initialState,
    reducers: {
        searchTreePlans: (state, action) => {
            state.searchTreeData = action.payload.newTree;
            state.expandedKeys = action.payload.expandedKeys;
            state.autoExpandParent = action.payload.autoExpandParent;
        },
        setExpandedKeys: (state, action) => {
            state.expandedKeys = action.payload;
            state.autoExpandParent = false;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setTreeCheckedKey: (state, action) => {
            state.treeCheckedKeys = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTreePlans.pending, (state) => {
                state.status = THUNK_API_STATUS.PENDING;
                state.error = null;
                state.autoExpandParent = false;
                state.expandedKeys = [];
                state.searchTerm = '';
                state.searchTreeData = [];
            })
            .addCase(getTreePlans.fulfilled, (state, action) => {
                state.status = THUNK_API_STATUS.SUCCESS;
                state.treeOriginal = action.payload;
            })
            .addCase(getTreePlans.rejected, (state, action) => {
                state.status = THUNK_API_STATUS.REJECTED;
                state.error = action.error.message;
            });
    },
});

export const { searchTreePlans, setExpandedKeys, setSearchTerm,setTreeCheckedKey } = treePlans.actions;
export { getTreePlans };
export default treePlans.reducer;
