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
        active_balances:{
            try_balance:0,
            usd_balance:0,
            usd_try_balance:0,
            eur_balance:0,
            eur_try_balance:0,
            total_try_balance:0
        },
        bank_accounts:{
            yapi_kredi:{try:[],usd:[],eur:[]},
            albaraka:{try:[],usd:[],eur:[]},
            vakifbank:{try:[],usd:[],eur:[]},
            vakif_katilim:{try:[],usd:[],eur:[]},
            akbank:{try:[],usd:[],eur:[]},
            is_bank:{try:[],usd:[],eur:[]},
            garanti:{try:[],usd:[],eur:[]},
            halkbank:{try:[],usd:[],eur:[]},
            ziraat:{try:[],usd:[],eur:[]},
            ziraat_katilim:{try:[],usd:[],eur:[]},
            turkiye_finans:{try:[],usd:[],eur:[]},
            teb:{try:[],usd:[],eur:[]},
            kuveytturk:{try:[],usd:[],eur:[]},
            emlak_katilim:{try:[],usd:[],eur:[]}
        },
        exchange_rates:{}
    },
    bankAccountBalancesCount:0,
    bankAccountBalancesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
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

export const fetchBankAccountBalances = createAsyncThunk('auth/fetchBankAccountBalances', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/bank_account_balances/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        return response.data;
    } catch (error) {
        return {
            active_balances:{
                try_balance:0,
                usd_balance:0,
                usd_try_balance:0,
                eur_balance:0,
                eur_try_balance:0,
                total_try_balance:0
            },
            bank_accounts:{
                yapi_kredi:{try:[],usd:[],eur:[]},
                albaraka:{try:[],usd:[],eur:[]},
                vakifbank:{try:[],usd:[],eur:[]},
                vakif_katilim:{try:[],usd:[],eur:[]},
                akbank:{try:[],usd:[],eur:[]},
                is_bank:{try:[],usd:[],eur:[]},
                garanti:{try:[],usd:[],eur:[]},
                halkbank:{try:[],usd:[],eur:[]},
                ziraat:{try:[],usd:[],eur:[]},
                ziraat_katilim:{try:[],usd:[],eur:[]},
                turkiye_finans:{try:[],usd:[],eur:[]},
                teb:{try:[],usd:[],eur:[]},
                kuveytturk:{try:[],usd:[],eur:[]},
                emlak_katilim:{try:[],usd:[],eur:[]}
            },
            exchange_rates:{}
        };
    }
});

export const fetchBankAccountDailyRecords = createAsyncThunk('auth/fetchBankAccountDailyRecords', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/bank_account_daily_records/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        return response.data;
    } catch (error) {
        return {
            active_balances:{
                try_balance:0,
                usd_balance:0,
                usd_try_balance:0,
                eur_balance:0,
                eur_try_balance:0,
                total_try_balance:0
            },
            bank_accounts:{
                yapi_kredi:{try:[],usd:[],eur:[]},
                albaraka:{try:[],usd:[],eur:[]},
                vakifbank:{try:[],usd:[],eur:[]},
                vakif_katilim:{try:[],usd:[],eur:[]},
                akbank:{try:[],usd:[],eur:[]},
                is_bank:{try:[],usd:[],eur:[]},
                garanti:{try:[],usd:[],eur:[]},
                halkbank:{try:[],usd:[],eur:[]},
                ziraat:{try:[],usd:[],eur:[]},
                ziraat_katilim:{try:[],usd:[],eur:[]},
                turkiye_finans:{try:[],usd:[],eur:[]},
                teb:{try:[],usd:[],eur:[]},
                kuveytturk:{try:[],usd:[],eur:[]},
                emlak_katilim:{try:[],usd:[],eur:[]}
            },
            exchange_rates:{}
        };
    }
});

// export const fetchBankAccountBalances = createAsyncThunk('auth/fetchBankAccountBalances', async (params=null,{rejectWithValue}) => {
//     try {
//         const response = await axios.post('/finance/bank_account_balances/', { 
//           params:params  
//         },{ withCredentials: true, });
//         return response.data.data;
//     } catch (error) {
//         return rejectWithValue({
//             status:error.status,
//             message:error.response.data.message
//         });
//     };
// });

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
        resetBankAccountBalancesParams: (state,action) => {
            state.bankAccountBalancesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
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
            //bank account daily records
            .addCase(fetchBankAccountDailyRecords.pending, (state) => {
                state.bankAccountBalancesLoading = true
            })
            .addCase(fetchBankAccountDailyRecords.fulfilled, (state,action) => {
                state.bankAccountBalances = action.payload.data || action.payload;
                state.bankAccountBalancesCount = action.payload.recordsTotal || 0;
                state.bankAccountBalancesLoading = false
            })
            .addCase(fetchBankAccountDailyRecords.rejected, (state,action) => {
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
    resetBankAccountBalancesParams
} = bankAccountSlice.actions;
export default bankAccountSlice.reducer;