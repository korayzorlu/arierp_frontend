import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    todayPartners:[],
    todayPartnersCount:0,
    todayPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    todayPartnersLoading:false,
}

export const fetchTodayPartners = createAsyncThunk('auth/fetchTodayPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/today_partners/?ac=${activeCompany.id}`,
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

export const fetchTodayPartner = createAsyncThunk('auth/fetchTodayPartner', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/risk/today_partners/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/today-partners");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addTodayPartner = createAsyncThunk('auth/addTodayPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_today_partner/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/today-partners");
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

export const updateTodayPartner = createAsyncThunk('auth/updateTodayPartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_today_partner/`,
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

export const deleteTodayPartner = createAsyncThunk('auth/deleteTodayPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_today_partner/`,
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
        navigate("/today-partners");
    }
});

const todayPartnerSlice = createSlice({
    name:"todayPartner",
    initialState,
    reducers:{
        setTodayPartnersLoading: (state,action) => {
            state.todayPartnersLoading = action.payload;
        },
        setTodayPartnersParams: (state,action) => {
            state.todayPartnersParams = {
                ...state.todayPartnersParams,
                ...action.payload
            };
        },
        resetTodayPartnersParams: (state,action) => {
            state.todayPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTodayPartners: (state,action) => {
            state.todayPartners = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodayPartners.pending, (state) => {
                state.todayPartnersLoading = true
            })
            .addCase(fetchTodayPartners.fulfilled, (state,action) => {
                state.todayPartners = action.payload.data || action.payload;
                state.todayPartnersCount = action.payload.recordsTotal || 0;
                state.todayPartnersLoading = false
            })
            .addCase(fetchTodayPartners.rejected, (state,action) => {
                state.todayPartnersLoading = false
            })
    },
  
})

export const {setTodayPartnersLoading,setTodayPartnersParams,resetTodayPartnersParams,deleteTodayPartners} = todayPartnerSlice.actions;
export default todayPartnerSlice.reducer;