import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    quotations:[],
    quotationsCount:0,
    quotationsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    quotationsLoading:false,
}

export const fetchQuotations = createAsyncThunk('auth/fetchQuotations', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/quotations/quotations/?active_company=${activeCompany.id}`,
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

export const fetchQuotation = createAsyncThunk('auth/fetchQuotation', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/quotations/quotations/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/quotations");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addQuotation = createAsyncThunk('auth/addQuotation', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/quotations/add_quotation/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/quotations");
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

export const updateQuotation = createAsyncThunk('auth/updateQuotation', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/quotations/update_quotation/`,
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

export const deleteQuotation = createAsyncThunk('auth/deleteQuotation', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/quotations/delete_quotation/`,
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
        navigate("/quotations");
    }
});

const quotationSlice = createSlice({
    name:"quotation",
    initialState,
    reducers:{
        setQuotationsLoading: (state,action) => {
            state.quotationsLoading = action.payload;
        },
        setQuotationsParams: (state,action) => {
            state.quotationsParams = {
                ...state.quotationsParams,
                ...action.payload
            };
        },
        deleteQuotations: (state,action) => {
            state.quotations = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.quotationsLoading = true
            })
            .addCase(fetchQuotations.fulfilled, (state,action) => {
                state.quotations = action.payload.data || action.payload;
                state.quotationsCount = action.payload.recordsTotal || 0;
                state.quotationsLoading = false
            })
            .addCase(fetchQuotations.rejected, (state,action) => {
                state.quotationsLoading = false
            })
    },
  
})

export const {setQuotationsLoading,setQuotationsParams,deleteQuotations} = quotationSlice.actions;
export default quotationSlice.reducer;