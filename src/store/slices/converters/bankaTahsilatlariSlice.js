import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bankaTahsilatlari:[],
    bankaTahsilatlariCount:0,
    bankaTahsilatlariParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankaTahsilatlariLoading:false,
}

export const fetchBankaTahsilatlari = createAsyncThunk('auth/fetchBankaTahsilatlari', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/converters/banka_tahsilatlari/?active_company=${activeCompany.id}`,
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

export const deleteBankaTahsilati = createAsyncThunk('auth/deleteBankaTahsilati', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/converters/delete_banka_tahsilati/`,
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
        navigate("/banka-tahsilatlari");
    }
});

const bankaTahsilatiSlice = createSlice({
    name:"bankaTahsilati",
    initialState,
    reducers:{
        setBankaTahsilatlariLoading: (state,action) => {
            state.bankaTahsilatlariLoading = action.payload;
        },
        setBankaTahsilatlariParams: (state,action) => {
            state.bankaTahsilatlariParams = {
                ...state.bankaTahsilatlariParams,
                ...action.payload
            };
        },
        deleteBankaTahsilatlari: (state,action) => {
            state.bankaTahsilatlari = [];
        },
    },
    extraReducers: (builder) => {
            builder
                .addCase(fetchBankaTahsilatlari.pending, (state) => {
                    state.bankaTahsilatlariLoading = true
                })
                .addCase(fetchBankaTahsilatlari.fulfilled, (state,action) => {
                    state.bankaTahsilatlari = action.payload.data || action.payload;
                    state.bankaTahsilatlariCount = action.payload.recordsTotal || 0;
                    state.bankaTahsilatlariLoading = false
                })
                .addCase(fetchBankaTahsilatlari.rejected, (state,action) => {
                    state.bankaTahsilatlariLoading = false
                })
        },
  
})

export const {setBankaTahsilatlariLoading,setBankaTahsilatlariParams,deleteBankaTahsilatlari} = bankaTahsilatiSlice.actions;
export default bankaTahsilatiSlice.reducer;