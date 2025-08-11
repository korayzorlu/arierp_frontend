import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    purchasePayments:[],
    purchasePaymentsCount:0,
    purchasePaymentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    purchasePaymentsLoading:false,
}

export const fetchPurchasePayments = createAsyncThunk('auth/fetchPurchasePayments', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/purchasing/purchase_payments/?active_company=${activeCompany.id}`,
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

export const fetchPurchasePayment = createAsyncThunk('auth/fetchPurchasePayment', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/purchasing/purchase_payments/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/purchasePayments");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

const purchasePaymentSlice = createSlice({
    name:"purchasePayment",
    initialState,
    reducers:{
        setPurchasePaymentsLoading: (state,action) => {
            state.purchasePaymentsLoading = action.payload;
        },
        setPurchasePaymentsParams: (state,action) => {
            state.purchasePaymentsParams = {
                ...state.purchasePaymentsParams,
                ...action.payload
            };
        },
        resetPurchasePaymentsParams: (state,action) => {
            state.purchasePaymentsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchasePayments.pending, (state) => {
                state.purchasePaymentsLoading = true
            })
            .addCase(fetchPurchasePayments.fulfilled, (state,action) => {
                state.purchasePayments = action.payload.data || action.payload;
                state.purchasePaymentsCount = action.payload.recordsTotal || 0;
                state.purchasePaymentsLoading = false
            })
            .addCase(fetchPurchasePayments.rejected, (state,action) => {
                state.purchasePaymentsLoading = false
            })
            
    },
  
})

export const {setPurchasePaymentsLoading,setPurchasePaymentsParams,resetPurchasePaymentsParams} = purchasePaymentSlice.actions;
export default purchasePaymentSlice.reducer;