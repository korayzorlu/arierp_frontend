import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    smss:[],
    smssCount:0,
    smssParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    smssLoading:false,
}

export const fetchSMSs = createAsyncThunk('auth/fetchSMSs', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/communication/sms/?ac=${activeCompany.id}`,
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


export const fetchSMS = createAsyncThunk('auth/fetchSMS', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/communication/sms/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/smss");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const sendSMS = createAsyncThunk('auth/sendSMS', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/communication/send_sms/`,
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

export const checkSMS = createAsyncThunk('auth/checkSMS', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/communication/check_sms/`,
            data,
            { 
                withCredentials: true
            },
        );
    } catch (error) {
        dispatch(setIsProgress(false));
        return null
    } finally {
        //dispatch(setIsProgress(false));
    }
});

const smsSlice = createSlice({
    name:"sms",
    initialState,
    reducers:{
        setSMSsLoading: (state,action) => {
            state.smssLoading = action.payload;
        },
        setSMSsParams: (state,action) => {
            state.smssParams = {
                ...state.smssParams,
                ...action.payload
            };
        },
        resetSMSsParams: (state,action) => {
            state.smssParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteSMSs: (state,action) => {
            state.smss = [];
        },
        setSMSOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSMSs.pending, (state) => {
                state.smssLoading = true
            })
            .addCase(fetchSMSs.fulfilled, (state,action) => {
                state.smss = action.payload.data || action.payload;
                state.smssCount = action.payload.recordsTotal || 0;
                state.smssLoading = false
            })
            .addCase(fetchSMSs.rejected, (state,action) => {
                state.smssLoading = false
            })
    },
  
})

export const {
    setSMSsLoading,
    setSMSsParams,
    resetSMSsParams,
    deleteSMSs,
    setSMSOverdues
} = smsSlice.actions;
export default smsSlice.reducer;