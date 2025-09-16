import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    scanPartners:[],
    scanPartnersCount:0,
    scanPartnersParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    scanPartnersLoading:false,
    scanning:false,
}

export const fetchScanPartners = createAsyncThunk('auth/fetchScanPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/compliance/scan_partners/?ac=${activeCompany.id}`,
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

const scanPartnerSlice = createSlice({
    name:"scanPartner",
    initialState,
    reducers:{
        setScanPartnersLoading: (state,action) => {
            state.scanPartnersLoading = action.payload;
        },
        setScanPartnersParams: (state,action) => {
            state.scanPartnersParams = {
                ...state.scanPartnersParams,
                ...action.payload
            };
        },
        resetScanPartnersParams: (state,action) => {
            state.scanPartnersParams = {
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
            .addCase(fetchScanPartners.pending, (state) => {
                state.scanPartnersLoading = true
            })
            .addCase(fetchScanPartners.fulfilled, (state,action) => {
                state.scanPartners = action.payload.data || action.payload;
                state.scanPartnersCount = action.payload.recordsTotal || 0;
                state.scanPartnersLoading = false
            })
            .addCase(fetchScanPartners.rejected, (state,action) => {
                state.scanPartnersLoading = false
            })
            
    },
  
})

export const {
    setScanPartnersLoading,
    setScanPartnersParams,
    resetScanPartnersParams,
    deleteScanPartners,
    setScanPartnersOverdues,
    setScanning
} = scanPartnerSlice.actions;
export default scanPartnerSlice.reducer;