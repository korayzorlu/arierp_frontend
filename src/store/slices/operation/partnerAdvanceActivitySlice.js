import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert } from "../notificationSlice";

const initialState = {
    partnerAdvanceActivities:[],
    partnerAdvanceActivitiesCount:0,
    partnerAdvanceActivitiesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerAdvanceActivitiesLoading:false,
}

export const fetchPartnerAdvanceActivities = createAsyncThunk('auth/fetchPartnerAdvanceActivities', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/operation/partner_advance_activities/?ac=${activeCompany.id}`,
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

export const fetchPartnerAdvanceActivity = createAsyncThunk('auth/fetchPartnerAdvanceActivity', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/operation/partner_advance_activities/?active_company=${activeCompany.id}&paginate=false`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/partnerAdvanceActivities");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const updatePartnerAdvanceActivity = createAsyncThunk('auth/updatePartnerAdvanceActivity', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/operation/update_partner_advance_activity/`,
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

export const updateLeaseflexAutomationPartnerAdvanceActivityLeases = createAsyncThunk('auth/updateLeaseflexAutomationPartnerAdvanceActivityLeases', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    console.log(data)
    try {
        const response = await axios.post(`/operation/update_leaseflex_automation_partner_advance_activity_leases/`,
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

const partnerAdvanceActivitySlice = createSlice({
    name:"partnerAdvanceActivity",
    initialState,
    reducers:{
        setPartnerAdvanceActivitiesLoading: (state,action) => {
            state.partnerAdvanceActivitiesLoading = action.payload;
        },
        setPartnerAdvanceActivitiesParams: (state,action) => {
            state.partnerAdvanceActivitiesParams = {
                ...state.partnerAdvanceActivitiesParams,
                ...action.payload
            };
        },
        resetPartnerAdvanceActivitiesParams: (state,action) => {
            state.partnerAdvanceActivitiesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartnerAdvanceActivities.pending, (state) => {
                state.partnerAdvanceActivitiesLoading = true
            })
            .addCase(fetchPartnerAdvanceActivities.fulfilled, (state,action) => {
                state.partnerAdvanceActivities = action.payload.data || action.payload;
                state.partnerAdvanceActivitiesCount = action.payload.recordsTotal || 0;
                state.partnerAdvanceActivitiesLoading = false
            })
            .addCase(fetchPartnerAdvanceActivities.rejected, (state,action) => {
                state.partnerAdvanceActivitiesLoading = false
            })
            
    },
  
})

export const {setPartnerAdvanceActivitiesLoading,setPartnerAdvanceActivitiesParams,resetPartnerAdvanceActivitiesParams,deletePartnerAdvanceActivities,setPartnerAdvanceActivitiesOverdues} = partnerAdvanceActivitySlice.actions;
export default partnerAdvanceActivitySlice.reducer;