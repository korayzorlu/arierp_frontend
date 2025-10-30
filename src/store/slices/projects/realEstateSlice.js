import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    realEstates:[],
    realEstatesCount:0,
    realEstatesParams:{
        // start: 0 * 50,
        // end: (0 + 1) * 50,
        format: 'datatables'
    },
    realEstatesLoading:false,
}

export const fetchRealEstates = createAsyncThunk('auth/fetchRealEstates', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/projects/real_estates/?ac=${activeCompany.id}`,
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

export const fetchRealEstate = createAsyncThunk('auth/fetchRealEstate', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/projects/real_estates/?ac=${activeCompany.id}`,
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

const realEstateSlice = createSlice({
    name:"realEstate",
    initialState,
    reducers:{
        setRealEstatesLoading: (state,action) => {
            state.realEstatesLoading = action.payload;
        },
        setRealEstatesParams: (state,action) => {
            state.realEstatesParams = {
                ...state.realEstatesParams,
                ...action.payload
            };
        },
        resetRealEstatesParams: (state,action) => {
            state.realEstatesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRealEstates.pending, (state) => {
                state.realEstatesLoading = true
            })
            .addCase(fetchRealEstates.fulfilled, (state,action) => {
                state.realEstates = action.payload.data || action.payload;
                state.realEstatesCount = action.payload.recordsTotal || 0;
                state.realEstatesLoading = false
            })
            .addCase(fetchRealEstates.rejected, (state,action) => {
                state.realEstatesLoading = false
            })
            
    },
  
})

export const {setRealEstatesLoading,setRealEstatesParams,resetRealEstatesParams} = realEstateSlice.actions;
export default realEstateSlice.reducer;