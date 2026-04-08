import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    leaseColumns:[],
    leaseColumnsCount:0,
    leaseColumnsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    leaseColumnsLoading:false,
}

export const fetchLeaseColumns = createAsyncThunk('auth/fetchLeaseColumns', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/lease_columns/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        return response.data;
    } catch (error) {
        return [];
    }
});

const leaseColumns = createSlice({
    name:"leaseColumns",
    initialState,
    reducers:{
        setLeaseColumnsLoading: (state,action) => {
            state.leaseColumnsLoading = action.payload;
        },
        setLeaseColumnsParams: (state,action) => {
            state.leaseColumnsParams = {
                ...state.leaseColumnsParams,
                ...action.payload
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaseColumns.pending, (state) => {
                state.leaseColumnsLoading = true
            })
            .addCase(fetchLeaseColumns.fulfilled, (state,action) => {
                state.leaseColumns = action.payload.data || action.payload;
                state.leaseColumnsCount = action.payload.recordsTotal || 0;
                state.leaseColumnsLoading = false
            })
            .addCase(fetchLeaseColumns.rejected, (state,action) => {
                state.leaseColumnsLoading = false
            })
    },
  
})

export const {
    setLeaseColumnsLoading,
    setLeaseColumnsParams,
} = leaseColumns.actions;
export default leaseColumns.reducer;