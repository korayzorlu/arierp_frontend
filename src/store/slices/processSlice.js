import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    progress:{display:false,value:0},
    importProcesses:[],
    importProcessLoading:false,
    exportProcesses:[],
    exportProcessLoading:false,
    isProgress:false,
}

export const fetchImportProcess = createAsyncThunk('process/fetchImportProcess', async () => {
    const response = await axios.get(`/common/api/import_processes/`, {withCredentials: true});

    return response.data;
});

export const fetchExportProcess = createAsyncThunk('process/fetchExportProcess', async () => {
    const response = await axios.get(`/common/api/export_processes/`, {withCredentials: true});

    return response.data;
});


const processSlice = createSlice({
    name:"process",
    initialState,
    reducers:{
        setImportProgress: (state,action) => {
            state.importProcesses = state.importProcesses.map(item => item.task_id === action.payload.task ? {...item, progress:action.payload.progress} : item)
        },
        setExportProgress: (state,action) => {
            state.exportProcesses = state.exportProcesses.map(item => item.task_id === action.payload.task ? {...item, progress:action.payload.progress} : item)
        },
        clearProgress: (state,action) => {
            state.progress = "";
        },
        setIsProgress: (state,action) => {
            state.isProgress = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch import processes
            .addCase(fetchImportProcess.pending, (state) => {
                state.importProcessLoading = true;
            })
            .addCase(fetchImportProcess.fulfilled, (state,action) => {
                state.importProcesses = action.payload;
                state.importProcessLoading = false;
            })
            .addCase(fetchImportProcess.rejected, (state,action) => {
                state.importProcessLoading = false;
            })
            //fetch export processes
            .addCase(fetchExportProcess.pending, (state) => {
                state.exportProcessLoading = true;
            })
            .addCase(fetchExportProcess.fulfilled, (state,action) => {
                state.exportProcesses = action.payload;
                state.exportProcessLoading = false;
            })
            .addCase(fetchExportProcess.rejected, (state,action) => {
                state.exportProcessLoading = false;
            })
    },
  
})

export const {setImportProgress,setExportProgress,clearProgress,setIsProgress} = processSlice.actions;
export default processSlice.reducer;