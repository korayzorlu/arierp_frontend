import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlert, setDialog } from "../notificationSlice";
import { setIsProgress } from "../processSlice";

const initialState = {
    accountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    accountsLoading:false,
    //receivable
    receivableAccounts:[],
    receivableAccountsCount:0,
    receivableAccountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    receivableAccountsLoading:false,
    //payable
    payableAccounts:[],
    payableAccountsCount:0,
    payableAccountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    payableAccountsLoading:false,
    //
    //bank
    bankAccounts:[],
    bankAccountsCount:0,
    bankAccountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankAccountsLoading:false,
    //
    //sales
    salesAccounts:[],
    salesAccountsCount:0,
    //
    lastTab:0
}

export const fetchReceivableAccounts = createAsyncThunk('auth/fetchReceivableAccounts', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=receivable`,
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

export const fetchPayableAccounts = createAsyncThunk('auth/fetchPayableAccounts', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=payable`,
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

export const fetchBankAccounts = createAsyncThunk('auth/fetchBankAccounts', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=bank`,
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

export const fetchSalesAccounts = createAsyncThunk('auth/fetchSalesAccounts', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=sales`,
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

export const fetchAccounts = createAsyncThunk('auth/fetchAccounts', async ({activeCompany,type,params=null}) => {
    try {
        const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=${type}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );

        return response.data.data
    } catch (error) {
        return [];
    }
});

export const fetchAccount = createAsyncThunk('auth/fetchAccount', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/accounts");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addAccount = createAsyncThunk('auth/addAccount', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/add_account/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/accounts");
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

export const updateAccount = createAsyncThunk('auth/updateAccount', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/update_account/`,
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

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/delete_account/`,
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
        dispatch(setDialog(false));
        navigate("/accounts");
    }
});

const accountSlice = createSlice({
    name:"account",
    initialState,
    reducers:{
        setAccountsLoading: (state,action) => {
            state.accountsLoading = action.payload;
        },
        setAccountsParams: (state,action) => {
            state.accountsParams = {
                ...state.accountsParams,
                ...action.payload
            };
        },
        setReceivableAccountsLoading: (state,action) => {
            state.receivableAccountsLoading = action.payload;
        },
        setReceivableAccountsParams: (state,action) => {
            state.receivableAccountsParams = {
                ...state.receivableAccountsParams,
                ...action.payload
            };
        },
        setPayableAccountsLoading: (state,action) => {
            state.payableAccountsLoading = action.payload;
        },
        setPayableAccountsParams: (state,action) => {
            state.payableAccountsParams = {
                ...state.payableAccountsParams,
                ...action.payload
            };
        },
        setBankAccountsLoading: (state,action) => {
            state.bankAccountsLoading = action.payload;
        },
        setBankAccountsParams: (state,action) => {
            state.bankAccountsParams = {
                ...state.bankAccountsParams,
                ...action.payload
            };
        },
        setLastTab: (state,action) => {
            state.lastTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch receivable accounts
            .addCase(fetchReceivableAccounts.pending, (state) => {
                state.receivableAccountsLoading = true
            })
            .addCase(fetchReceivableAccounts.fulfilled, (state,action) => {
                state.receivableAccounts = action.payload.data || action.payload;
                state.receivableAccountsCount = action.payload.recordsTotal || 0;
                state.receivableAccountsLoading = false
            })
            .addCase(fetchReceivableAccounts.rejected, (state,action) => {
                state.receivableAccountsLoading = false
            })
            // payable receivable accounts
            .addCase(fetchPayableAccounts.pending, (state) => {
                state.payableAccountsLoading = true
            })
            .addCase(fetchPayableAccounts.fulfilled, (state,action) => {
                state.payableAccounts = action.payload.data || action.payload;
                state.payableAccountsCount = action.payload.recordsTotal || 0;
                state.payableAccountsLoading = false
            })
            .addCase(fetchPayableAccounts.rejected, (state,action) => {
                state.payableAccountsLoading = false
            })
            // bank receivable accounts
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
            // fetch sales accounts
            .addCase(fetchSalesAccounts.pending, (state) => {
                state.accountsLoading = true
            })
            .addCase(fetchSalesAccounts.fulfilled, (state,action) => {
                state.salesAccounts = action.payload.data || action.payload;
                state.salesAccountsCount = action.payload.recordsTotal || 0;
                state.accountsLoading = false
            })
            .addCase(fetchSalesAccounts.rejected, (state,action) => {
                state.accountsLoading = false
            })
            // fetch accounts
            .addCase(fetchAccounts.pending, (state) => {
                state.accountsLoading = true
            })
            .addCase(fetchAccounts.fulfilled, (state,action) => {
                state.accountsLoading = false
            })
            .addCase(fetchAccounts.rejected, (state,action) => {
                state.accountsLoading = false
            })
    },
  
})

export const {
    setAccountsLoading,
    setAccountsParams,
    setReceivableAccountsLoading,
    setReceivableAccountsParams,
    setPayableAccountsLoading,
    setPayableAccountsParams,
    setBankAccountsLoading,
    setBankAccountsParams,
    setLastTab
} = accountSlice.actions;
export default accountSlice.reducer;