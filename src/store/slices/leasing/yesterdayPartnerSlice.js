import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    yesterdayPartners:[],
    yesterdayPartnersCount:0,
    yesterdayPartnersParams:{
        special: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    yesterdayPartnersLoading:false,
}

export const fetchYesterdayPartners = createAsyncThunk('auth/fetchYesterdayPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/yesterday_partners/?active_company=${activeCompany.id}`,
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

export const fetchYesterdayPartner = createAsyncThunk('auth/fetchYesterdayPartner', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/yesterday_partners/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/yesterday-partners");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addYesterdayPartner = createAsyncThunk('auth/addYesterdayPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_yesterday_partner/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/yesterday-partners");
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

export const updateYesterdayPartner = createAsyncThunk('auth/updateYesterdayPartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_yesterday_partner/`,
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

export const deleteYesterdayPartner = createAsyncThunk('auth/deleteYesterdayPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_yesterday_partner/`,
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
        navigate("/yesterday-partners");
    }
});

const yesterdayPartnerSlice = createSlice({
    name:"yesterdayPartner",
    initialState,
    reducers:{
        setYesterdayPartnersLoading: (state,action) => {
            state.yesterdayPartnersLoading = action.payload;
        },
        setYesterdayPartnersParams: (state,action) => {
            state.yesterdayPartnersParams = {
                ...state.yesterdayPartnersParams,
                ...action.payload
            };
        },
        resetYesterdayPartnersParams: (state,action) => {
            state.yesterdayPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteYesterdayPartners: (state,action) => {
            state.yesterdayPartners = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchYesterdayPartners.pending, (state) => {
                state.yesterdayPartnersLoading = true
            })
            .addCase(fetchYesterdayPartners.fulfilled, (state,action) => {
                state.yesterdayPartners = action.payload.data || action.payload;
                state.yesterdayPartnersCount = action.payload.recordsTotal || 0;
                state.yesterdayPartnersLoading = false
            })
            .addCase(fetchYesterdayPartners.rejected, (state,action) => {
                state.yesterdayPartnersLoading = false
            })
    },
  
})

export const {setYesterdayPartnersLoading,setYesterdayPartnersParams,resetYesterdayPartnersParams,deleteYesterdayPartners} = yesterdayPartnerSlice.actions;
export default yesterdayPartnerSlice.reducer;