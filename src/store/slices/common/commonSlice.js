import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    exchangeRates:[],
    exchangeRatesCount:0,
    exchangeRatesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    exchangeRatesLoading:false,

}

export const fetchObjects = createAsyncThunk('auth/fetchObjects', async ({activeCompany=null,app=null,model=null,params=null}) => {
    try {
        const response = await axios.get(`/${app}/api/${model.toLower()}s/${activeCompany ? `?ac=${activeCompany.id}` : ''}`,
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

export const fetchExchangeRates = createAsyncThunk('auth/fetchExchangeRates', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/common/api/exchange_rates/`,
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


const commonSlice = createSlice({
    name:"common",
    initialState,
    reducers:{
        setExchangeRatesLoading: (state,action) => {
            state.exchangeRatesLoading = action.payload;
        },
        setExchangeRatesParams: (state,action) => {
            state.exchangeRatesParams = {
                ...state.exchangeRatesParams,
                ...action.payload
            };
        },
        resetExchangeRatesParams: (state,action) => {
            state.exchangeRatesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteExchangeRates: (state,action) => {
            state.exchangeRates = [];
        },
    },
  
})

export const {
    setPartnersLoading,
    setPartnersParams,
    deletePartners,
    setExchangeRatesLoading,
    setExchangeRatesParams,
    resetExchangeRatesParams,
    deleteExchangeRates
} = commonSlice.actions;
export default commonSlice.reducer;