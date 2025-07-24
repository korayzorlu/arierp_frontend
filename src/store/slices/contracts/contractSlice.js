import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    contracts:[],
    contractsCount:0,
    contractsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    contractsLoading:false,
    //
    contractPayments:[],
    contractPaymentsCount:0,
    contractPaymentsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    contractPaymentsLoading:false,
    contractPaymentsInLease:[],
    contractPaymentsInLeaseCode:0,
    //
    warningNotices:[],
    warningNoticesCount:0,
    warningNoticesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    warningNoticesLoading:false,
    warningNoticesInLease:[],
    warningNoticesInLeaseCode:0,
}

export const fetchContracts = createAsyncThunk('auth/fetchContracts', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/contracts/contracts/?active_company=${activeCompany.id}`,
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

export const fetchContract = createAsyncThunk('auth/fetchContract', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/contracts/contracts/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/contracts");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addContract = createAsyncThunk('auth/addContract', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/contracts/add_contract/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/contracts");
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

export const updateContract = createAsyncThunk('auth/updateContract', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/contracts/update_contract/`,
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

export const deleteContract = createAsyncThunk('auth/deleteContract', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/contracts/delete_contract/`,
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
        navigate("/contracts");
    }
});

export const fetchContractPayments = createAsyncThunk('auth/fetchContractPayments', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/contracts/contract_payments/?active_company=${activeCompany.id}`,
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

export const fetchContractPaymentsInLease = createAsyncThunk('organization/fetchContractPaymentsInLease', async ({activeCompany,contract_code}) => {
    const response = await axios.get(`/contracts/contract_payments/?active_company=${activeCompany.id}&contract=${contract_code}`, {withCredentials: true});
    return response.data;
});

export const fetchWarningNotices = createAsyncThunk('auth/fetchWarningNotices', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/contracts/warning_notices/?active_company=${activeCompany.id}`,
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

export const fetchWarningNoticesInLease = createAsyncThunk('organization/fetchWarningNoticesInLease', async ({activeCompany,partner_crm_code}) => {
    const response = await axios.get(`/contracts/warning_notices/?active_company=${activeCompany.id}&partner_crm_code=${partner_crm_code}`, {withCredentials: true});
    return response.data;
});

const contractSlice = createSlice({
    name:"contract",
    initialState,
    reducers:{
        setContractsLoading: (state,action) => {
            state.contractsLoading = action.payload;
        },
        setContractsParams: (state,action) => {
            state.contractsParams = {
                ...state.contractsParams,
                ...action.payload
            };
        },
        deleteContracts: (state,action) => {
            state.contracts = [];
        },
        setContractPaymentsLoading: (state,action) => {
            state.contractPaymentsLoading = action.payload;
        },
        setContractPaymentsParams: (state,action) => {
            state.contractPaymentsParams = {
                ...state.contractPaymentsParams,
                ...action.payload
            };
        },
        setContractPaymentsInLeaseCode: (state,action) => {
            state.warningNoticesInLeaseCode = action.payload;
        },
        setWarningNoticesLoading: (state,action) => {
            state.warningNoticesLoading = action.payload;
        },
        setWarningNoticesParams: (state,action) => {
            state.warningNoticesParams = {
                ...state.warningNoticesParams,
                ...action.payload
            };
        },
        setWarningNoticesInLeaseCode: (state,action) => {
            state.warningNoticesInLeaseCode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.contractsLoading = true
            })
            .addCase(fetchContracts.fulfilled, (state,action) => {
                state.contracts = action.payload.data || action.payload;
                state.contractsCount = action.payload.recordsTotal || 0;
                state.contractsLoading = false
            })
            .addCase(fetchContracts.rejected, (state,action) => {
                state.contractsLoading = false
            })
            //contract payments
            .addCase(fetchContractPayments.pending, (state) => {
                state.contractPaymentsLoading = true
            })
            .addCase(fetchContractPayments.fulfilled, (state,action) => {
                state.contractPayments = action.payload.data || action.payload;
                state.contractPaymentsCount = action.payload.recordsTotal || 0;
                state.contractPaymentsLoading = false
            })
            .addCase(fetchContractPayments.rejected, (state,action) => {
                state.contractPaymentsLoading = false
            })
            //fetch contract payments in lease
            .addCase(fetchContractPaymentsInLease.pending, (state) => {
                state.contractPaymentsLoading = true;
            })
            .addCase(fetchContractPaymentsInLease.fulfilled, (state,action) => {
                state.contractPaymentsInLease = action.payload;
                state.contractPaymentsLoading = false;
            })
            .addCase(fetchContractPaymentsInLease.rejected, (state,action) => {
                state.contractPaymentsLoading = false;
            })
            //fetch warning notices
            .addCase(fetchWarningNotices.pending, (state) => {
                state.warningNoticesLoading = true;
            })
            .addCase(fetchWarningNotices.fulfilled, (state,action) => {
                state.warningNotices = action.payload.data || action.payload;
                state.warningNoticesCount = action.payload.recordsTotal || 0;
                state.warningNoticesLoading = false;
            })
            .addCase(fetchWarningNotices.rejected, (state,action) => {
                state.warningNoticesLoading = false;
            })
            //fetch warning notices in lease
            .addCase(fetchWarningNoticesInLease.pending, (state) => {
                state.warningNoticesLoading = true;
            })
            .addCase(fetchWarningNoticesInLease.fulfilled, (state,action) => {
                state.warningNoticesInLease = action.payload;
                state.warningNoticesLoading = false;
            })
            .addCase(fetchWarningNoticesInLease.rejected, (state,action) => {
                state.warningNoticesLoading = false;
            })
    },
  
})

export const {
    setContractsLoading,
    setContractsParams,
    deleteContracts,
    setContractPaymentsLoading,
    setContractPaymentsParams,
    setContractPaymentsInLeaseCode,
    setWarningNoticesLoading,
    setWarningNoticesParams,
    setWarningNoticesInLeaseCode
} = contractSlice.actions;
export default contractSlice.reducer;