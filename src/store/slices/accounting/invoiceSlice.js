import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlert, setDialog } from "../notificationSlice";
import { setIsProgress } from "../processSlice";
import { set } from "lodash";

const initialState = {
    //sale
    saleInvoices:[],
    saleInvoicesCount:0,
    saleInvoicesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    saleInvoicesLoading:false,
    //purchase
    purchaseInvoices:[],
    purchaseInvoicesCount:0,
    purchaseInvoicesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    purchaseInvoicesLoading:false,
    //
    lastTab:0,
    //invoice
    invoices:[],
    invoicesCount:0,
    invoicesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    invoicesLoading:false,
}

export const fetchInvoices = createAsyncThunk('auth/fetchInvoices', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/invoices/?ac=${activeCompany.id}&type=sale`,
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

export const fetchSaleInvoices = createAsyncThunk('auth/fetchSaleInvoices', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/invoices/?active_company=${activeCompany.id}&type=sale`,
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

export const fetchPurchaseInvoices = createAsyncThunk('auth/fetchPurchaseInvoices', async ({activeCompany,params=null}) => {
    try {
        const response = await axios.get(`/accounting/invoices/?active_company=${activeCompany.id}&type=purchase`,
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

export const fetchInvoice = createAsyncThunk('auth/fetchInvoice', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/invoices/?active_company=${activeCompany.id}`,
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

export const addInvoice = createAsyncThunk('auth/addInvoice', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/add_invoice/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/invoices");
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

export const updateInvoice = createAsyncThunk('auth/updateInvoice', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/update_invoice/`,
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

export const deleteInvoice = createAsyncThunk('auth/deleteInvoice', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/accounting/delete_invoice/`,
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
        navigate("/invoices");
    }
});

const invoiceSlice = createSlice({
    name:"invoice",
    initialState,
    reducers:{
        setSaleInvoicesLoading: (state,action) => {
            state.saleInvoicesLoading = action.payload;
        },
        setSaleInvoicesParams: (state,action) => {
            state.saleInvoicesParams = {
                ...state.saleInvoicesParams,
                ...action.payload
            };
        },
        setPurchaseInvoicesLoading: (state,action) => {
            state.purchaseInvoicesLoading = action.payload;
        },
        setPurchaseInvoicesParams: (state,action) => {
            state.purchaseInvoicesParams = {
                ...state.purchaseInvoicesParams,
                ...action.payload
            };
        },
        setLastTab: (state,action) => {
            state.lastTab = action.payload;
        },
        setInvoicesLoading: (state,action) => {
            state.invoicesLoading = action.payload;
        },
        setInvoicesParams: (state,action) => {
            state.invoicesParams = {
                ...state.invoicesParams,
                ...action.payload
            };
        },
        resetInvoicesParams: (state,action) => {
            state.invoicesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },

    },
    extraReducers: (builder) => {
        builder
            // fetch sale invoices
            .addCase(fetchSaleInvoices.pending, (state) => {
                state.saleInvoicesLoading = true
            })
            .addCase(fetchSaleInvoices.fulfilled, (state,action) => {
                state.saleInvoices = action.payload.data || action.payload;
                state.saleInvoicesCount = action.payload.recordsTotal || 0;
                state.saleInvoicesLoading = false
            })
            .addCase(fetchSaleInvoices.rejected, (state,action) => {
                state.saleInvoicesLoading = false
            })
            // fetch purchase invoices
            .addCase(fetchPurchaseInvoices.pending, (state) => {
                state.purchaseInvoicesLoading = true
            })
            .addCase(fetchPurchaseInvoices.fulfilled, (state,action) => {
                state.purchaseInvoices = action.payload.data || action.payload;
                state.purchaseInvoicesCount = action.payload.recordsTotal || 0;
                state.purchaseInvoicesLoading = false
            })
            .addCase(fetchPurchaseInvoices.rejected, (state,action) => {
                state.purchaseInvoicesLoading = false
            })
            // fetch invoices
            .addCase(fetchInvoices.pending, (state) => {
                state.invoicesLoading = true
            })
            .addCase(fetchInvoices.fulfilled, (state,action) => {
                state.invoices = action.payload.data || action.payload;
                state.invoicesCount = action.payload.recordsTotal || 0;
                state.invoicesLoading = false
            })
            .addCase(fetchInvoices.rejected, (state,action) => {
                state.invoicesLoading = false
            })
    },
  
})

export const {
    setSaleInvoicesLoading,
    setSaleInvoicesParams,
    setPurchaseInvoicesLoading,
    setPurchaseInvoicesParams,
    setLastTab,
    setInvoicesLoading,
    setInvoicesParams,
    resetInvoicesParams
} = invoiceSlice.actions;
export default invoiceSlice.reducer;