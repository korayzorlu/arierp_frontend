import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    tradeTransactions:[],
    tradeTransactionsCount:0,
    tradeTransactionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    tradeTransactionsLoading:false,
}

export const fetchTradeTransactions = createAsyncThunk('auth/fetchTradeTransactions', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/trade/trade_transactions/?ac=${activeCompany.id}`,
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


export const fetchTradeTransaction = createAsyncThunk('auth/fetchTradeTransaction', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/trade/trade_transactions/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/tradeTransactions");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addTradeTransaction = createAsyncThunk('auth/addTradeTransaction', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/trade/add_trade_transaction/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/tradeTransactions");
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

export const updateTradeTransaction = createAsyncThunk('auth/updateTradeTransaction', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/trade/update_trade_transaction/`,
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

export const deleteTradeTransaction = createAsyncThunk('auth/deleteTradeTransaction', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/trade/delete_trade_transaction/`,
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
        navigate("/tradeTransactions");
    }
});

const tradeTransactionSlice = createSlice({
    name:"tradeTransaction",
    initialState,
    reducers:{
        setTradeTransactionsLoading: (state,action) => {
            state.tradeTransactionsLoading = action.payload;
        },
        setTradeTransactionsParams: (state,action) => {
            state.tradeTransactionsParams = {
                ...state.tradeTransactionsParams,
                ...action.payload
            };
        },
        resetTradeTransactionsParams: (state,action) => {
            state.tradeTransactionsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTradeTransactions: (state,action) => {
            state.tradeTransactions = [];
        },
        setTradeTransactionOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTradeTransactions.pending, (state) => {
                state.tradeTransactionsLoading = true
            })
            .addCase(fetchTradeTransactions.fulfilled, (state,action) => {
                state.tradeTransactions = action.payload.data || action.payload;
                state.tradeTransactionsCount = action.payload.recordsTotal || 0;
                state.tradeTransactionsLoading = false
            })
            .addCase(fetchTradeTransactions.rejected, (state,action) => {
                state.tradeTransactionsLoading = false
            })
    },
  
})

export const {
    setTradeTransactionsLoading,
    setTradeTransactionsParams,
    resetTradeTransactionsParams,
    deleteTradeTransactions,
    setTradeTransactionOverdues
} = tradeTransactionSlice.actions;
export default tradeTransactionSlice.reducer;