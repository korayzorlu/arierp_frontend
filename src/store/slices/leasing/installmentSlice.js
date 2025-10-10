import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    installments:[],
    installmentsCount:0,
    installmentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    installmentsLoading:false,
    //
    installmentsSummary:[],
    installmentsSummaryCount:0,
    installmentsSummaryParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    installmentsSummaryLoading:false,
    partnerInformation:{},
    installmentInformation:[],
}

export const fetchInstallments = createAsyncThunk('leasing/fetchInstallments', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/installments/?active_company=${activeCompany.id}`,
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

export const fetchInstallmentsSummary = createAsyncThunk('leasing/fetchInstallmentsSummary', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/installments_summary/?ac=${activeCompany.id}`,
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

export const fetchInstallment = createAsyncThunk('leasing/fetchInstallment', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/installments/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/installments");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addInstallment = createAsyncThunk('leasing/addInstallment', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_installment/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/installments");
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

export const updateInstallment = createAsyncThunk('leasing/updateInstallment', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_installment/`,
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

export const deleteInstallment = createAsyncThunk('leasing/deleteInstallment', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_installment/`,
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
        navigate("/installments");
    }
});

export const fetchInstallmentInformation = createAsyncThunk('leasing/fetchInstallmentInformation', async ({lease_code,lease_id},{rejectWithValue}) => {
    try {
        const response = await axios.post('/leasing/installment_information/', { 
            lease_code:lease_code,
            lease_id:lease_id
        },{ withCredentials: true, });
        console.log(lease_code)
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

const installmentSlice = createSlice({
    name:"installment",
    initialState,
    reducers:{
        setInstallmentsLoading: (state,action) => {
            state.installmentsLoading = action.payload;
        },
        setInstallmentsParams: (state,action) => {
            state.installmentsParams = {
                ...state.installmentsParams,
                ...action.payload
            };
        },
        setInstallmentsSummaryLoading: (state,action) => {
            state.installmentsSummaryLoading = action.payload;
        },
        setInstallmentsSummaryParams: (state,action) => {
            state.installmentsSummaryParams = {
                ...state.installmentsSummaryParams,
                ...action.payload
            };
        },
        resetInstallmentsParams: (state,action) => {
            state.installmentsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteInstallments: (state,action) => {
            state.installments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInstallments.pending, (state) => {
                state.installmentsLoading = true
            })
            .addCase(fetchInstallments.fulfilled, (state,action) => {
                state.installments = action.payload.data || action.payload;
                state.installmentsCount = action.payload.recordsTotal || 0;
                state.installmentsLoading = false
            })
            .addCase(fetchInstallments.rejected, (state,action) => {
                state.installmentsLoading = false
            })
            // fetch installments summary
            .addCase(fetchInstallmentsSummary.pending, (state) => {
                state.installmentsSummaryLoading = true
            })
            .addCase(fetchInstallmentsSummary.fulfilled, (state,action) => {
                state.installmentsSummary = action.payload.data || action.payload;
                state.installmentsSummaryCount = action.payload.recordsTotal || 0;
                state.installmentsSummaryLoading = false
            })
            .addCase(fetchInstallmentsSummary.rejected, (state,action) => {
                state.installmentsSummaryLoading = false
            })
            //fetch installment information
            .addCase(fetchInstallmentInformation.pending, (state) => {

            })
            .addCase(fetchInstallmentInformation.fulfilled, (state,action) => {
                state.installmentInformation = action.payload.installment;
            })
            .addCase(fetchInstallmentInformation.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })
    },
  
})

export const {setInstallmentsLoading,setInstallmentsParams,setInstallmentsSummaryLoading,setInstallmentsSummaryParams,resetInstallmentsParams,deleteInstallments} = installmentSlice.actions;
export default installmentSlice.reducer;