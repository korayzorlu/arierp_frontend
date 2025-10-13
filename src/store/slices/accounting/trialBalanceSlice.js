import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    trialBalances:[],
    trialBalancesCount:0,
    trialBalancesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    trialBalancesLoading:false,
}

export const fetchTrialBalances = createAsyncThunk('auth/fetchTrialBalances', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/trial_balances/?ac=${activeCompany.id}`,
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


export const fetchTrialBalance = createAsyncThunk('auth/fetchTrialBalance', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/trial_balances/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/trialBalances");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addTrialBalance = createAsyncThunk('auth/addTrialBalance', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/add_trial_balance/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/trialBalances");
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

export const updateTrialBalance = createAsyncThunk('auth/updateTrialBalance', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/update_trial_balance/`,
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

export const deleteTrialBalance = createAsyncThunk('auth/deleteTrialBalance', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/delete_trial_balance/`,
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
        navigate("/trialBalances");
    }
});

const trialBalanceSlice = createSlice({
    name:"trialBalance",
    initialState,
    reducers:{
        setTrialBalancesLoading: (state,action) => {
            state.trialBalancesLoading = action.payload;
        },
        setTrialBalancesParams: (state,action) => {
            state.trialBalancesParams = {
                ...state.trialBalancesParams,
                ...action.payload
            };
        },
        resetTrialBalancesParams: (state,action) => {
            state.trialBalancesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTrialBalances: (state,action) => {
            state.trialBalances = [];
        },
        setTrialBalanceOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrialBalances.pending, (state) => {
                state.trialBalancesLoading = true
            })
            .addCase(fetchTrialBalances.fulfilled, (state,action) => {
                state.trialBalances = action.payload.data || action.payload;
                state.trialBalancesCount = action.payload.recordsTotal || 0;
                state.trialBalancesLoading = false
            })
            .addCase(fetchTrialBalances.rejected, (state,action) => {
                state.trialBalancesLoading = false
            })
    },
  
})

export const {
    setTrialBalancesLoading,
    setTrialBalancesParams,
    resetTrialBalancesParams,
    deleteTrialBalances,
    setTrialBalanceOverdues
} = trialBalanceSlice.actions;
export default trialBalanceSlice.reducer;