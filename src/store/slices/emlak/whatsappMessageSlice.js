import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    whatsappMessages:[],
    whatsappMessagesCount:0,
    whatsappMessagesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    whatsappMessagesLoading:false,
}

export const fetchWhatsappMessages = createAsyncThunk('auth/fetchWhatsappMessages', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/emlak/whatsapp_messages/?ac=${activeCompany.id}`,
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

export const makeWhatsappMessage = createAsyncThunk('auth/makeWhatsappMessage', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/emlak/make_whatsapp_message/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        return response.data.status;
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return error.response.data.status;
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const deleteWhatsappMessage = createAsyncThunk('auth/deleteWhatsappMessage', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/emlak/delete_whatsapp_message/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        return response.data.status;
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return error.response.data.status;
    } finally {
        dispatch(setIsProgress(false));
    }
});


const whatsappMessageSlice = createSlice({
    name:"whatsappMessage",
    initialState,
    reducers:{
        setWhatsappMessagesLoading: (state,action) => {
            state.whatsappMessagesLoading = action.payload;
        },
        setWhatsappMessagesParams: (state,action) => {
            state.whatsappMessagesParams = {
                ...state.whatsappMessagesParams,
                ...action.payload
            };
        },
        resetWhatsappMessagesParams: (state,action) => {
            state.whatsappMessagesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWhatsappMessages.pending, (state) => {
                state.whatsappMessagesLoading = true
            })
            .addCase(fetchWhatsappMessages.fulfilled, (state,action) => {
                state.whatsappMessages = action.payload.data || action.payload;
                state.whatsappMessagesCount = action.payload.recordsTotal || 0;
                state.whatsappMessagesLoading = false
            })
            .addCase(fetchWhatsappMessages.rejected, (state,action) => {
                state.whatsappMessagesLoading = false
            })
    },
  
})

export const {
    setWhatsappMessagesLoading,
    setWhatsappMessagesParams,
    resetWhatsappMessagesParams,
    
} = whatsappMessageSlice.actions;
export default whatsappMessageSlice.reducer;