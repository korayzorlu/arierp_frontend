import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    riskPartners:[],
    riskPartnersCount:0,
    riskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    riskPartnersLoading:false,
    //kdv
    riskPartnersKDV:[],
    riskPartnersKDVCount:0,
    riskPartnersKDVParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    riskPartnersKDVLoading:false,
    //to warned
    toWarnedRiskPartners:[],
    toWarnedRiskPartnersCount:0,
    toWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    toWarnedRiskPartnersLoading:false,
    //warned
    warnedRiskPartners:[],
    warnedRiskPartnersCount:0,
    warnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    warnedRiskPartnersLoading:false,
    //to terminated
    toTerminatedRiskPartners:[],
    toTerminatedRiskPartnersCount:0,
    toTerminatedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    toTerminatedRiskPartnersLoading:false,
    //delivery confirm
    deliveryConfirms:[],
    deliveryConfirmsCount:0,
    deliveryConfirmsParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    deliveryConfirmsLoading:false,
    //deposit
    depositPartners:[],
    depositPartnersCount:0,
    depositPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    depositPartnersLoading:false,
    //agreed terminated
    agreedTerminatedPartners:[],
    agreedTerminatedPartnersCount:0,
    agreedTerminatedPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    agreedTerminatedPartnersLoading:false,
    //manager summary
    managerSummary:[],
    managerSummaryCount:0,
    managerSummaryParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    managerSummaryLoading:false,
}

export const fetchManagerSummary = createAsyncThunk('auth/fetchManagerSummary', async (lease_code=null,{rejectWithValue}) => {
    try {
        const response = await axios.post('/leasing/manager_summary/', { 
            
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

export const fetchRiskPartners = createAsyncThunk('auth/fetchRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/risk_partners/?ac=${activeCompany.id}`,
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

export const fetchRiskPartnersKDV = createAsyncThunk('auth/fetchRiskPartnersKDV', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/kdv_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchToWarnedRiskPartners = createAsyncThunk('auth/fetchToWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/to_warned_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchWarnedRiskPartners = createAsyncThunk('auth/fetchWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/warned_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchToTerminatedRiskPartners = createAsyncThunk('auth/fetchToTerminatedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/to_terminated_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchDeliveryConfirms = createAsyncThunk('auth/fetchDeliveryConfirms', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/delivery_confirms/?ac=${activeCompany.id}`,
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

export const fetchRiskPartner = createAsyncThunk('auth/fetchRiskPartner', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/risk_partners/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/risk-partners");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addRiskPartner = createAsyncThunk('auth/addRiskPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_risk_partner/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/risk-partners");
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

export const updateRiskPartner = createAsyncThunk('auth/updateRiskPartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_risk_partner/`,
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

export const deleteRiskPartner = createAsyncThunk('auth/deleteRiskPartner', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_risk_partner/`,
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
        navigate("/risk-partners");
    }
});

export const fetchDepositPartners = createAsyncThunk('auth/fetchDepositPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/deposit_partners/?ac=${activeCompany.id}`,
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

export const fetchAgreedTerminatedPartners = createAsyncThunk('auth/fetchAgreedTerminatedPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/agreed_terminated_partners/?ac=${activeCompany.id}`,
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

const riskPartnerSlice = createSlice({
    name:"riskPartner",
    initialState,
    reducers:{
        setRiskPartnersLoading: (state,action) => {
            state.riskPartnersLoading = action.payload;
        },
        setRiskPartnersParams: (state,action) => {
            state.riskPartnersParams = {
                ...state.riskPartnersParams,
                ...action.payload
            };
        },
        resetRiskPartnersParams: (state,action) => {
            state.riskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteRiskPartners: (state,action) => {
            state.riskPartners = [];
        },
        //kdv
        setRiskPartnersKDVLoading: (state,action) => {
            state.riskPartnersKDVLoading = action.payload;
        },
        setRiskPartnersKDVParams: (state,action) => {
            state.riskPartnersKDVParams = {
                ...state.riskPartnersKDVParams,
                ...action.payload
            };
        },
        resetRiskPartnersKDVParams: (state,action) => {
            state.riskPartnersKDVParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteRiskPartnersKDV: (state,action) => {
            state.riskPartnersKDV = [];
        },
        //to warned
        setToWarnedRiskPartnersLoading: (state,action) => {
            state.toWarnedRiskPartnersLoading = action.payload;
        },
        setToWarnedRiskPartnersParams: (state,action) => {
            state.toWarnedRiskPartnersParams = {
                ...state.toWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetToWarnedRiskPartnersParams: (state,action) => {
            state.toWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteToWarnedRiskPartners: (state,action) => {
            state.toWarnedRiskPartners = [];
        },
        //warned
        setWarnedRiskPartnersLoading: (state,action) => {
            state.warnedRiskPartnersLoading = action.payload;
        },
        setWarnedRiskPartnersParams: (state,action) => {
            state.warnedRiskPartnersParams = {
                ...state.warnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetWarnedRiskPartnersParams: (state,action) => {
            state.warnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteWarnedRiskPartners: (state,action) => {
            state.warnedRiskPartners = [];
        },
        //to terminated
        setToTerminatedRiskPartnersLoading: (state,action) => {
            state.toTerminatedRiskPartnersLoading = action.payload;
        },
        setToTerminatedRiskPartnersParams: (state,action) => {
            state.toTerminatedRiskPartnersParams = {
                ...state.toTerminatedRiskPartnersParams,
                ...action.payload
            };
        },
        resetToTerminatedRiskPartnersParams: (state,action) => {
            state.toTerminatedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteToTerminatedRiskPartners: (state,action) => {
            state.toTerminatedRiskPartners = [];
        },
        //delivery confirm
        setDeliveryConfirmsLoading: (state,action) => {
            state.deliveryConfirmsLoading = action.payload;
        },
        setDeliveryConfirmsParams: (state,action) => {
            state.deliveryConfirmsParams = {
                ...state.deliveryConfirmsParams,
                ...action.payload
            };
        },
        resetDeliveryConfirmsParams: (state,action) => {
            state.deliveryConfirmsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteDeliveryConfirms: (state,action) => {
            state.deliveryConfirms = [];
        },
        //deposit
        setDepositPartnersLoading: (state,action) => {
            state.depositPartnersLoading = action.payload;
        },
        setDepositPartnersParams: (state,action) => {
            state.depositPartnersParams = {
                ...state.depositPartnersParams,
                ...action.payload
            };
        },
        resetDepositPartnersParams: (state,action) => {
            state.depositPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteDepositPartners: (state,action) => {
            state.depositPartners = [];
        },
        //agreed terminated
        setAgreedTerminatedPartnersLoading: (state,action) => {
            state.agreedTerminatedPartnersLoading = action.payload;
        },
        setAgreedTerminatedPartnersParams: (state,action) => {
            state.agreedTerminatedPartnersParams = {
                ...state.agreedTerminatedPartnersParams,
                ...action.payload
            };
        },
        resetAgreedTerminatedPartnersParams: (state,action) => {
            state.agreedTerminatedPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteAgreedTerminatedPartners: (state,action) => {
            state.agreedTerminatedPartners = [];
        },
        //manager summary
        setManagerSummaryLoading: (state,action) => {
            state.managerSummaryLoading = action.payload;
        },
        setManagerSummaryParams: (state,action) => {
            state.managerSummaryParams = {
                ...state.managerSummaryParams,
                ...action.payload
            };
        },
        resetManagerSummaryParams: (state,action) => {
            state.managerSummaryParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRiskPartners.pending, (state) => {
                state.riskPartnersLoading = true
            })
            .addCase(fetchRiskPartners.fulfilled, (state,action) => {
                state.riskPartners = action.payload.data || action.payload;
                state.riskPartnersCount = action.payload.recordsTotal || 0;
                state.riskPartnersLoading = false
            })
            .addCase(fetchRiskPartners.rejected, (state,action) => {
                state.riskPartnersLoading = false
            })
            //kdv
            .addCase(fetchRiskPartnersKDV.pending, (state) => {
                state.riskPartnersKDVLoading = true
            })
            .addCase(fetchRiskPartnersKDV.fulfilled, (state,action) => {
                state.riskPartnersKDV = action.payload.data || action.payload;
                state.riskPartnersKDVCount = action.payload.recordsTotal || 0;
                state.riskPartnersKDVLoading = false
            })
            .addCase(fetchRiskPartnersKDV.rejected, (state,action) => {
                state.riskPartnersKDVLoading = false
            })
            //to warned
            .addCase(fetchToWarnedRiskPartners.pending, (state) => {
                state.toWarnedRiskPartnersLoading = true
            })
            .addCase(fetchToWarnedRiskPartners.fulfilled, (state,action) => {
                state.toWarnedRiskPartners = action.payload.data || action.payload;
                state.toWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.toWarnedRiskPartnersLoading = false
            })
            .addCase(fetchToWarnedRiskPartners.rejected, (state,action) => {
                state.toWarnedRiskPartnersLoading = false
            })
            //warned
            .addCase(fetchWarnedRiskPartners.pending, (state) => {
                state.warnedRiskPartnersLoading = true
            })
            .addCase(fetchWarnedRiskPartners.fulfilled, (state,action) => {
                state.warnedRiskPartners = action.payload.data || action.payload;
                state.warnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.warnedRiskPartnersLoading = false
            })
            .addCase(fetchWarnedRiskPartners.rejected, (state,action) => {
                state.warnedRiskPartnersLoading = false
            })
            //to terminated
            .addCase(fetchToTerminatedRiskPartners.pending, (state) => {
                state.toTerminatedRiskPartnersLoading = true
            })
            .addCase(fetchToTerminatedRiskPartners.fulfilled, (state,action) => {
                state.toTerminatedRiskPartners = action.payload.data || action.payload;
                state.toTerminatedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.toTerminatedRiskPartnersLoading = false
            })
            .addCase(fetchToTerminatedRiskPartners.rejected, (state,action) => {
                state.toTerminatedRiskPartnersLoading = false
            })
            //delivery confirm
            .addCase(fetchDeliveryConfirms.pending, (state) => {
                state.deliveryConfirmsLoading = true
            })
            .addCase(fetchDeliveryConfirms.fulfilled, (state,action) => {
                state.deliveryConfirms = action.payload.data || action.payload;
                state.deliveryConfirmsCount = action.payload.recordsTotal || 0;
                state.deliveryConfirmsLoading = false
            })
            .addCase(fetchDeliveryConfirms.rejected, (state,action) => {
                state.deliveryConfirmsLoading = false
            })
            //deposit
            .addCase(fetchDepositPartners.pending, (state) => {
                state.depositPartnersLoading = true
            })
            .addCase(fetchDepositPartners.fulfilled, (state,action) => {
                state.depositPartners = action.payload.data || action.payload;
                state.depositPartnersCount = action.payload.recordsTotal || 0;
                state.depositPartnersLoading = false
            })
            .addCase(fetchDepositPartners.rejected, (state,action) => {
                state.depositPartnersLoading = false
            })
            //agreed terminated
            .addCase(fetchAgreedTerminatedPartners.pending, (state) => {
                state.agreedTerminatedPartnersLoading = true
            })
            .addCase(fetchAgreedTerminatedPartners.fulfilled, (state,action) => {
                state.agreedTerminatedPartners = action.payload.data || action.payload;
                state.agreedTerminatedPartnersCount = action.payload.recordsTotal || 0;
                state.agreedTerminatedPartnersLoading = false
            })
            .addCase(fetchAgreedTerminatedPartners.rejected, (state,action) => {
                state.agreedTerminatedPartnersLoading = false
            })
            //manager summary
            .addCase(fetchManagerSummary.pending, (state) => {
                state.managerSummaryLoading = true
            })
            .addCase(fetchManagerSummary.fulfilled, (state,action) => {
                state.managerSummary = action.payload.data || action.payload;
                state.managerSummaryCount = action.payload.recordsTotal || 0;
                state.managerSummaryLoading = false
            })
            .addCase(fetchManagerSummary.rejected, (state,action) => {
                state.managerSummaryLoading = false
            })
    },
  
})

export const {
    setRiskPartnersLoading,
    setRiskPartnersParams,
    resetRiskPartnersParams,
    deleteRiskPartners,

    setRiskPartnersKDVLoading,
    setRiskPartnersKDVParams,
    resetRiskPartnersKDVParams,
    deleteRiskPartnersKDV,

    setToWarnedRiskPartnersLoading,
    setToWarnedRiskPartnersParams,
    resetToWarnedRiskPartnersParams,
    deleteToWarnedRiskPartners,

    setWarnedRiskPartnersLoading,
    setWarnedRiskPartnersParams,
    resetWarnedRiskPartnersParams,
    deleteWarnedRiskPartners,

    setToTerminatedRiskPartnersLoading,
    setToTerminatedRiskPartnersParams,
    resetToTerminatedRiskPartnersParams,
    deleteToTerminatedRiskPartners,

    setDeliveryConfirmsLoading,
    setDeliveryConfirmsParams,
    resetDeliveryConfirmsParams,
    deleteDeliveryConfirms,

    setDepositPartnersLoading,
    setDepositPartnersParams,
    resetDepositPartnersParams,
    deleteDepositPartners,

    setAgreedTerminatedPartnersLoading,
    setAgreedTerminatedPartnersParams,
    resetAgreedTerminatedPartnersParams,
    deleteAgreedTerminatedPartners,

    setManagerSummaryLoading,
    setManagerSummaryParams,
    resetManagerSummaryParams,

} = riskPartnerSlice.actions;
export default riskPartnerSlice.reducer;