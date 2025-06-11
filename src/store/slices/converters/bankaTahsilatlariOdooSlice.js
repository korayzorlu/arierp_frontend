import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bankaTahsilatlariOdoo:[],
    bankaTahsilatlariOdooCount:0,
    bankaTahsilatlariOdooParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankaTahsilatlariOdooLoading:false,
}

export const fetchBankaTahsilatlariOdoo = createAsyncThunk('converters/fetchBankaTahsilatlariOdoo', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/converters/banka_tahsilatlari_odoo/?active_company=${activeCompany.id}`,
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

export const deleteBankaTahsilatiOdoo = createAsyncThunk('converters/deleteBankaTahsilatiOdoo', async ({data=null},{dispatch,extra: {navigate}}) => {
    console.log("srg")
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/converters/delete_banka_tahsilati_odoo/`,
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
        navigate("/banka--tahsilatlari-odoo");
    }
});

export const fixBankaTahsilatlariOdoo = createAsyncThunk('converters/fixBankaTahsilatlariOdoo', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/converters/fix_banka_tahsilatlari_odoo/`,
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
        navigate("/banka--tahsilatlari-odoo");
    }
});

const bankaTahsilatiOdooSlice = createSlice({
    name:"bankaTahsilatiOdoo",
    initialState,
    reducers:{
        setBankaTahsilatlariOdooLoading: (state,action) => {
            state.bankaTahsilatlariOdooLoading = action.payload;
        },
        setBankaTahsilatlariOdooParams: (state,action) => {
            state.bankaTahsilatlariOdooParams = {
                ...state.bankaTahsilatlariOdooParams,
                ...action.payload
            };
        },
        deleteBankaTahsilatlariOdoo: (state,action) => {
            state.bankaTahsilatlariOdoo = [];
        },
    },
    extraReducers: (builder) => {
            builder
                .addCase(fetchBankaTahsilatlariOdoo.pending, (state) => {
                    state.bankaTahsilatlariLoading = true
                })
                .addCase(fetchBankaTahsilatlariOdoo.fulfilled, (state,action) => {
                    state.bankaTahsilatlariOdoo = action.payload.data || action.payload;
                    state.bankaTahsilatlariOdooCount = action.payload.recordsTotal || 0;
                    state.bankaTahsilatlariOdooLoading = false
                })
                .addCase(fetchBankaTahsilatlariOdoo.rejected, (state,action) => {
                    state.bankaTahsilatlariOdooLoading = false
                })
        },
  
})

export const {setBankaTahsilatlariOdooLoading,setBankaTahsilatlariOdooParams,deleteBankaTahsilatlariOdoo} = bankaTahsilatiOdooSlice.actions;
export default bankaTahsilatiOdooSlice.reducer;