import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    tradeAccounts:[],
    tradeAccountsCount:0,
    tradeAccountsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    tradeAccountsLoading:false,
}

export const fetchTradeAccounts = createAsyncThunk('auth/fetchTradeAccounts', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/trade/trade_accounts/?active_company=${activeCompany.id}`,
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

export const fetchTradeAccount = createAsyncThunk('auth/fetchTradeAccount', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/trade/trade_accounts/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/tradeAccounts");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addTradeAccount = createAsyncThunk('auth/addTradeAccount', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/trade/add_trade_account/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/tradeAccounts");
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

export const updateTradeAccount = createAsyncThunk('auth/updateTradeAccount', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/trade/update_trade_account/`,
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

export const deleteTradeAccount = createAsyncThunk('auth/deleteTradeAccount', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/trade/delete_trade_account/`,
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
        navigate("/trade-accounts");
    }
});

const tradeAccountSlice = createSlice({
    name:"tradeAccount",
    initialState,
    reducers:{
        setTradeAccountsLoading: (state,action) => {
            state.tradeAccountsLoading = action.payload;
        },
        setTradeAccountsParams: (state,action) => {
            state.tradeAccountsParams = {
                ...state.tradeAccountsParams,
                ...action.payload
            };
        },
        resetTradeAccountsParams: (state,action) => {
            state.tradeAccountsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTradeAccounts: (state,action) => {
            state.tradeAccounts = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTradeAccounts.pending, (state) => {
                state.tradeAccountsLoading = true
            })
            .addCase(fetchTradeAccounts.fulfilled, (state,action) => {
                state.tradeAccounts = action.payload.data || action.payload;
                state.tradeAccountsCount = action.payload.recordsTotal || 0;
                state.tradeAccountsLoading = false
            })
            .addCase(fetchTradeAccounts.rejected, (state,action) => {
                state.tradeAccountsLoading = false
            })
    },
  
})

export const {setTradeAccountsLoading,setTradeAccountsParams,resetTradeAccountsParams,deleteTradeAccounts} = tradeAccountSlice.actions;
export default tradeAccountSlice.reducer;