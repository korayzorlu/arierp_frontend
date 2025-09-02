import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bankAccountTransactions:[],
    bankAccountTransactionsCount:0,
    bankAccountTransactionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankAccountTransactionsLoading:false,
}

export const fetchBankAccountTransactions = createAsyncThunk('auth/fetchBankAccountTransactions', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/bank_account_transactions/?ac=${activeCompany.id}`,
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

export const addBankActivity = createAsyncThunk('auth/addBankActivity', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    
    try {
        const response = await axios.post(`/finance/add_bank_activity/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(setIsProgress(false));
    }
});

const bankAccountTransactionSlice = createSlice({
    name:"bankAccount",
    initialState,
    reducers:{
        setBankAccountTransactionsLoading: (state,action) => {
            state.bankAccountTransactionsLoading = action.payload;
        },
        setBankAccountTransactionsParams: (state,action) => {
            state.bankAccountTransactionsParams = {
                ...state.bankAccountTransactionsParams,
                ...action.payload
            };
        },
        resetBankAccountTransactionsParams: (state,action) => {
            state.bankAccountTransactionsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankAccountTransactions.pending, (state) => {
                state.bankAccountTransactionsLoading = true
            })
            .addCase(fetchBankAccountTransactions.fulfilled, (state,action) => {
                state.bankAccountTransactions = action.payload.data || action.payload;
                state.bankAccountTransactionsCount = action.payload.recordsTotal || 0;
                state.bankAccountTransactionsLoading = false
            })
            .addCase(fetchBankAccountTransactions.rejected, (state,action) => {
                state.bankAccountTransactionsLoading = false
            })
            
    },
  
})

export const {setBankAccountTransactionsLoading,setBankAccountTransactionsParams,resetBankAccountTransactionsParams,deleteBankAccountTransactions,setBankAccountTransactionsOverdues} = bankAccountTransactionSlice.actions;
export default bankAccountTransactionSlice.reducer;