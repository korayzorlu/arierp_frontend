import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    amountDebitTransactions:[],
    amountDebitTransactionsCount:0,
    amountDebitTransactionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    amountDebitTransactionsLoading:false,
}

export const fetchAmountDebitTransactions = createAsyncThunk('auth/fetchAmountDebitTransactions', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/amount_debit_transactions/?active_company=${activeCompany.id}`,
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

export const fetchAmountDebitTransaction = createAsyncThunk('auth/fetchAmountDebitTransaction', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/risk/amount_debit_transactions/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/amount_debit_transactions");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

const amountDebitTransactionSlice = createSlice({
    name:"amountDebitTransaction",
    initialState,
    reducers:{
        setAmountDebitTransactionsLoading: (state,action) => {
            state.amountDebitTransactionsLoading = action.payload;
        },
        setAmountDebitTransactionsParams: (state,action) => {
            state.amountDebitTransactionsParams = {
                ...state.amountDebitTransactionsParams,
                ...action.payload
            };
        },
        resetAmountDebitTransactionsParams: (state,action) => {
            state.amountDebitTransactionsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAmountDebitTransactions.pending, (state) => {
                state.amountDebitTransactionsLoading = true
            })
            .addCase(fetchAmountDebitTransactions.fulfilled, (state,action) => {
                state.amountDebitTransactions = action.payload.data || action.payload;
                state.amountDebitTransactionsCount = action.payload.recordsTotal || 0;
                state.amountDebitTransactionsLoading = false
            })
            .addCase(fetchAmountDebitTransactions.rejected, (state,action) => {
                state.amountDebitTransactionsLoading = false
            })
            
    },
  
})

export const {setAmountDebitTransactionsLoading,setAmountDebitTransactionsParams,resetAmountDebitTransactionsParams} = amountDebitTransactionSlice.actions;
export default amountDebitTransactionSlice.reducer;