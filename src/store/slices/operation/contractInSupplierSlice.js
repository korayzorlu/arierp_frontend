import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    contractInSuppliers:[],
    contractInSuppliersCount:0,
    contractInSuppliersParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    contractInSuppliersLoading:false,
}

export const fetchContractInSuppliers = createAsyncThunk('auth/fetchContractInSuppliers', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/contract_in_suppliers/?active_company=${activeCompany.id}`,
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

const contractInSupplierSlice = createSlice({
    name:"contractInSupplier",
    initialState,
    reducers:{
        setContractInSuppliersLoading: (state,action) => {
            state.contractInSuppliersLoading = action.payload;
        },
        setContractInSuppliersParams: (state,action) => {
            state.contractInSuppliersParams = {
                ...state.contractInSuppliersParams,
                ...action.payload
            };
        },
        resetContractInSuppliersParams: (state,action) => {
            state.contractInSuppliersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContractInSuppliers.pending, (state) => {
                state.contractInSuppliersLoading = true
            })
            .addCase(fetchContractInSuppliers.fulfilled, (state,action) => {
                state.contractInSuppliers = action.payload.data || action.payload;
                state.contractInSuppliersCount = action.payload.recordsTotal || 0;
                state.contractInSuppliersLoading = false
            })
            .addCase(fetchContractInSuppliers.rejected, (state,action) => {
                state.contractInSuppliersLoading = false
            })
            
    },
  
})

export const {setContractInSuppliersLoading,setContractInSuppliersParams,resetContractInSuppliersParams} = contractInSupplierSlice.actions;
export default contractInSupplierSlice.reducer;