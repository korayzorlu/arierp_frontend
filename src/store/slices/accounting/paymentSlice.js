import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlert, setDialog } from "../notificationSlice";
import { setIsProgress } from "../processSlice";

const initialState = {
    //incoming
    incomingPayments:[],
    incomingPaymentsCount:0,
    incomingPaymentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    incomingPaymentsLoading:false,
    //outgoing
    outgoingPayments:[],
    outgoingPaymentsCount:0,
    outgoingPaymentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    outgoingPaymentsLoading:false,
    //
    lastTab:0
}

export const fetchincomingPayments = createAsyncThunk('auth/fetchincomingPayments', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/payments/?active_company=${activeCompany.id}&type=incoming`,
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

export const fetchOutgoingPayments = createAsyncThunk('auth/fetchOutgoingPayments', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/payments/?active_company=${activeCompany.id}&type=outgoing`,
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

export const fetchPayment = createAsyncThunk('auth/fetchPayment', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/payments/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/invoices");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addPayment = createAsyncThunk('auth/addPayment', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/add_payment/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/payments");
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

export const updatePayment = createAsyncThunk('auth/updatePayment', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/update_payment/`,
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

export const deletePayment = createAsyncThunk('auth/deletePayment', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/delete_payment/`,
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
        navigate("/payments");
    }
});

const paymentSlice = createSlice({
    name:"payment",
    initialState,
    reducers:{
        setIncomingPaymentsLoading: (state,action) => {
            state.saleInvoicesLoading = action.payload;
        },
        setIncomingPaymentsParams: (state,action) => {
            state.saleInvoicesParams = {
                ...state.saleInvoicesParams,
                ...action.payload
            };
        },
        setOutgoingPaymentsLoading: (state,action) => {
            state.purchaseInvoicesLoading = action.payload;
        },
        setOutgoingPaymentsParams: (state,action) => {
            state.purchaseInvoicesParams = {
                ...state.purchaseInvoicesParams,
                ...action.payload
            };
        },
        setLastTab: (state,action) => {
            state.lastTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch sale payments
            .addCase(fetchincomingPayments.pending, (state) => {
                state.incomingPaymentsLoading = true
            })
            .addCase(fetchincomingPayments.fulfilled, (state,action) => {
                state.incomingPayments = action.payload.data || action.payload;
                state.incomingPaymentsCount = action.payload.recordsTotal || 0;
                state.incomingPaymentsLoading = false
            })
            .addCase(fetchincomingPayments.rejected, (state,action) => {
                state.incomingPaymentsLoading = false
            })
            // fetch purchase payments
            .addCase(fetchOutgoingPayments.pending, (state) => {
                state.outgoingPaymentsLoading = true
            })
            .addCase(fetchOutgoingPayments.fulfilled, (state,action) => {
                state.outgoingPayments = action.payload.data || action.payload;
                state.outgoingPaymentsCount = action.payload.recordsTotal || 0;
                state.outgoingPaymentsLoading = false
            })
            .addCase(fetchOutgoingPayments.rejected, (state,action) => {
                state.outgoingPaymentsLoading = false
            })
    },
  
})

export const {setIncomingPaymentsLoading,setIncomingPaymentsParams,setOutgoingPaymentsLoading,setOutgoingPaymentsParams,setLastTab} = paymentSlice.actions;
export default paymentSlice.reducer;