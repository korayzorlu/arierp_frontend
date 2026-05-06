import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    kepMonitorings:[],
    kepMonitoringsCount:0,
    kepMonitoringsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    kepMonitoringsLoading:false,
    kepMonitoringsWarnings: [],
    isKepMonitoringsWarnings: false,
    kepMonitoringsInfo: [],
    kepMonitoringsProjects: [],
    kepMonitoringsVendors: [],
}

export const fetchKepMonitorings = createAsyncThunk('auth/fetchKepMonitorings', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/kep_monitorings/?ac=${activeCompany.id}`,
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

const kepMonitoringSlice = createSlice({
    name:"kepMonitoring",
    initialState,
    reducers:{
        setKepMonitoringsLoading: (state,action) => {
            state.kepMonitoringsLoading = action.payload;
        },
        setKepMonitoringsParams: (state,action) => {
            state.kepMonitoringsParams = {
                ...state.kepMonitoringsParams,
                ...action.payload
            };
        },
        setIsKepMonitoringsWarnings: (state,action) => {
            state.isKepMonitoringsWarnings = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKepMonitorings.pending, (state) => {
                state.kepMonitoringsLoading = true
            })
            .addCase(fetchKepMonitorings.fulfilled, (state,action) => {
                state.kepMonitorings = action.payload.data || action.payload;
                state.kepMonitoringsCount = action.payload.recordsTotal || 0;
                state.kepMonitoringsWarnings = action.payload.warnings || [];
                state.kepMonitoringsInfo = action.payload.info || [];
                state.kepMonitoringsProjects = action.payload.projects || [];
                state.kepMonitoringsVendors = action.payload.vendors || [];
                state.kepMonitoringsLoading = false
            })
            .addCase(fetchKepMonitorings.rejected, (state,action) => {
                state.kepMonitoringsLoading = false
            })   
    },
  
})

export const {
    setKepMonitoringsLoading,
    setKepMonitoringsParams,
    setIsKepMonitoringsWarnings,
} = kepMonitoringSlice.actions;
export default kepMonitoringSlice.reducer;