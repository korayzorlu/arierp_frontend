import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    quickQuotations:[],
    quickQuotationsCount:0,
    quickQuotationsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    quickQuotationsLoading:false,
}

export const fetchQuickQuotations = createAsyncThunk('auth/fetchQuickQuotations', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/quotations/quick_quotations/?active_company=${activeCompany.id}`,
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

export const fetchQuickQuotation = createAsyncThunk('auth/fetchQuickQuotation', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/quotations/quickq_uotations/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/quickQuotations");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addQuickQuotation = createAsyncThunk('auth/addQuickQuotation', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/quotations/add_quick_quotation/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/quickQuotations");
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

export const updateQuickQuotation = createAsyncThunk('auth/updateQuickQuotation', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/quotations/update_quick_quotation/`,
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

export const deleteQuickQuotation = createAsyncThunk('auth/deleteQuickQuotation', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/quotations/delete_quick_quotation/`,
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
        navigate("/quickQuotations");
    }
});

const quickQuotationSlice = createSlice({
    name:"quickQuotation",
    initialState,
    reducers:{
        setQuickQuotationsLoading: (state,action) => {
            state.quickQuotationsLoading = action.payload;
        },
        setQuickQuotationsParams: (state,action) => {
            state.quickQuotationsParams = {
                ...state.quickQuotationsParams,
                ...action.payload
            };
        },
        deleteQuickQuotations: (state,action) => {
            state.quickQuotations = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuickQuotations.pending, (state) => {
                state.quickQuotationsLoading = true
            })
            .addCase(fetchQuickQuotations.fulfilled, (state,action) => {
                state.quickQuotations = action.payload.data || action.payload;
                state.quickQuotationsCount = action.payload.recordsTotal || 0;
                state.quickQuotationsLoading = false
            })
            .addCase(fetchQuickQuotations.rejected, (state,action) => {
                state.quickQuotationsLoading = false
            })
    },
  
})

export const {setQuickQuotationsLoading,setQuickQuotationsParams,deleteQuickQuotations} = quickQuotationSlice.actions;
export default quickQuotationSlice.reducer;