import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bankaHareketleri:[],
    bankaHareketleriCount:0,
    bankaHareketleriParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankaHareketleriLoading:false,
}

export const fetchBankaHareketleri = createAsyncThunk('auth/fetchBankaHareketleri', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/converters/banka_hareketleri/?active_company=${activeCompany.id}`,
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

export const deleteBankaHareketi = createAsyncThunk('auth/deleteBankaHareketi', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/converters/delete_banka_hareketi/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(setIsProgress(false));
        dispatch(setDialog(false));
        navigate("/banka-hareketleri");
    }
});

const bankaHareketiSlice = createSlice({
    name:"bankaHareketi",
    initialState,
    reducers:{
        setBankaHareketleriLoading: (state,action) => {
            state.bankaHareketleriLoading = action.payload;
        },
        setBankaHareketleriParams: (state,action) => {
            state.bankaHareketleriParams = {
                ...state.bankaHareketleriParams,
                ...action.payload
            };
        },
        deleteBankaHareketleri: (state,action) => {
            state.bankaHareketleri = [];
        },
    },
    extraReducers: (builder) => {
            builder
                .addCase(fetchBankaHareketleri.pending, (state) => {
                    state.bankaHareketleriLoading = true
                })
                .addCase(fetchBankaHareketleri.fulfilled, (state,action) => {
                    state.bankaHareketleri = action.payload.data || action.payload;
                    state.bankaHareketleriCount = action.payload.recordsTotal || 0;
                    state.bankaHareketleriLoading = false
                })
                .addCase(fetchBankaHareketleri.rejected, (state,action) => {
                    state.bankaHareketleriLoading = false
                })
        },
  
})

export const {setBankaHareketleriLoading,setBankaHareketleriParams,deleteBankaHareketleri} = bankaHareketiSlice.actions;
export default bankaHareketiSlice.reducer;