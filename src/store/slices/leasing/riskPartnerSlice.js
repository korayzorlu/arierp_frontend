import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    riskPartners:[],
    riskPartnersCount:0,
    riskPartnersParams:{
        special: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    riskPartnersLoading:false,
}

export const fetchRiskPartners = createAsyncThunk('auth/fetchRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/risk_partners/?active_company=${activeCompany.id}`,
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

export const fetchRiskPartner = createAsyncThunk('auth/fetchRiskPartner', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/risk_partners/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/risk-partners");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addRiskPartner = createAsyncThunk('auth/addRiskPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_risk_partner/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/risk-partners");
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

export const updateRiskPartner = createAsyncThunk('auth/updateRiskPartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_risk_partner/`,
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

export const deleteRiskPartner = createAsyncThunk('auth/deleteRiskPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_risk_partner/`,
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
        navigate("/risk-partners");
    }
});

const riskPartnerSlice = createSlice({
    name:"riskPartner",
    initialState,
    reducers:{
        setRiskPartnersLoading: (state,action) => {
            state.riskPartnersLoading = action.payload;
        },
        setRiskPartnersParams: (state,action) => {
            state.riskPartnersParams = {
                ...state.riskPartnersParams,
                ...action.payload
            };
        },
        resetRiskPartnersParams: (state,action) => {
            state.riskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteRiskPartners: (state,action) => {
            state.riskPartners = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRiskPartners.pending, (state) => {
                state.riskPartnersLoading = true
            })
            .addCase(fetchRiskPartners.fulfilled, (state,action) => {
                state.riskPartners = action.payload.data || action.payload;
                state.riskPartnersCount = action.payload.recordsTotal || 0;
                state.riskPartnersLoading = false
            })
            .addCase(fetchRiskPartners.rejected, (state,action) => {
                state.riskPartnersLoading = false
            })
    },
  
})

export const {setRiskPartnersLoading,setRiskPartnersParams,resetRiskPartnersParams,deleteRiskPartners} = riskPartnerSlice.actions;
export default riskPartnerSlice.reducer;