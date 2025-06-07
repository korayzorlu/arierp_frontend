import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlert, setDialog } from "../notificationSlice";
import { setIsProgress } from "../processSlice";

const initialState = {
    transactions:[],
    transactionsCount:0,
    transactionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    transactionsLoading:false,
}

export const fetchTransactions = createAsyncThunk('auth/fetchTransactions', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/transactions/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        return response.data.data;
    } catch (error) {
        console.log(error)
        return [];
    }
});

const transactionSlice = createSlice({
    name:"transaction",
    initialState,
    reducers:{
        setTransactionsLoading: (state,action) => {
            state.transactionsLoading = action.payload;
        },
        setTransactionsParams: (state,action) => {
            state.transactionsParams = {
                ...state.transactionsParams,
                ...action.payload
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.transactionsLoading = true
            })
            .addCase(fetchTransactions.fulfilled, (state,action) => {
                state.transactions = action.payload.data || action.payload;
                state.transactionsCount = action.payload.recordsTotal || 0;
                state.transactionsLoading = false
            })
            .addCase(fetchTransactions.rejected, (state,action) => {
                state.transactionsLoading = false
            })
    },
  
})

export const {setTransactionsLoading,setTransactionsParams} = transactionSlice.actions;
export default transactionSlice.reducer;