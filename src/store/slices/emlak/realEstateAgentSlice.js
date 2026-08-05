import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    realEstateAgents:[],
    realEstateAgentsCount:0,
    realEstateAgentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    realEstateAgentsLoading:false,
}

export const fetchRealEstateAgents = createAsyncThunk('auth/fetchRealEstateAgents', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/emlak/real_estate_agents/?ac=${activeCompany.id}`,
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



const realEstateAgentSlice = createSlice({
    name:"realEstateAgent",
    initialState,
    reducers:{
        setRealEstateAgentsLoading: (state,action) => {
            state.realEstateAgentsLoading = action.payload;
        },
        setRealEstateAgentsParams: (state,action) => {
            state.realEstateAgentsParams = {
                ...state.realEstateAgentsParams,
                ...action.payload
            };
        },
        resetRealEstateAgentsParams: (state,action) => {
            state.realEstateAgentsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRealEstateAgents.pending, (state) => {
                state.realEstateAgentsLoading = true
            })
            .addCase(fetchRealEstateAgents.fulfilled, (state,action) => {
                state.realEstateAgents = action.payload.data || action.payload;
                state.realEstateAgentsCount = action.payload.recordsTotal || 0;
                state.realEstateAgentsLoading = false
            })
            .addCase(fetchRealEstateAgents.rejected, (state,action) => {
                state.realEstateAgentsLoading = false
            })
    },
  
})

export const {
    setRealEstateAgentsLoading,
    setRealEstateAgentsParams,
    resetRealEstateAgentsParams,
    
} = realEstateAgentSlice.actions;
export default realEstateAgentSlice.reducer;