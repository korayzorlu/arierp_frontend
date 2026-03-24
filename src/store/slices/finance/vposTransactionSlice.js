import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    vposTransactions:[],
    vposTransactionsCount:0,
    vposTransactionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    vposTransactionsLoading:false,
}

export const fetchVPosTransactions = createAsyncThunk('auth/fetchVPosTransactions', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/vpos_transactions/?ac=${activeCompany.id}`,
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

export const addVPosTransactionActivity = createAsyncThunk('auth/addVPosTransactionActivity', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    
    try {
        const response = await axios.post(`/finance/add_vpos_transaction_activity/`,
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

const vposTransactionSlice = createSlice({
    name:"vposTransaction",
    initialState,
    reducers:{
        setVPosTransactionsLoading: (state,action) => {
            state.vposTransactionsLoading = action.payload;
        },
        setVPosTransactionsParams: (state,action) => {
            state.vposTransactionsParams = {
                ...state.vposTransactionsParams,
                ...action.payload
            };
        },
        resetVPosTransactionsParams: (state,action) => {
            state.vposTransactionsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        updateVPosTransaction(state, action) {
            const { uuid } = action.payload;
            const item = state.vposTransactions.find(obj => obj.uuid === uuid);
            if (item) {
                item.vpos_transaction_activity = true;
            }
        }
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVPosTransactions.pending, (state) => {
                state.vposTransactionsLoading = true
            })
            .addCase(fetchVPosTransactions.fulfilled, (state,action) => {
                state.vposTransactions = action.payload.data || action.payload;
                state.vposTransactionsCount = action.payload.recordsTotal || 0;
                state.vposTransactionsLoading = false
            })
            .addCase(fetchVPosTransactions.rejected, (state,action) => {
                state.vposTransactionsLoading = false
            })
            
    },
  
})

export const {
    setVPosTransactionsLoading,
    setVPosTransactionsParams,
    resetVPosTransactionsParams,
    deleteVPosTransactions,
    setVPosTransactionsOverdues,
    updateVPosTransaction
} = vposTransactionSlice.actions;
export default vposTransactionSlice.reducer;