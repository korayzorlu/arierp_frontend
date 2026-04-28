import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    emails:[],
    emailsCount:0,
    emailsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    emailsLoading:false,
}

export const fetchEmails = createAsyncThunk('auth/fetchEmails', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/communication/email/?ac=${activeCompany.id}`,
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


export const fetchEmail = createAsyncThunk('auth/fetchEmail', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/communication/email/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/emails");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const sendRiskEmail = createAsyncThunk('auth/sendRiskEmail', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/communication/send_risk_email/`,
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

export const checkEmail = createAsyncThunk('auth/checkEmail', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/communication/check_email/`,
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

const emailSlice = createSlice({
    name:"email",
    initialState,
    reducers:{
        setEmailsLoading: (state,action) => {
            state.emailsLoading = action.payload;
        },
        setEmailsParams: (state,action) => {
            state.emailsParams = {
                ...state.emailsParams,
                ...action.payload
            };
        },
        resetEmailsParams: (state,action) => {
            state.emailsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteEmails: (state,action) => {
            state.emails = [];
        },
        setEmailOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmails.pending, (state) => {
                state.emailsLoading = true
            })
            .addCase(fetchEmails.fulfilled, (state,action) => {
                state.emails = action.payload.data || action.payload;
                state.emailsCount = action.payload.recordsTotal || 0;
                state.emailsLoading = false
            })
            .addCase(fetchEmails.rejected, (state,action) => {
                state.emailsLoading = false
            })
    },
  
})

export const {
    setEmailsLoading,
    setEmailsParams,
    resetEmailsParams,
    deleteEmails,
} = emailSlice.actions;
export default emailSlice.reducer;