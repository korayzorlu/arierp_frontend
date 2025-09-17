import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert } from "../notificationSlice";

const initialState = {
    partnerAdvanceActivityLeases:[],
    partnerAdvanceActivityLeasesCount:0,
    partnerAdvanceActivityLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerAdvanceActivityLeasesLoading:false,
}

export const fetchPartnerAdvanceActivityLeases = createAsyncThunk('auth/fetchPartnerAdvanceActivityLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/partner_advance_activities/?ac=${activeCompany.id}`,
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

export const updatePartnerAdvanceActivityLeases = createAsyncThunk('auth/updatePartnerAdvanceActivityLeases', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    console.log(data)
    try {
        const response = await axios.post(`/operation/update_partner_advance_activity_leases/`,
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
    }
});

const partnerAdvanceActivityLeaseSlice = createSlice({
    name:"partnerAdvanceActivityLease",
    initialState,
    reducers:{
        setPartnerAdvanceActivityLeasesLoading: (state,action) => {
            state.partnerAdvanceActivityLeasesLoading = action.payload;
        },
        setPartnerAdvanceActivityLeasesParams: (state,action) => {
            state.partnerAdvanceActivityLeasesParams = {
                ...state.partnerAdvanceActivityLeasesParams,
                ...action.payload
            };
        },
        resetPartnerAdvanceActivityLeasesParams: (state,action) => {
            state.partnerAdvanceActivityLeasesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartnerAdvanceActivityLeases.pending, (state) => {
                state.partnerAdvanceActivityLeasesLoading = true
            })
            .addCase(fetchPartnerAdvanceActivityLeases.fulfilled, (state,action) => {
                state.partnerAdvanceActivityLeases = action.payload.data || action.payload;
                state.partnerAdvanceActivityLeasesCount = action.payload.recordsTotal || 0;
                state.partnerAdvanceActivityLeasesLoading = false
            })
            .addCase(fetchPartnerAdvanceActivityLeases.rejected, (state,action) => {
                state.partnerAdvanceActivityLeasesLoading = false
            })
            
    },
  
})

export const {setPartnerAdvanceActivityLeasesLoading,setPartnerAdvanceActivityLeasesParams,resetPartnerAdvanceActivityLeasesParams,deletePartnerAdvanceActivityLeases,setPartnerAdvanceActivityLeasesOverdues} = partnerAdvanceActivityLeaseSlice.actions;
export default partnerAdvanceActivityLeaseSlice.reducer;