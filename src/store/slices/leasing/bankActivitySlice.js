import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bankActivities:[],
    bankActivitiesCount:0,
    bankActivitiesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankActivityLeases:[],
    bankActivityLeasesCount:0,
    bankActivityLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bankActivityLeasesLoading:false,
    partnerInformation:{},
}

export const fetchBankActivities = createAsyncThunk('auth/fetchBankActivities', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/bank_activities/?active_company=${activeCompany.id}`,
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

export const fetchBankActivity = createAsyncThunk('auth/fetchBankActivity', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/bank_activities/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/bankActivities");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addBankActivity = createAsyncThunk('auth/addBankActivity', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_bank_activity/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/bankActivities");
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

export const updateBankActivity = createAsyncThunk('auth/updateBankActivity', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_bank_activity/`,
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

export const deleteBankActivity = createAsyncThunk('auth/deleteBankActivity', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_bank_activity/`,
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
        navigate("/bankActivities");
    }
});

export const fetchBankActivityInformation = createAsyncThunk('auth/fetchBankActivityInformation', async (lease_code,{rejectWithValue}) => {
    try {
        const response = await axios.post('/leasing/bank_activity_information/', { 
            lease_code:lease_code
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

export const fetchBankActivityLeases = createAsyncThunk('auth/fetchBankActivityLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/bank_activity_leases/?active_company=${activeCompany.id}`,
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

const bankActivitySlice = createSlice({
    name:"bankActivity",
    initialState,
    reducers:{
        setBankActivitiesLoading: (state,action) => {
            state.bankActivitiesLoading = action.payload;
        },
        setBankActivitiesParams: (state,action) => {
            state.bankActivitiesParams = {
                ...state.bankActivitiesParams,
                ...action.payload
            };
        },
        resetBankActivitiesParams: (state,action) => {
            state.bankActivitiesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteBankActivities: (state,action) => {
            state.bankActivities = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankActivities.pending, (state) => {
                state.bankActivitiesLoading = true
            })
            .addCase(fetchBankActivities.fulfilled, (state,action) => {
                state.bankActivities = action.payload.data || action.payload;
                state.bankActivitiesCount = action.payload.recordsTotal || 0;
                state.bankActivitiesLoading = false
            })
            .addCase(fetchBankActivities.rejected, (state,action) => {
                state.bankActivitiesLoading = false
            })
            //fetch bankActivity information
            .addCase(fetchBankActivityInformation.pending, (state) => {

            })
            .addCase(fetchBankActivityInformation.fulfilled, (state,action) => {
                state.bankActivityInformation = action.payload.bankActivity;
            })
            .addCase(fetchBankActivityInformation.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })
            //fetch bank activity leases
            .addCase(fetchBankActivityLeases.pending, (state) => {
                state.bankActivityLeasesLoading = true
            })
            .addCase(fetchBankActivityLeases.fulfilled, (state,action) => {
                state.bankActivityLeases = action.payload.data || action.payload;
                state.bankActivityLeasesCount = action.payload.recordsTotal || 0;
                state.bankActivityLeasesLoading = false
            })
            .addCase(fetchBankActivityLeases.rejected, (state,action) => {
                state.bankActivityLeasesLoading = false
            })
    },
  
})

export const {setBankActivitiesLoading,setBankActivitiesParams,resetBankActivitiesParams,deleteBankActivities} = bankActivitySlice.actions;
export default bankActivitySlice.reducer;