import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    titleDeedInvoiceControls:[],
    titleDeedInvoiceControlsCount:0,
    titleDeedInvoiceControlsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    titleDeedInvoiceControlsLoading:false,
    titleDeedInvoiceControlsWarnings: [],
    isTitleDeedInvoiceControlsWarnings: false,
    titleDeedInvoiceControlsInfo: [],
    titleDeedInvoiceControlsProjects: [],
    titleDeedInvoiceControlsVendors: [],
}

export const fetchTitleDeedInvoiceControls = createAsyncThunk('auth/fetchTitleDeedInvoiceControls', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/title_deed_invoice_controls/?ac=${activeCompany.id}`,
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

const titleDeedInvoiceControlSlice = createSlice({
    name:"titleDeedInvoiceControl",
    initialState,
    reducers:{
        setTitleDeedInvoiceControlsLoading: (state,action) => {
            state.titleDeedInvoiceControlsLoading = action.payload;
        },
        setTitleDeedInvoiceControlsParams: (state,action) => {
            state.titleDeedInvoiceControlsParams = {
                ...state.titleDeedInvoiceControlsParams,
                ...action.payload
            };
        },
        setIsTitleDeedInvoiceControlsWarnings: (state,action) => {
            state.isTitleDeedInvoiceControlsWarnings = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTitleDeedInvoiceControls.pending, (state) => {
                state.titleDeedInvoiceControlsLoading = true
            })
            .addCase(fetchTitleDeedInvoiceControls.fulfilled, (state,action) => {
                state.titleDeedInvoiceControls = action.payload.data || action.payload;
                state.titleDeedInvoiceControlsCount = action.payload.recordsTotal || 0;
                state.titleDeedInvoiceControlsWarnings = action.payload.warnings || [];
                state.titleDeedInvoiceControlsInfo = action.payload.info || [];
                state.titleDeedInvoiceControlsProjects = action.payload.projects || [];
                state.titleDeedInvoiceControlsVendors = action.payload.vendors || [];
                state.titleDeedInvoiceControlsLoading = false
            })
            .addCase(fetchTitleDeedInvoiceControls.rejected, (state,action) => {
                state.titleDeedInvoiceControlsLoading = false
            })   
    },
  
})

export const {
    setTitleDeedInvoiceControlsLoading,
    setTitleDeedInvoiceControlsParams,
    setIsTitleDeedInvoiceControlsWarnings,
} = titleDeedInvoiceControlSlice.actions;
export default titleDeedInvoiceControlSlice.reducer;