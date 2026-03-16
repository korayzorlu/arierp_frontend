import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    untitleDeedLeases:[],
    untitleDeedLeasesCount:0,
    untitleDeedLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    untitleDeedLeasesLoading:false,
}

export const fetchUntitleDeedLeases = createAsyncThunk('auth/fetchUntitleDeedLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/untitle_deed_leases/?ac=${activeCompany.id}`,
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

const untitleDeedLeaseSlice = createSlice({
    name:"untitleDeedLease",
    initialState,
    reducers:{
        setUntitleDeedLeasesLoading: (state,action) => {
            state.untitleDeedLeasesLoading = action.payload;
        },
        setUntitleDeedLeasesParams: (state,action) => {
            state.untitleDeedLeasesParams = {
                ...state.untitleDeedLeasesParams,
                ...action.payload
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUntitleDeedLeases.pending, (state) => {
                state.untitleDeedLeasesLoading = true
            })
            .addCase(fetchUntitleDeedLeases.fulfilled, (state,action) => {
                state.untitleDeedLeases = action.payload.data || action.payload;
                state.untitleDeedLeasesCount = action.payload.recordsTotal || 0;
                state.untitleDeedLeasesLoading = false
            })
            .addCase(fetchUntitleDeedLeases.rejected, (state,action) => {
                state.untitleDeedLeasesLoading = false
            })   
    },
  
})

export const {
    setUntitleDeedLeasesLoading,
    setUntitleDeedLeasesParams,
} = untitleDeedLeaseSlice.actions;
export default untitleDeedLeaseSlice.reducer;