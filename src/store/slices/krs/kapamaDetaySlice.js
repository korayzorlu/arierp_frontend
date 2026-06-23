import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    kapamaDetaylari:[],
    kapamaDetaylariCount:0,
    kapamaDetaylariParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    kapamaDetaylariLoading:false,
}

export const fetchKapamaDetaylari = createAsyncThunk('auth/fetchKapamaDetaylari', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/kapama_detaylari/?ac=${activeCompany.id}`,
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

const kapamaDetaySlice = createSlice({
    name:"kapamaDetay",
    initialState,
    reducers:{
        setKapamaDetaylariLoading: (state,action) => {
            state.kapamaDetaylariLoading = action.payload;
        },
        setKapamaDetaylariParams: (state,action) => {
            state.kapamaDetaylariParams = {
                ...state.kapamaDetaylariParams,
                ...action.payload
            };
        },
        resetKapamaDetaylariParams: (state,action) => {
            state.kapamaDetaylariParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKapamaDetaylari.pending, (state) => {
                state.kapamaDetaylariLoading = true
            })
            .addCase(fetchKapamaDetaylari.fulfilled, (state,action) => {
                state.kapamaDetaylari = action.payload.data || action.payload;
                state.kapamaDetaylariCount = action.payload.recordsTotal || 0;
                state.kapamaDetaylariLoading = false
            })
            .addCase(fetchKapamaDetaylari.rejected, (state,action) => {
                state.kapamaDetaylariLoading = false
            })
            
    },
  
})

export const {
    setKapamaDetaylariLoading,
    setKapamaDetaylariParams,
    resetKapamaDetaylariParams,
} = kapamaDetaySlice.actions;
export default kapamaDetaySlice.reducer;