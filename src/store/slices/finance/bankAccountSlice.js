import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bankAccounts:[],
    bankAccountsCount:0,
    bankAccountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankAccountsLoading:false,
}

export const fetchBankAccounts = createAsyncThunk('auth/fetchBankAccounts', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/bank_accounts/?ac=${activeCompany.id}`,
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

const bankAccountSlice = createSlice({
    name:"bankAccount",
    initialState,
    reducers:{
        setBankAccountsLoading: (state,action) => {
            state.bankAccountsLoading = action.payload;
        },
        setBankAccountsParams: (state,action) => {
            state.bankAccountsParams = {
                ...state.bankAccountsParams,
                ...action.payload
            };
        },
        resetBankAccountsParams: (state,action) => {
            state.bankAccountsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteBankAccounts: (state,action) => {
            state.bankAccounts = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankAccounts.pending, (state) => {
                state.bankAccountsLoading = true
            })
            .addCase(fetchBankAccounts.fulfilled, (state,action) => {
                state.bankAccounts = action.payload.data || action.payload;
                state.bankAccountsCount = action.payload.recordsTotal || 0;
                state.bankAccountsLoading = false
            })
            .addCase(fetchBankAccounts.rejected, (state,action) => {
                state.bankAccountsLoading = false
            })
            
    },
  
})

export const {setBankAccountsLoading,setBankAccountsParams,resetBankAccountsParams,deleteBankAccounts,setBankAccountsOverdues} = bankAccountSlice.actions;
export default bankAccountSlice.reducer;