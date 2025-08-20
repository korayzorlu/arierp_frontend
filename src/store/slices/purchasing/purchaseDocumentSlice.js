import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    purchaseDocuments:[],
    purchaseDocumentsCount:0,
    purchaseDocumentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    purchaseDocumentsLoading:false,
    purchaseDocumentsInPurchasePayment:[],
    purchaseDocumentsInPurchasePaymentCode:0,
}

export const fetchPurchaseDocuments = createAsyncThunk('auth/fetchPurchaseDocuments', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/purchasing/purchase_documents/?active_company=${activeCompany.id}`,
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

export const fetchPurchaseDocument = createAsyncThunk('auth/fetchPurchaseDocument', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/purchasing/purchase_documents/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/purchaseDocuments");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const fetchPurchaseDocumentsInPurchasePayment = createAsyncThunk('organization/fetchPurchaseDocumentsInPurchasePayment', async ({activeCompany,lease_code}) => {
    const response = await axios.get(`/purchasing/purchase_documents/?active_company=${activeCompany.id}&lease=${lease_code}`, {withCredentials: true});
    return response.data;
});

const purchaseDocumentSlice = createSlice({
    name:"purchaseDocument",
    initialState,
    reducers:{
        setPurchaseDocumentsLoading: (state,action) => {
            state.purchaseDocumentsLoading = action.payload;
        },
        setPurchaseDocumentsParams: (state,action) => {
            state.purchaseDocumentsParams = {
                ...state.purchaseDocumentsParams,
                ...action.payload
            };
        },
        resetPurchaseDocumentsParams: (state,action) => {
            state.purchaseDocumentsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        setPurchaseDocumentsInPurchasePaymentCode: (state,action) => {
            state.purchaseDocumentsInPurchasePaymentCode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseDocuments.pending, (state) => {
                state.purchaseDocumentsLoading = true
            })
            .addCase(fetchPurchaseDocuments.fulfilled, (state,action) => {
                state.purchaseDocuments = action.payload.data || action.payload;
                state.purchaseDocumentsCount = action.payload.recordsTotal || 0;
                state.purchaseDocumentsLoading = false
            })
            .addCase(fetchPurchaseDocuments.rejected, (state,action) => {
                state.purchaseDocumentsLoading = false
            })
            //fetch warning notices in lease
            .addCase(fetchPurchaseDocumentsInPurchasePayment.pending, (state) => {
                state.purchaseDocumentsLoading = true;
            })
            .addCase(fetchPurchaseDocumentsInPurchasePayment.fulfilled, (state,action) => {
                state.purchaseDocumentsInPurchasePayment = action.payload;
                state.purchaseDocumentsLoading = false;
            })
            .addCase(fetchPurchaseDocumentsInPurchasePayment.rejected, (state,action) => {
                state.purchaseDocumentsLoading = false;
            })
    },
  
})

export const {setPurchaseDocumentsLoading,setPurchaseDocumentsParams,resetPurchaseDocumentsParams,setPurchaseDocumentsInPurchasePaymentCode} = purchaseDocumentSlice.actions;
export default purchaseDocumentSlice.reducer;