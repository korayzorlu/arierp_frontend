import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    partners:[],
    partnersCount:0,
    partnersParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnersLoading:false,
    partnerInformation:{},
}

export const fetchPartners = createAsyncThunk('auth/fetchPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/partners/partners/?active_company=${activeCompany.id}`,
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

export const fetchPartner = createAsyncThunk('auth/fetchPartner', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/partners/partners/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/partners");
            return {}
        }
    } catch (error) {
        //dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addPartner = createAsyncThunk('auth/addPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/add_partner/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/partners");
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

export const updatePartner = createAsyncThunk('auth/updatePartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/update_partner/`,
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

export const deletePartner = createAsyncThunk('auth/deletePartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/delete_partner/`,
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
        navigate("/partners");
    }
});

export const fetchPartnerInformation = createAsyncThunk('auth/fetchPartnerInformation', async (crm_code,{rejectWithValue,dispatch}) => {
    try {
        const response = await axios.post('/partners/partner_information/', { 
            crm_code:crm_code
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    } finally {
        dispatch(setIsProgress(false));
    }
});

const partnerSlice = createSlice({
    name:"partner",
    initialState,
    reducers:{
        setPartnersLoading: (state,action) => {
            state.partnersLoading = action.payload;
        },
        setPartnersParams: (state,action) => {
            state.partnersParams = {
                ...state.partnersParams,
                ...action.payload
            };
        },
        deletePartners: (state,action) => {
            state.partners = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartners.pending, (state) => {
                state.partnersLoading = true
            })
            .addCase(fetchPartners.fulfilled, (state,action) => {
                state.partners = action.payload.data || action.payload;
                state.partnersCount = action.payload.recordsTotal || 0;
                state.partnersLoading = false
            })
            .addCase(fetchPartners.rejected, (state,action) => {
                state.partnersLoading = false
            })
            //fetch partner information
            .addCase(fetchPartnerInformation.pending, (state) => {

            })
            .addCase(fetchPartnerInformation.fulfilled, (state,action) => {
                state.partnerInformation = action.payload.partner;
            })
            .addCase(fetchPartnerInformation.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })
    },
  
})

export const {setPartnersLoading,setPartnersParams,deletePartners} = partnerSlice.actions;
export default partnerSlice.reducer;