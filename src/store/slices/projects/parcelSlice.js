import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    parcels:[],
    parcelsCount:0,
    parcelsParams:{
        // start: 0 * 50,
        // end: (0 + 1) * 50,
        format: 'datatables'
    },
    parcelsLoading:false,
}

export const fetchParcels = createAsyncThunk('auth/fetchParcels', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/projects/parcels/?ac=${activeCompany.id}`,
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

export const fetchParcel = createAsyncThunk('auth/fetchParcel', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/projects/parcels/?ac=${activeCompany.id}`,
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

const parcelSlice = createSlice({
    name:"parcel",
    initialState,
    reducers:{
        setParcelsLoading: (state,action) => {
            state.parcelsLoading = action.payload;
        },
        setParcelsParams: (state,action) => {
            state.parcelsParams = {
                ...state.parcelsParams,
                ...action.payload
            };
        },
        resetParcelsParams: (state,action) => {
            state.parcelsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchParcels.pending, (state) => {
                state.parcelsLoading = true
            })
            .addCase(fetchParcels.fulfilled, (state,action) => {
                state.parcels = action.payload.data || action.payload;
                state.parcelsCount = action.payload.recordsTotal || 0;
                state.parcelsLoading = false
            })
            .addCase(fetchParcels.rejected, (state,action) => {
                state.parcelsLoading = false
            })
            
    },
  
})

export const {setParcelsLoading,setParcelsParams,resetParcelsParams} = parcelSlice.actions;
export default parcelSlice.reducer;