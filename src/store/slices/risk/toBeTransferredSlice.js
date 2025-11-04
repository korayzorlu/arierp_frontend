import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    toBeTransferreds:[],
    toBeTransferredsCount:0,
    toBeTransferredsParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    toBeTransferredsLoading:false,
}

export const fetchToBeTransferreds = createAsyncThunk('auth/fetchToBeTransferreds', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/to_be_transferred/?ac=${activeCompany.id}`,
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



const toBeTransferredSlice = createSlice({
    name:"toBeTransferred",
    initialState,
    reducers:{
        setToBeTransferredsLoading: (state,action) => {
            state.toBeTransferredsLoading = action.payload;
        },
        setToBeTransferredsParams: (state,action) => {
            state.toBeTransferredsParams = {
                ...state.toBeTransferredsParams,
                ...action.payload
            };
        },
        resetToBeTransferredsParams: (state,action) => {
            state.toBeTransferredsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchToBeTransferreds.pending, (state) => {
                state.toBeTransferredsLoading = true
            })
            .addCase(fetchToBeTransferreds.fulfilled, (state,action) => {
                state.toBeTransferreds = action.payload.data || action.payload;
                state.toBeTransferredsCount = action.payload.recordsTotal || 0;
                state.toBeTransferredsLoading = false
            })
            .addCase(fetchToBeTransferreds.rejected, (state,action) => {
                state.toBeTransferredsLoading = false
            })
    },
  
})

export const {
    setToBeTransferredsLoading,
    setToBeTransferredsParams,
    resetToBeTransferredsParams,
} = toBeTransferredSlice.actions;
export default toBeTransferredSlice.reducer;