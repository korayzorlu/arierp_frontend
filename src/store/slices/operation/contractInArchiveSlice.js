import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    contractInArchives:[],
    contractInArchivesCount:0,
    contractInArchivesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    contractInArchivesLoading:false,
}

export const fetchContractInArchives = createAsyncThunk('auth/fetchContractInArchives', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/contract_in_archives/?active_company=${activeCompany.id}`,
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

const contractInArchiveSlice = createSlice({
    name:"contractInArchive",
    initialState,
    reducers:{
        setContractInArchivesLoading: (state,action) => {
            state.contractInArchivesLoading = action.payload;
        },
        setContractInArchivesParams: (state,action) => {
            state.contractInArchivesParams = {
                ...state.contractInArchivesParams,
                ...action.payload
            };
        },
        resetContractInArchivesParams: (state,action) => {
            state.contractInArchivesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContractInArchives.pending, (state) => {
                state.contractInArchivesLoading = true
            })
            .addCase(fetchContractInArchives.fulfilled, (state,action) => {
                state.contractInArchives = action.payload.data || action.payload;
                state.contractInArchivesCount = action.payload.recordsTotal || 0;
                state.contractInArchivesLoading = false
            })
            .addCase(fetchContractInArchives.rejected, (state,action) => {
                state.contractInArchivesLoading = false
            })
            
    },
  
})

export const {setContractInArchivesLoading,setContractInArchivesParams,resetContractInArchivesParams} = contractInArchiveSlice.actions;
export default contractInArchiveSlice.reducer;