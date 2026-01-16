import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    pepPartners:[],
    pepPartnersCount:0,
    pepPartnersParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    pepPartnersLoading:false,
    scanning:false,
}

export const fetchPepPartners = createAsyncThunk('auth/fetchPepPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/compliance/pep_partners/?ac=${activeCompany.id}`,
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

const pepPartnerSlice = createSlice({
    name:"pepPartner",
    initialState,
    reducers:{
        setPepPartnersLoading: (state,action) => {
            state.pepPartnersLoading = action.payload;
        },
        setPepPartnersParams: (state,action) => {
            state.pepPartnersParams = {
                ...state.pepPartnersParams,
                ...action.payload
            };
        },
        resetPepPartnersParams: (state,action) => {
            state.pepPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        setScanning: (state,action) => {
            state.scanning = action.payload;
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPepPartners.pending, (state) => {
                state.pepPartnersLoading = true
            })
            .addCase(fetchPepPartners.fulfilled, (state,action) => {
                state.pepPartners = action.payload.data || action.payload;
                state.pepPartnersCount = action.payload.recordsTotal || 0;
                state.pepPartnersLoading = false
            })
            .addCase(fetchPepPartners.rejected, (state,action) => {
                state.pepPartnersLoading = false
            })
            
    },
  
})

export const {
    setPepPartnersLoading,
    setPepPartnersParams,
    resetPepPartnersParams,
    deletePepPartners,
    setPepPartnersOverdues,
    setScanning
} = pepPartnerSlice.actions;
export default pepPartnerSlice.reducer;