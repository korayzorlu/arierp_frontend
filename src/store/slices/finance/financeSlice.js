import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    financeSummary:[],
    financeSummaryCount:0,
    financeSummaryParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    financeSummaryLoading:false,
}

export const fetchFinanceSummary = createAsyncThunk('auth/fetchFinanceSummary', async (params=null,{rejectWithValue}) => {
    try {
        const response = await axios.post('/finance/finance_summary/', { 
          params:params  
        },{ withCredentials: true, });
        return response.data.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

const financeSlice = createSlice({
    name:"finance",
    initialState,
    reducers:{
        setFinanceSummaryLoading: (state,action) => {
            state.financeSummaryLoading = action.payload;
        },
        setFinanceSummaryParams: (state,action) => {
            state.financeSummaryParams = {
                ...state.financeSummaryParams,
                ...action.payload
            };
        },
        resetFinanceSummaryParams: (state,action) => {
            state.financeSummaryParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinanceSummary.pending, (state) => {
                state.financeSummaryLoading = true
            })
            .addCase(fetchFinanceSummary.fulfilled, (state,action) => {
                state.financeSummary = action.payload.data || action.payload;
                state.financeSummaryCount = action.payload.recordsTotal || 0;
                state.financeSummaryLoading = false
            })
            .addCase(fetchFinanceSummary.rejected, (state,action) => {
                state.financeSummaryLoading = false
            })
            
    },
  
})

export const {setFinanceSummaryLoading,setFinanceSummaryParams,resetFinanceSummaryParams,deleteFinanceSummary,setFinanceSummaryOverdues} = financeSlice.actions;
export default financeSlice.reducer;