import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    purchaseDocumentItems:[],
    purchaseDocumentItemsCount:0,
    purchaseDocumentItemsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    purchaseDocumentItemsLoading:false,
    purchaseDocumentItemsInPurchasePayment:[],
    purchaseDocumentItemsInPurchasePaymentCode:0,
}

export const fetchPurchaseDocumentItems = createAsyncThunk('auth/fetchPurchaseDocumentItems', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/purchasing/purchase_document_items/?active_company=${activeCompany.id}`,
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

export const fetchPurchaseDocumentItem = createAsyncThunk('auth/fetchPurchaseDocumentItem', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/purchasing/purchase_document_items/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/purchaseDocumentItems");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const fetchPurchaseDocumentItemsInPurchasePayment = createAsyncThunk('organization/fetchPurchaseDocumentItemsInPurchasePayment', async ({activeCompany,lease_code}) => {
    const response = await axios.get(`/purchasing/purchase_document_items/?active_company=${activeCompany.id}&lease=${lease_code}`, {withCredentials: true});
    return response.data;
});

const purchaseDocumentItemSlice = createSlice({
    name:"purchaseDocumentItem",
    initialState,
    reducers:{
        setPurchaseDocumentItemsLoading: (state,action) => {
            state.purchaseDocumentItemsLoading = action.payload;
        },
        setPurchaseDocumentItemsParams: (state,action) => {
            state.purchaseDocumentItemsParams = {
                ...state.purchaseDocumentItemsParams,
                ...action.payload
            };
        },
        resetPurchaseDocumentItemsParams: (state,action) => {
            state.purchaseDocumentItemsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseDocumentItems.pending, (state) => {
                state.purchaseDocumentItemsLoading = true
            })
            .addCase(fetchPurchaseDocumentItems.fulfilled, (state,action) => {
                state.purchaseDocumentItems = action.payload.data || action.payload;
                state.purchaseDocumentItemsCount = action.payload.recordsTotal || 0;
                state.purchaseDocumentItemsLoading = false
            })
            .addCase(fetchPurchaseDocumentItems.rejected, (state,action) => {
                state.purchaseDocumentItemsLoading = false
            })
    },
  
})

export const {
    setPurchaseDocumentItemsLoading,
    setPurchaseDocumentItemsParams,
    resetPurchaseDocumentItemsParams
} = purchaseDocumentItemSlice.actions;
export default purchaseDocumentItemSlice.reducer;