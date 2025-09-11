import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    blackListPersons:[],
    blackListPersonsCount:0,
    blackListPersonsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    blackListPersonsLoading:false,
}

export const fetchBlackListPersons = createAsyncThunk('auth/fetchBlackListPersons', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/compliance/black_list_persons/?ac=${activeCompany.id}`,
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

const blackListPersonSlice = createSlice({
    name:"blackListPerson",
    initialState,
    reducers:{
        setBlackListPersonsLoading: (state,action) => {
            state.blackListPersonsLoading = action.payload;
        },
        setBlackListPersonsParams: (state,action) => {
            state.blackListPersonsParams = {
                ...state.blackListPersonsParams,
                ...action.payload
            };
        },
        resetBlackListPersonsParams: (state,action) => {
            state.blackListPersonsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlackListPersons.pending, (state) => {
                state.blackListPersonsLoading = true
            })
            .addCase(fetchBlackListPersons.fulfilled, (state,action) => {
                state.blackListPersons = action.payload.data || action.payload;
                state.blackListPersonsCount = action.payload.recordsTotal || 0;
                state.blackListPersonsLoading = false
            })
            .addCase(fetchBlackListPersons.rejected, (state,action) => {
                state.blackListPersonsLoading = false
            })
            
    },
  
})

export const {setBlackListPersonsLoading,setBlackListPersonsParams,resetBlackListPersonsParams,deleteBlackListPersons,setBlackListPersonsOverdues} = blackListPersonSlice.actions;
export default blackListPersonSlice.reducer;