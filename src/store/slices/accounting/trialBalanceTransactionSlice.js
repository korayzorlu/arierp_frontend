import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    trialBalanceTransactions:[],
    trialBalanceTransactionsCount:0,
    trialBalanceTransactionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    trialBalanceTransactionsLoading:false,
    trialBalanceTransactionsInLease:[],
    trialBalanceTransactionsInLeaseCode:0,

}

export const fetchTrialBalanceTransactions = createAsyncThunk('auth/fetchTrialBalanceTransactions', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/trial_balance_transactions/?ac=${activeCompany.id}`,
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

export const fetchTrialBalanceTransaction = createAsyncThunk('auth/fetchTrialBalanceTransaction', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/trial_balance_transactions/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/trialBalanceTransactions");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const deleteTrialBalanceTransaction = createAsyncThunk('auth/deleteTrialBalanceTransaction', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/delete_trial_balance_transaction/`,
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
        navigate("/trialBalanceTransactions");
    }
});

export const fetchTrialBalanceTransactionsInLease = createAsyncThunk('organization/fetchTrialBalanceTransactionsInLease', async ({activeCompany,tb_uuid}) => {
    const response = await axios.get(`/accounting/trial_balance_transactions/?active_company=${activeCompany.id}&tb_uuid=${tb_uuid}`, {withCredentials: true});
    return response.data;
});

const trialBalanceTransactionSlice = createSlice({
    name:"trialBalanceTransaction",
    initialState,
    reducers:{
        setTrialBalanceTransactionsLoading: (state,action) => {
            state.trialBalanceTransactionsLoading = action.payload;
        },
        setTrialBalanceTransactionsParams: (state,action) => {
            state.trialBalanceTransactionsParams = {
                ...state.trialBalanceTransactionsParams,
                ...action.payload
            };
        },
        resetTrialBalanceTransactionsParams: (state,action) => {
            state.trialBalanceTransactionsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTrialBalanceTransactions: (state,action) => {
            state.trialBalanceTransactions = [];
        },
        setTrialBalanceTransactionOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
        setTrialBalanceTransactionsInLeaseCode: (state,action) => {
            state.trialBalanceTransactionsInLeaseCode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrialBalanceTransactions.pending, (state) => {
                state.trialBalanceTransactionsLoading = true
            })
            .addCase(fetchTrialBalanceTransactions.fulfilled, (state,action) => {
                state.trialBalanceTransactions = action.payload.data || action.payload;
                state.trialBalanceTransactionsCount = action.payload.recordsTotal || 0;
                state.trialBalanceTransactionsLoading = false
            })
            .addCase(fetchTrialBalanceTransactions.rejected, (state,action) => {
                state.trialBalanceTransactionsLoading = false
            })
            //fetch trial balance transactions in lease
            .addCase(fetchTrialBalanceTransactionsInLease.pending, (state) => {
                state.trialBalanceTransactionsLoading = true;
            })
            .addCase(fetchTrialBalanceTransactionsInLease.fulfilled, (state,action) => {
                state.trialBalanceTransactionsInLease = action.payload;
                state.trialBalanceTransactionsLoading = false;
            })
            .addCase(fetchTrialBalanceTransactionsInLease.rejected, (state,action) => {
                state.trialBalanceTransactionsLoading = false;
            })
    },
  
})

export const {
    setTrialBalanceTransactionsLoading,
    setTrialBalanceTransactionsParams,
    resetTrialBalanceTransactionsParams,
    deleteTrialBalanceTransactions,
    setTrialBalanceTransactionOverdues,
    setTrialBalanceTransactionsInLeaseCode,
} = trialBalanceTransactionSlice.actions;
export default trialBalanceTransactionSlice.reducer;