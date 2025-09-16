import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    contractInProcesss:[],
    contractInProcesssCount:0,
    contractInProcesssParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    contractInProcesssLoading:false,
}

export const fetchContractInProcesss = createAsyncThunk('auth/fetchContractInProcesss', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/contract_in_processs/?active_company=${activeCompany.id}`,
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

const contractInProcessSlice = createSlice({
    name:"contractInProcess",
    initialState,
    reducers:{
        setContractInProcesssLoading: (state,action) => {
            state.contractInProcesssLoading = action.payload;
        },
        setContractInProcesssParams: (state,action) => {
            state.contractInProcesssParams = {
                ...state.contractInProcesssParams,
                ...action.payload
            };
        },
        resetContractInProcesssParams: (state,action) => {
            state.contractInProcesssParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContractInProcesss.pending, (state) => {
                state.contractInProcesssLoading = true
            })
            .addCase(fetchContractInProcesss.fulfilled, (state,action) => {
                state.contractInProcesss = action.payload.data || action.payload;
                state.contractInProcesssCount = action.payload.recordsTotal || 0;
                state.contractInProcesssLoading = false
            })
            .addCase(fetchContractInProcesss.rejected, (state,action) => {
                state.contractInProcesssLoading = false
            })
            
    },
  
})

export const {setContractInProcesssLoading,setContractInProcesssParams,resetContractInProcesssParams} = contractInProcessSlice.actions;
export default contractInProcessSlice.reducer;