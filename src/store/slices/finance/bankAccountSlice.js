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
    //bank account balances
    bankAccountBalances:{
        active_balances:{},
        bank_accounts:{
            yapi_kredi:{try:[],usd:[],eur:[]},
            albaraka:{try:[],usd:[],eur:[]},
            vakifbank:{try:[],usd:[],eur:[]},
            vakif_katilim:{try:[],usd:[],eur:[]},
            akbank:{try:[],usd:[],eur:[]}
        }
    },
    bankAccountBalancesCount:0,
    bankAccountBalancesLoading:false,
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

export const fetchBankAccountBalances = createAsyncThunk('auth/fetchBankAccountBalances', async (params=null,{rejectWithValue}) => {
    try {
        const response = await axios.post('/finance/bank_account_balances/', { 
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
        //bank account balances
        setBankAccountBalancesLoading: (state,action) => {
            state.bankAccountBalancesLoading = action.payload;
        },
        setBankAccountBalancesParams: (state,action) => {
            state.bankAccountBalancesParams = {
                ...state.bankAccountBalancesParams,
                ...action.payload
            };
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
            //bank account balances
            .addCase(fetchBankAccountBalances.pending, (state) => {
                state.bankAccountBalancesLoading = true
            })
            .addCase(fetchBankAccountBalances.fulfilled, (state,action) => {
                state.bankAccountBalances = action.payload.data || action.payload;
                state.bankAccountBalancesCount = action.payload.recordsTotal || 0;
                state.bankAccountBalancesLoading = false
            })
            .addCase(fetchBankAccountBalances.rejected, (state,action) => {
                state.bankAccountBalancesLoading = false
            })
            
    },
  
})

export const {
    setBankAccountsLoading,
    setBankAccountsParams,
    resetBankAccountsParams,
    deleteBankAccounts,
    setBankAccountsOverdues,
    setBankAccountBalancesLoading,
    setBankAccountBalancesParams,
} = bankAccountSlice.actions;
export default bankAccountSlice.reducer;