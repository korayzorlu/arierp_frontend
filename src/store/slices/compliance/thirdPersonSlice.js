import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    thirdPersons:[],
    thirdPersonsCount:0,
    thirdPersonsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    thirdPersonsLoading:false,
    scanning:false,
}

export const fetchThirdPersons = createAsyncThunk('auth/fetchThirdPersons', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/compliance/third_persons/?ac=${activeCompany.id}`,
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

const thirdPersonSlice = createSlice({
    name:"thirdPerson",
    initialState,
    reducers:{
        setThirdPersonsLoading: (state,action) => {
            state.thirdPersonsLoading = action.payload;
        },
        setThirdPersonsParams: (state,action) => {
            state.thirdPersonsParams = {
                ...state.thirdPersonsParams,
                ...action.payload
            };
        },
        resetThirdPersonsParams: (state,action) => {
            state.thirdPersonsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        setScanning: (state,action) => {
            state.scanning = action.payload;
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchThirdPersons.pending, (state) => {
                state.thirdPersonsLoading = true
            })
            .addCase(fetchThirdPersons.fulfilled, (state,action) => {
                state.thirdPersons = action.payload.data || action.payload;
                state.thirdPersonsCount = action.payload.recordsTotal || 0;
                state.thirdPersonsLoading = false
            })
            .addCase(fetchThirdPersons.rejected, (state,action) => {
                state.thirdPersonsLoading = false
            })
            
    },
  
})

export const {
    setThirdPersonsLoading,
    setThirdPersonsParams,
    resetThirdPersonsParams,
    deleteThirdPersons,
    setThirdPersonsOverdues,
    setScanning
} = thirdPersonSlice.actions;
export default thirdPersonSlice.reducer;