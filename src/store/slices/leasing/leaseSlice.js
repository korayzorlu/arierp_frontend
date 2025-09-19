import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    leases:[],
    leasesCount:0,
    leasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    leasesLoading:false,
    installmentsInLease:[],
    installmentsLoading:false,
    overdueInformation:[],
    leaseOverdues:[],
    leaseInformation:[],
}

export const fetchLeases = createAsyncThunk('auth/fetchLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/leases/?ac=${activeCompany.id}`,
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

export const fetchLeaseUnpages = createAsyncThunk('auth/fetchLeaseUnpages', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/lease_unpages/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        return [];
    }
});

export const fetchLease = createAsyncThunk('auth/fetchLease', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/leases/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/leases");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addLease = createAsyncThunk('auth/addLease', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_lease/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/leases");
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

export const updateLease = createAsyncThunk('auth/updateLease', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_lease/`,
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

export const deleteLease = createAsyncThunk('auth/deleteLease', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_lease/`,
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
        navigate("/leases");
    }
});

export const fetchInstallmentsInLease = createAsyncThunk('organization/fetchInstallmentsInLease', async ({activeCompany,lease_id}) => {
    const response = await axios.get(`/leasing/installments/?active_company=${activeCompany.id}&lease_id=${lease_id}`, {withCredentials: true});
    return response.data;
});

export const fetchOverdueInformation = createAsyncThunk('auth/fetchOverdueInformation', async (lease_code,{rejectWithValue}) => {
    try {
        const response = await axios.post('/leasing/overdue_information/', {
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

export const fetchLeaseInformation = createAsyncThunk('leasing/fetchLeaseInformation', async ({partner_uuid},{rejectWithValue}) => {
    try {
        const response = await axios.post('/leasing/lease_information/', { 
            partner_uuid:partner_uuid,
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

const leaseSlice = createSlice({
    name:"lease",
    initialState,
    reducers:{
        setLeasesLoading: (state,action) => {
            state.leasesLoading = action.payload;
        },
        setLeasesParams: (state,action) => {
            state.leasesParams = {
                ...state.leasesParams,
                ...action.payload
            };
        },
        resetLeasesParams: (state,action) => {
            state.leasesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteLeases: (state,action) => {
            state.leases = [];
        },
        setLeaseOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeases.pending, (state) => {
                state.leasesLoading = true
            })
            .addCase(fetchLeases.fulfilled, (state,action) => {
                state.leases = action.payload.data || action.payload;
                state.leasesCount = action.payload.recordsTotal || 0;
                state.leasesLoading = false
            })
            .addCase(fetchLeases.rejected, (state,action) => {
                state.leasesLoading = false
            })
            //fetch installemnts in lease
            .addCase(fetchInstallmentsInLease.pending, (state) => {
                state.installmentsLoading = true;
            })
            .addCase(fetchInstallmentsInLease.fulfilled, (state,action) => {
                state.installmentsInLease = action.payload;
                state.installmentsLoading = false;
            })
            .addCase(fetchInstallmentsInLease.rejected, (state,action) => {
                state.installmentsLoading = false;
            })
            //fetch overdue information
            .addCase(fetchOverdueInformation.pending, (state) => {

            })
            .addCase(fetchOverdueInformation.fulfilled, (state,action) => {
                state.overdueInformation = action.payload.overdue;
            })
            .addCase(fetchOverdueInformation.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })
            //fetch lease information
            .addCase(fetchLeaseInformation.pending, (state) => {

            })
            .addCase(fetchLeaseInformation.fulfilled, (state,action) => {
                state.leaseInformation = action.payload.lease;
            })
            .addCase(fetchLeaseInformation.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })
            
    },
  
})

export const {setLeasesLoading,setLeasesParams,resetLeasesParams,deleteLeases,setLeaseOverdues} = leaseSlice.actions;
export default leaseSlice.reducer;