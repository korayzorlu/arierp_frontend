import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    partnerAdvances:[],
    partnerAdvancesCount:0,
    partnerAdvancesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerAdvancesLoading:false,
}

export const fetchPartnerAdvances = createAsyncThunk('auth/fetchPartnerAdvances', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/partner_advances/?ac=${activeCompany.id}`,
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

const partnerAdvanceSlice = createSlice({
    name:"partnerAdvance",
    initialState,
    reducers:{
        setPartnerAdvancesLoading: (state,action) => {
            state.partnerAdvancesLoading = action.payload;
        },
        setPartnerAdvancesParams: (state,action) => {
            state.partnerAdvancesParams = {
                ...state.partnerAdvancesParams,
                ...action.payload
            };
        },
        resetPartnerAdvancesParams: (state,action) => {
            state.partnerAdvancesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartnerAdvances.pending, (state) => {
                state.partnerAdvancesLoading = true
            })
            .addCase(fetchPartnerAdvances.fulfilled, (state,action) => {
                state.partnerAdvances = action.payload.data || action.payload;
                state.partnerAdvancesCount = action.payload.recordsTotal || 0;
                state.partnerAdvancesLoading = false
            })
            .addCase(fetchPartnerAdvances.rejected, (state,action) => {
                state.partnerAdvancesLoading = false
            })
            
    },
  
})

export const {setPartnerAdvancesLoading,setPartnerAdvancesParams,resetPartnerAdvancesParams,deletePartnerAdvances,setPartnerAdvancesOverdues} = partnerAdvanceSlice.actions;
export default partnerAdvanceSlice.reducer;