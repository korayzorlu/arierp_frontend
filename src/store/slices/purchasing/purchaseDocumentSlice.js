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
    purchaseDocumentsWarnings: [],
    purchaseDocumentsInfo: [],
    purchaseDocumentsInPurchasePayment:[],
    purchaseDocumentsInPurchasePaymentCode:0,
    //
    purchaseDocumentVendors:[],
    purchaseDocumentVendorsCount:0,
    purchaseDocumentVendorsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    purchaseDocumentVendorsLoading:false,
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

export const fetchPurchaseDocumentVendors = createAsyncThunk('auth/fetchPurchaseDocumentVendors', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/purchasing/purchase_document_vendors/?ac=${activeCompany.id}`,
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
        //
        setPurchaseDocumentVendorsLoading: (state,action) => {
            state.purchaseDocumentVendorsLoading = action.payload;
        },
        setPurchaseDocumentVendorsParams: (state,action) => {
            state.purchaseDocumentVendorsParams = {
                ...state.purchaseDocumentVendorsParams,
                ...action.payload
            };
        },
        resetPurchaseDocumentVendorsParams: (state,action) => {
            state.purchaseDocumentVendorsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseDocuments.pending, (state) => {
                state.purchaseDocumentsLoading = true
            })
            .addCase(fetchPurchaseDocuments.fulfilled, (state,action) => {
                state.purchaseDocuments = action.payload.data || action.payload;
                state.purchaseDocumentsWarnings = action.payload.warnings || [];
                state.purchaseDocumentsInfo = action.payload.info || [];
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
            // vendors
            .addCase(fetchPurchaseDocumentVendors.pending, (state) => {
                state.purchaseDocumentVendorsLoading = true
            })
            .addCase(fetchPurchaseDocumentVendors.fulfilled, (state,action) => {
                state.purchaseDocumentVendors = action.payload.data || action.payload;
                state.purchaseDocumentVendorsCount = action.payload.recordsTotal || 0;
                state.purchaseDocumentVendorsLoading = false
            })
            .addCase(fetchPurchaseDocumentVendors.rejected, (state,action) => {
                state.purchaseDocumentVendorsLoading = false
            })
    },
  
})

export const {
    setPurchaseDocumentsLoading,
    setPurchaseDocumentsParams,
    resetPurchaseDocumentsParams,
    setPurchaseDocumentsInPurchasePaymentCode,
    setPurchaseDocumentVendorsLoading,
    setPurchaseDocumentVendorsParams,
    resetPurchaseDocumentVendorsParams
} = purchaseDocumentSlice.actions;
export default purchaseDocumentSlice.reducer;