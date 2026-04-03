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
    //deposite to warned
    depositeToWarnedRiskPartners:[],
    depositeToWarnedRiskPartnersCount:0,
    depositeToWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    depositeToWarnedRiskPartnersLoading:false,
    //kep to warned
    kepToWarnedRiskPartners:[],
    kepToWarnedRiskPartnersCount:0,
    kepToWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    kepToWarnedRiskPartnersLoading:false,
    //posta to warned
    postaToWarnedRiskPartners:[],
    postaToWarnedRiskPartnersCount:0,
    postaToWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    postaToWarnedRiskPartnersLoading:false,
    //monthly warned
    monthlyWarnedRiskPartners:[],
    monthlyWarnedRiskPartnersCount:0,
    monthlyWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    monthlyWarnedRiskPartnersLoading:false,
    //annual warned
    annualWarnedRiskPartners:[],
    annualWarnedRiskPartnersCount:0,
    annualWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    annualWarnedRiskPartnersLoading:false,
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
    //comprehensive warned
    comprehensiveWarnedRiskPartners:[],
    comprehensiveWarnedRiskPartnersCount:0,
    comprehensiveWarnedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    comprehensiveWarnedRiskPartnersLoading:false,
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
    //needs to terminated
    needsToTerminatedRiskPartners:[],
    needsToTerminatedRiskPartnersCount:0,
    needsToTerminatedRiskPartnersParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    needsToTerminatedRiskPartnersLoading:false,
    //terminated leases
    terminatedLeases:[],
    terminatedLeasesCount:0,
    terminatedLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    terminatedLeasesLoading:false,
    //exchanged leases
    exchangedLeases:[],
    exchangedLeasesCount:0,
    exchangedLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    exchangedLeasesLoading:false,
    //tufe exchanged leases
    tufeExchangedLeases:[],
    tufeExchangedLeasesCount:0,
    tufeExchangedLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    tufeExchangedLeasesLoading:false,
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
    //title deed confirm
    titleDeedConfirms:[],
    titleDeedConfirmsCount:0,
    titleDeedConfirmsParams:{
        special: false,
        barter: false,
        virman: false,
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    titleDeedConfirmsLoading:false,
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

export const fetchManagerSummary = createAsyncThunk('auth/fetchManagerSummary', async (params=null,{rejectWithValue}) => {
    try {
        const response = await axios.post('/leasing/manager_summary/', { 
          params:params  
        },{ withCredentials: true, });
        //console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

export const fetchRiskPartners = createAsyncThunk('auth/fetchRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/risk_partners/?ac=${activeCompany.id}`,
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
        const response = await axios.get(`/risk/to_warned_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchMonthlyWarnedRiskPartners = createAsyncThunk('auth/fetchMonthlyWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/monthly_warned_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchAnnualWarnedRiskPartners = createAsyncThunk('auth/fetchAnnualWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/annual_warned_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchDepositeToWarnedRiskPartners = createAsyncThunk('auth/fetchDepositeToWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/deposite_to_warned_risk_partners/?ac=${activeCompany.id}`,
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
export const fetchKepToWarnedRiskPartners = createAsyncThunk('auth/fetchKepToWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/kep_to_warned_risk_partners/?ac=${activeCompany.id}`,
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
export const fetchPostaToWarnedRiskPartners = createAsyncThunk('auth/fetchPostaToWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/posta_to_warned_risk_partners/?ac=${activeCompany.id}`,
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
        const response = await axios.get(`/risk/warned_risk_partners/?ac=${activeCompany.id}`,
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

export const updateWarningNoticeStatus = createAsyncThunk('auth/updateWarningNoticeStatus', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/risk/update_warning_notice_status/`,
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

export const fetchComprehensiveWarnedRiskPartners = createAsyncThunk('auth/fetchComprehensiveWarnedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/comprehensive_warned_risk_partners/?ac=${activeCompany.id}`,
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
        const response = await axios.get(`/risk/to_terminated_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchNeedsToTerminatedRiskPartners = createAsyncThunk('auth/fetchNeedsToTerminatedRiskPartners', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/needs_to_terminated_risk_partners/?ac=${activeCompany.id}`,
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

export const fetchTerminatedLeases = createAsyncThunk('auth/fetchTerminatedLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/terminated_leases/?ac=${activeCompany.id}`,
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

export const fetchExchangedLeases = createAsyncThunk('auth/fetchExchangedLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/exchanged_leases/?ac=${activeCompany.id}`,
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

export const fetchTufeExchangedLeases = createAsyncThunk('auth/fetchTufeExchangedLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/tufe_exchanged_leases/?ac=${activeCompany.id}`,
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

export const fetchTitleDeedConfirms = createAsyncThunk('auth/fetchTitleDeedConfirms', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/risk/title_deed_confirms/?ac=${activeCompany.id}`,
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
        const response = await axios.get(`/risk/risk_partners/?ac=${activeCompany.id}`,
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
        //monthly warned
        setMonthlyWarnedRiskPartnersLoading: (state,action) => {
            state.monthlyWarnedRiskPartnersLoading = action.payload;
        },
        setMonthlyWarnedRiskPartnersParams: (state,action) => {
            state.monthlyWarnedRiskPartnersParams = {
                ...state.monthlyWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetMonthlyWarnedRiskPartnersParams: (state,action) => {
            state.monthlyWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteMonthlyWarnedRiskPartners: (state,action) => {
            state.monthlyWarnedRiskPartners = [];
        },
        //annual warned
        setAnnualWarnedRiskPartnersLoading: (state,action) => {
            state.annualWarnedRiskPartnersLoading = action.payload;
        },
        setAnnualWarnedRiskPartnersParams: (state,action) => {
            state.annualWarnedRiskPartnersParams = {
                ...state.annualWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetAnnualWarnedRiskPartnersParams: (state,action) => {
            state.annualWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteAnnualWarnedRiskPartners: (state,action) => {
            state.annualWarnedRiskPartners = [];
        },
        //deposite to warned
        setDepositeToWarnedRiskPartnersLoading: (state,action) => {
            state.depositeToWarnedRiskPartnersLoading = action.payload;
        },
        setDepositeToWarnedRiskPartnersParams: (state,action) => {
            state.depositeToWarnedRiskPartnersParams = {
                ...state.depositeToWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetDepositeToWarnedRiskPartnersParams: (state,action) => {
            state.depositeToWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteDepositeToWarnedRiskPartners: (state,action) => {
            state.depositeToWarnedRiskPartners = [];
        },
        //kep to warned
        setKepToWarnedRiskPartnersLoading: (state,action) => {
            state.kepToWarnedRiskPartnersLoading = action.payload;
        },
        setKepToWarnedRiskPartnersParams: (state,action) => {
            state.kepToWarnedRiskPartnersParams = {
                ...state.kepToWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetKepToWarnedRiskPartnersParams: (state,action) => {
            state.kepToWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteKepToWarnedRiskPartners: (state,action) => {
            state.kepToWarnedRiskPartners = [];
        },
        //posta to warned
        setPostaToWarnedRiskPartnersLoading: (state,action) => {
            state.postaToWarnedRiskPartnersLoading = action.payload;
        },
        setPostaToWarnedRiskPartnersParams: (state,action) => {
            state.postaToWarnedRiskPartnersParams = {
                ...state.postaToWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetPostaToWarnedRiskPartnersParams: (state,action) => {
            state.postaToWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deletePostaToWarnedRiskPartners: (state,action) => {
            state.postaToWarnedRiskPartners = [];
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
        //comprehensive warned
        setComprehensiveWarnedRiskPartnersLoading: (state,action) => {
            state.comprehensiveWarnedRiskPartnersLoading = action.payload;
        },
        setComprehensiveWarnedRiskPartnersParams: (state,action) => {
            state.comprehensiveWarnedRiskPartnersParams = {
                ...state.comprehensiveWarnedRiskPartnersParams,
                ...action.payload
            };
        },
        resetComprehensiveWarnedRiskPartnersParams: (state,action) => {
            state.comprehensiveWarnedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteComprehensiveWarnedRiskPartners: (state,action) => {
            state.comprehensiveWarnedRiskPartners = [];
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
        //needs to terminated
        setNeedsToTerminatedRiskPartnersLoading: (state,action) => {
            state.needsToTerminatedRiskPartnersLoading = action.payload;
        },
        setNeedsToTerminatedRiskPartnersParams: (state,action) => {
            state.needsToTerminatedRiskPartnersParams = {
                ...state.needsToTerminatedRiskPartnersParams,
                ...action.payload
            };
        },
        resetNeedsToTerminatedRiskPartnersParams: (state,action) => {
            state.needsToTerminatedRiskPartnersParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteNeedsToTerminatedRiskPartners: (state,action) => {
            state.needsToTerminatedRiskPartners = [];
        },
        //terminated leases
        setTerminatedLeasesLoading: (state,action) => {
            state.terminatedLeasesLoading = action.payload; 
        },
        setTerminatedLeasesParams: (state,action) => {
            state.terminatedLeasesParams = {
                ...state.terminatedLeasesParams,
                ...action.payload
            };
        },
        resetTerminatedLeasesParams: (state,action) => {
            state.terminatedLeasesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTerminatedLeases: (state,action) => {
            state.terminatedLeases = [];
        },
        //exchanged leases
        setExchangedLeasesLoading: (state,action) => {
            state.exchangedLeasesLoading = action.payload;
        },
        setExchangedLeasesParams: (state,action) => {
            state.exchangedLeasesParams = {
                ...state.exchangedLeasesParams,
                ...action.payload
            };
        },
        resetExchangedLeasesParams: (state,action) => {
            state.exchangedLeasesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteExchangedLeases: (state,action) => {
            state.exchangedLeases = [];
        },
        //tufe exchanged leases
        setTufeExchangedLeasesLoading: (state,action) => {
            state.tufeExchangedLeasesLoading = action.payload;
        },
        setTufeExchangedLeasesParams: (state,action) => {
            state.tufeExchangedLeasesParams = {
                ...state.tufeExchangedLeasesParams,
                ...action.payload
            };
        },
        resetTufeExchangedLeasesParams: (state,action) => {
            state.tufeExchangedLeasesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTufeExchangedLeases: (state,action) => {
            state.tufeExchangedLeases = [];
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
        //title deed confirm
        setTitleDeedConfirmsLoading: (state,action) => {
            state.titleDeedConfirmsLoading = action.payload;
        },
        setTitleDeedConfirmsParams: (state,action) => {
            state.titleDeedConfirmsParams = {
                ...state.titleDeedConfirmsParams,
                ...action.payload
            };
        },
        resetTitleDeedConfirmsParams: (state,action) => {
            state.titleDeedConfirmsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTitleDeedConfirms: (state,action) => {
            state.titleDeedConfirms = [];
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
                state.toWarnedRiskPartners = (action.payload.data || action.payload).filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                state.toWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.toWarnedRiskPartnersLoading = false
            })
            .addCase(fetchToWarnedRiskPartners.rejected, (state,action) => {
                state.toWarnedRiskPartnersLoading = false
            })
            //monthly warned
            .addCase(fetchMonthlyWarnedRiskPartners.pending, (state) => {
                state.monthlyWarnedRiskPartnersLoading = true
            })
            .addCase(fetchMonthlyWarnedRiskPartners.fulfilled, (state,action) => {
                state.monthlyWarnedRiskPartners = (action.payload.data || action.payload).filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                state.monthlyWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.monthlyWarnedRiskPartnersLoading = false
            })
            .addCase(fetchMonthlyWarnedRiskPartners.rejected, (state,action) => {
                state.monthlyWarnedRiskPartnersLoading = false
            })
            //annual warned
            .addCase(fetchAnnualWarnedRiskPartners.pending, (state) => {
                state.annualWarnedRiskPartnersLoading = true
            })
            .addCase(fetchAnnualWarnedRiskPartners.fulfilled, (state,action) => {
                state.annualWarnedRiskPartners = (action.payload.data || action.payload).filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                state.annualWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.annualWarnedRiskPartnersLoading = false
            })
            .addCase(fetchAnnualWarnedRiskPartners.rejected, (state,action) => {
                state.annualWarnedRiskPartnersLoading = false
            })
            //deposite to warned
            .addCase(fetchDepositeToWarnedRiskPartners.pending, (state) => {
                state.depositeToWarnedRiskPartnersLoading = true
            })
            .addCase(fetchDepositeToWarnedRiskPartners.fulfilled, (state,action) => {
                state.depositeToWarnedRiskPartners = (action.payload.data || action.payload).filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                state.depositeToWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.depositeToWarnedRiskPartnersLoading = false
            })
            .addCase(fetchDepositeToWarnedRiskPartners.rejected, (state,action) => {
                state.depositeToWarnedRiskPartnersLoading = false
            })
            //kep to warned
            .addCase(fetchKepToWarnedRiskPartners.pending, (state) => {
                state.kepToWarnedRiskPartnersLoading = true
            })
            .addCase(fetchKepToWarnedRiskPartners.fulfilled, (state,action) => {
                state.kepToWarnedRiskPartners = (action.payload.data || action.payload).filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                state.kepToWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.kepToWarnedRiskPartnersLoading = false
            })
            .addCase(fetchKepToWarnedRiskPartners.rejected, (state,action) => {
                state.kepToWarnedRiskPartnersLoading = false
            })
            //posta to warned
            .addCase(fetchPostaToWarnedRiskPartners.pending, (state) => {
                state.postaToWarnedRiskPartnersLoading = true
            })
            .addCase(fetchPostaToWarnedRiskPartners.fulfilled, (state,action) => {
                state.postaToWarnedRiskPartners = (action.payload.data || action.payload).filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id)
                );
                state.postaToWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.postaToWarnedRiskPartnersLoading = false
            })
            .addCase(fetchPostaToWarnedRiskPartners.rejected, (state,action) => {
                state.postaToWarnedRiskPartnersLoading = false
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
            //comprehensive warned
            .addCase(fetchComprehensiveWarnedRiskPartners.pending, (state) => {
                state.comprehensiveWarnedRiskPartnersLoading = true
            })
            .addCase(fetchComprehensiveWarnedRiskPartners.fulfilled, (state,action) => {
                state.comprehensiveWarnedRiskPartners = action.payload.data || action.payload;
                state.comprehensiveWarnedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.comprehensiveWarnedRiskPartnersLoading = false
            })
            .addCase(fetchComprehensiveWarnedRiskPartners.rejected, (state,action) => {
                state.comprehensiveWarnedRiskPartnersLoading = false
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
            //needs to terminated
            .addCase(fetchNeedsToTerminatedRiskPartners.pending, (state) => {
                state.needsToTerminatedRiskPartnersLoading = true
            })
            .addCase(fetchNeedsToTerminatedRiskPartners.fulfilled, (state,action) => {
                state.needsToTerminatedRiskPartners = action.payload.data || action.payload;
                state.needsToTerminatedRiskPartnersCount = action.payload.recordsTotal || 0;
                state.needsToTerminatedRiskPartnersLoading = false
            })
            .addCase(fetchNeedsToTerminatedRiskPartners.rejected, (state,action) => {
                state.needsToTerminatedRiskPartnersLoading = false
            })
            //terminated leases
            .addCase(fetchTerminatedLeases.pending, (state) => {
                state.terminatedLeasesLoading = true
            })
            .addCase(fetchTerminatedLeases.fulfilled, (state,action) => {
                state.terminatedLeases = action.payload.data || action.payload;
                state.terminatedLeasesCount = action.payload.recordsTotal || 0;
                state.terminatedLeasesLoading = false
            })
            .addCase(fetchTerminatedLeases.rejected, (state,action) => {
                state.terminatedLeasesLoading = false
            })
            //exchanged leases
            .addCase(fetchExchangedLeases.pending, (state) => {
                state.exchangedLeasesLoading = true
            })
            .addCase(fetchExchangedLeases.fulfilled, (state,action) => {
                state.exchangedLeases = action.payload.data || action.payload;
                state.exchangedLeasesCount = action.payload.recordsTotal || 0;
                state.exchangedLeasesLoading = false
            })
            .addCase(fetchExchangedLeases.rejected, (state,action) => {
                state.exchangedLeasesLoading = false
            })
            //tufe exchanged leases
            .addCase(fetchTufeExchangedLeases.pending, (state) => {
                state.tufeExchangedLeasesLoading = true
            })
            .addCase(fetchTufeExchangedLeases.fulfilled, (state,action) => {
                state.tufeExchangedLeases = action.payload.data || action.payload;
                state.tufeExchangedLeasesCount = action.payload.recordsTotal || 0;
                state.tufeExchangedLeasesLoading = false
            })
            .addCase(fetchTufeExchangedLeases.rejected, (state,action) => {
                state.tufeExchangedLeasesLoading = false
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
            //title deed confirm
            .addCase(fetchTitleDeedConfirms.pending, (state) => {
                state.titleDeedConfirmsLoading = true
            })
            .addCase(fetchTitleDeedConfirms.fulfilled, (state,action) => {
                state.titleDeedConfirms = action.payload.data || action.payload;
                state.titleDeedConfirmsCount = action.payload.recordsTotal || 0;
                state.titleDeedConfirmsLoading = false
            })
            .addCase(fetchTitleDeedConfirms.rejected, (state,action) => {
                state.titleDeedConfirmsLoading = false
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

    setDepositeToWarnedRiskPartnersLoading,
    setDepositeToWarnedRiskPartnersParams,
    resetDepositeToWarnedRiskPartnersParams,
    deleteDepositeToWarnedRiskPartners,

    setKepToWarnedRiskPartnersLoading,
    setKepToWarnedRiskPartnersParams,
    resetKepToWarnedRiskPartnersParams,
    deleteKepToWarnedRiskPartners,

    setPostaToWarnedRiskPartnersLoading,
    setPostaToWarnedRiskPartnersParams,
    resetPostaToWarnedRiskPartnersParams,
    deletePostaToWarnedRiskPartners,

    setMonthlyWarnedRiskPartnersLoading,
    setMonthlyWarnedRiskPartnersParams,
    resetMonthlyWarnedRiskPartnersParams,
    deleteMonthlyWarnedRiskPartners,

    setAnnualWarnedRiskPartnersLoading,
    setAnnualWarnedRiskPartnersParams,
    resetAnnualWarnedRiskPartnersParams,
    deleteAnnualWarnedRiskPartners,

    setWarnedRiskPartnersLoading,
    setWarnedRiskPartnersParams,
    resetWarnedRiskPartnersParams,
    deleteWarnedRiskPartners,

    setComprehensiveWarnedRiskPartnersLoading,
    setComprehensiveWarnedRiskPartnersParams,
    resetComprehensiveWarnedRiskPartnersParams,
    deleteComprehensiveWarnedRiskPartners,

    setToTerminatedRiskPartnersLoading,
    setToTerminatedRiskPartnersParams,
    resetToTerminatedRiskPartnersParams,
    deleteToTerminatedRiskPartners,

    setNeedsToTerminatedRiskPartnersLoading,
    setNeedsToTerminatedRiskPartnersParams,
    resetNeedsToTerminatedRiskPartnersParams,
    deleteNeedsToTerminatedRiskPartners,

    setTerminatedLeasesLoading,
    setTerminatedLeasesParams,
    resetTerminatedLeasesParams,
    deleteTerminatedLeases,

    setExchangedLeasesLoading,
    setExchangedLeasesParams,
    resetExchangedLeasesParams,
    deleteExchangedLeases,

    setTufeExchangedLeasesLoading,
    setTufeExchangedLeasesParams,
    resetTufeExchangedLeasesParams,
    deleteTufeExchangedLeases,

    setDeliveryConfirmsLoading,
    setDeliveryConfirmsParams,
    resetDeliveryConfirmsParams,
    deleteDeliveryConfirms,

    setTitleDeedConfirmsLoading,
    setTitleDeedConfirmsParams,
    resetTitleDeedConfirmsParams,
    deleteTitleDeedConfirms,

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