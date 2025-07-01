import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    ledgerAccounts:[],
    ledgerAccountsCount:0,
    ledgerAccountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    ledgerAccountsLoading:false,
}

export const fetchLedgerAccounts = createAsyncThunk('auth/fetchLedgerAccounts', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/ledger/ledger_accounts/?active_company=${activeCompany.id}`,
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

export const fetchLedgerAccount = createAsyncThunk('auth/fetchLedgerAccount', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/ledger/ledger_accounts/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/ledgerAccounts");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addLedgerAccount = createAsyncThunk('auth/addLedgerAccount', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/ledger/add_ledger_account/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/ledgerAccounts");
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

export const updateLedgerAccount = createAsyncThunk('auth/updateLedgerAccount', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/ledger/update_ledger_account/`,
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

export const deleteLedgerAccount = createAsyncThunk('auth/deleteLedgerAccount', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/ledger/delete_ledger_account/`,
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
        navigate("/ledger-accounts");
    }
});

const ledgerAccountSlice = createSlice({
    name:"ledgerAccount",
    initialState,
    reducers:{
        setLedgerAccountsLoading: (state,action) => {
            state.ledgerAccountsLoading = action.payload;
        },
        setLedgerAccountsParams: (state,action) => {
            state.ledgerAccountsParams = {
                ...state.ledgerAccountsParams,
                ...action.payload
            };
        },
        resetLedgerAccountsParams: (state,action) => {
            state.ledgerAccountsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteLedgerAccounts: (state,action) => {
            state.ledgerAccounts = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLedgerAccounts.pending, (state) => {
                state.ledgerAccountsLoading = true
            })
            .addCase(fetchLedgerAccounts.fulfilled, (state,action) => {
                state.ledgerAccounts = action.payload.data || action.payload;
                state.ledgerAccountsCount = action.payload.recordsTotal || 0;
                state.ledgerAccountsLoading = false
            })
            .addCase(fetchLedgerAccounts.rejected, (state,action) => {
                state.ledgerAccountsLoading = false
            })
    },
  
})

export const {setLedgerAccountsLoading,setLedgerAccountsParams,resetLedgerAccountsParams,deleteLedgerAccounts} = ledgerAccountSlice.actions;
export default ledgerAccountSlice.reducer;