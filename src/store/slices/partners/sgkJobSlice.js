import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    sgkJobs:[],
    sgkJobsCount:0,
    sgkJobsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    sgkJobsLoading:false,
}

export const fetchSgkJobs = createAsyncThunk('auth/fetchSgkJobs', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/partners/sgk_jobs/?ac=${activeCompany.id}`,
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

export const fetchSgkJobsForSelect = createAsyncThunk('data/fetchSgkJobsForSelect', async ({activeCompany,description}) => {
    const response = await axios.get(`/partners/sgk_jobs/?ac=${activeCompany.id}&description=${description}`,
        {
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
    });
    return response.data;
});


const sgkJobSlice = createSlice({
    name:"sgkJob",
    initialState,
    reducers:{
        setSgkJobsLoading: (state,action) => {
            state.sgkJobsLoading = action.payload;
        },
        setSgkJobsParams: (state,action) => {
            state.sgkJobsParams = {
                ...state.sgkJobsParams,
                ...action.payload
            };
        },
        resetSgkJobsParams: (state,action) => {
            state.sgkJobsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteSgkJobs: (state,action) => {
            state.sgkJobs = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSgkJobs.pending, (state) => {
                state.sgkJobsLoading = true
            })
            .addCase(fetchSgkJobs.fulfilled, (state,action) => {
                state.sgkJobs = action.payload.data || action.payload;
                state.sgkJobsCount = action.payload.recordsTotal || 0;
                state.sgkJobsLoading = false
            })
            .addCase(fetchSgkJobs.rejected, (state,action) => {
                state.sgkJobsLoading = false
            })
    },
  
})

export const {
    setSgkJobsLoading,
    setSgkJobsParams,
    deleteSgkJobs,
    resetSgkJobsParams,
} = sgkJobSlice.actions;
export default sgkJobSlice.reducer;