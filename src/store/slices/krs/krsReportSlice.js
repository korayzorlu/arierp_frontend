import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    krsReports:[],
    krsReportsCount:0,
    krsReportsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsLoading:false,
}

export const fetchKrsReports = createAsyncThunk('auth/fetchKrsReports', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports/?ac=${activeCompany.id}`,
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

const krsReportSlice = createSlice({
    name:"krsReport",
    initialState,
    reducers:{
        setKrsReportsLoading: (state,action) => {
            state.krsReportsLoading = action.payload;
        },
        setKrsReportsParams: (state,action) => {
            state.krsReportsParams = {
                ...state.krsReportsParams,
                ...action.payload
            };
        },
        resetKrsReportsParams: (state,action) => {
            state.krsReportsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKrsReports.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReports.fulfilled, (state,action) => {
                state.krsReports = action.payload.data || action.payload;
                state.krsReportsCount = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReports.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
            
    },
  
})

export const {
    setKrsReportsLoading,
    setKrsReportsParams,
    resetKrsReportsParams,
} = krsReportSlice.actions;
export default krsReportSlice.reducer;