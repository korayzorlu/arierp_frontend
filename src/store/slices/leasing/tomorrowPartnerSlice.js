import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    tomorrowPartners:[],
    tomorrowPartnersCount:0,
    tomorrowPartnersParams:{
        special: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    tomorrowPartnersLoading:false,
}

export const fetchTomorrowPartners = createAsyncThunk('auth/fetchTomorrowPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/tomorrow_partners/?active_company=${activeCompany.id}`,
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

export const fetchTomorrowPartner = createAsyncThunk('auth/fetchTomorrowPartner', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/tomorrow_partners/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/tomorrow-partners");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addTomorrowPartner = createAsyncThunk('auth/addTomorrowPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_tomorrow_partner/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/tomorrow-partners");
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

export const updateTomorrowPartner = createAsyncThunk('auth/updateTomorrowPartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_tomorrow_partner/`,
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

export const deleteTomorrowPartner = createAsyncThunk('auth/deleteTomorrowPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_tomorrow_partner/`,
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
        navigate("/tomorrow-partners");
    }
});

const tomorrowPartnerSlice = createSlice({
    name:"tomorrowPartner",
    initialState,
    reducers:{
        setTomorrowPartnersLoading: (state,action) => {
            state.tomorrowPartnersLoading = action.payload;
        },
        setTomorrowPartnersParams: (state,action) => {
            state.tomorrowPartnersParams = {
                ...state.tomorrowPartnersParams,
                ...action.payload
            };
        },
        resetTomorrowPartnersParams: (state,action) => {
            state.tomorrowPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTomorrowPartners: (state,action) => {
            state.tomorrowPartners = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTomorrowPartners.pending, (state) => {
                state.tomorrowPartnersLoading = true
            })
            .addCase(fetchTomorrowPartners.fulfilled, (state,action) => {
                state.tomorrowPartners = action.payload.data || action.payload;
                state.tomorrowPartnersCount = action.payload.recordsTotal || 0;
                state.tomorrowPartnersLoading = false
            })
            .addCase(fetchTomorrowPartners.rejected, (state,action) => {
                state.tomorrowPartnersLoading = false
            })
    },
  
})

export const {setTomorrowPartnersLoading,setTomorrowPartnersParams,resetTomorrowPartnersParams,deleteTomorrowPartners} = tomorrowPartnerSlice.actions;
export default tomorrowPartnerSlice.reducer;