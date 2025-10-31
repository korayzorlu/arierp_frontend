import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    titleDeeds:[],
    titleDeedsCount:0,
    titleDeedsParams:{
        // start: 0 * 50,
        // end: (0 + 1) * 50,
        format: 'datatables'
    },
    titleDeedsLoading:false,
}

export const fetchTitleDeeds = createAsyncThunk('auth/fetchTitleDeeds', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/projects/title_deeds/?ac=${activeCompany.id}`,
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

export const fetchTitleDeed = createAsyncThunk('auth/fetchTitleDeed', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/projects/title_deeds/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/real-estates");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

const titleDeedSlice = createSlice({
    name:"titleDeed",
    initialState,
    reducers:{
        setTitleDeedsLoading: (state,action) => {
            state.titleDeedsLoading = action.payload;
        },
        setTitleDeedsParams: (state,action) => {
            state.titleDeedsParams = {
                ...state.titleDeedsParams,
                ...action.payload
            };
        },
        resetTitleDeedsParams: (state,action) => {
            state.titleDeedsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTitleDeeds.pending, (state) => {
                state.titleDeedsLoading = true
            })
            .addCase(fetchTitleDeeds.fulfilled, (state,action) => {
                state.titleDeeds = action.payload.data || action.payload;
                state.titleDeedsCount = action.payload.recordsTotal || 0;
                state.titleDeedsLoading = false
            })
            .addCase(fetchTitleDeeds.rejected, (state,action) => {
                state.titleDeedsLoading = false
            })
            
    },
  
})

export const {setTitleDeedsLoading,setTitleDeedsParams,resetTitleDeedsParams} = titleDeedSlice.actions;
export default titleDeedSlice.reducer;