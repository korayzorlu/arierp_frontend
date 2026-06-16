import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    agentTasks:[],
    agentTasksCount:0,
    agentTasksParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    agentTasksLoading:false,
    agentRunning:false,
}

export const fetchAgentTasks = createAsyncThunk('auth/fetchAgentTasks', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/agent/agent_tasks/?ac=${activeCompany.id}`,
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




const agentTaskSlice = createSlice({
    name:"agentTask",
    initialState,
    reducers:{
        setAgentTasksLoading: (state,action) => {
            state.agentTasksLoading = action.payload;
        },
        setAgentTasksParams: (state,action) => {
            state.agentTasksParams = {
                ...state.agentTasksParams,
                ...action.payload
            };
        },
        resetAgentTasksParams: (state,action) => {
            state.agentTasksParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        setAgentRunning: (state,action) => {
            state.agentRunning = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgentTasks.pending, (state) => {
                state.agentTasksLoading = true
            })
            .addCase(fetchAgentTasks.fulfilled, (state,action) => {
                state.agentTasks = action.payload.data || action.payload;
                state.agentTasksCount = action.payload.recordsTotal || 0;
                state.agentRunning = (action.payload.data || action.payload).filter(item => item.running).length > 0;
                state.agentTasksLoading = false
            })
            .addCase(fetchAgentTasks.rejected, (state,action) => {
                state.agentTasksLoading = false
            })
            
    },
  
})

export const {
    setAgentTasksLoading,
    setAgentTasksParams,
    resetAgentTasksParams,
    setAgentRunning,
} = agentTaskSlice.actions;
export default agentTaskSlice.reducer;