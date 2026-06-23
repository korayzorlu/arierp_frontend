import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    kapamaHareketleri:[],
    kapamaHareketleriCount:0,
    kapamaHareketleriParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    kapamaHareketleriLoading:false,
}

export const fetchKapamaHareketleri = createAsyncThunk('auth/fetchKapamaHareketleri', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/kapama_hareketleri/?ac=${activeCompany.id}`,
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

const kapamaHareketiSlice = createSlice({
    name:"kapamaHareketi",
    initialState,
    reducers:{
        setKapamaHareketleriLoading: (state,action) => {
            state.kapamaHareketleriLoading = action.payload;
        },
        setKapamaHareketleriParams: (state,action) => {
            state.kapamaHareketleriParams = {
                ...state.kapamaHareketleriParams,
                ...action.payload
            };
        },
        resetKapamaHareketleriParams: (state,action) => {
            state.kapamaHareketleriParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKapamaHareketleri.pending, (state) => {
                state.kapamaHareketleriLoading = true
            })
            .addCase(fetchKapamaHareketleri.fulfilled, (state,action) => {
                state.kapamaHareketleri = action.payload.data || action.payload;
                state.kapamaHareketleriCount = action.payload.recordsTotal || 0;
                state.kapamaHareketleriLoading = false
            })
            .addCase(fetchKapamaHareketleri.rejected, (state,action) => {
                state.kapamaHareketleriLoading = false
            })
            
    },
  
})

export const {
    setKapamaHareketleriLoading,
    setKapamaHareketleriParams,
    resetKapamaHareketleriParams,
} = kapamaHareketiSlice.actions;
export default kapamaHareketiSlice.reducer;