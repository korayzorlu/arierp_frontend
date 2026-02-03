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
    //
    activeLeases:[],
    activeLeasesCount:0,
    activeLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    activeLeasesLoading:false,
    //
    underReviewLeases:[],
    underReviewLeasesCount:0,
    underReviewLeasesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    underReviewLeasesLoading:false,
    //
    projects:[],
    projectsCount:0,
    projectsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    projectsLoading:false,
    //
    leasesSummary:{},
    leasesSummaryCount:0,
    leasesSummaryParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables',
    },
    leasesSummaryLoading:false,
    //
    portfoliosSummary:[],
    portfoliosSummaryCount:0,
    portfoliosSummaryParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    portfoliosSummaryLoading:false,
    //
    //
    terminatedSummary:[],
    terminatedSummaryCount:0,
    terminatedSummaryParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    terminatedSummaryLoading:false,
    //
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

export const fetchActiveLeases = createAsyncThunk('auth/fetchActiveLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/active_leases/?ac=${activeCompany.id}`,
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

export const fetchUnderReviewLeases = createAsyncThunk('auth/fetchUnderReviewLeases', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/under_review_leases/?ac=${activeCompany.id}`,
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

export const fetchProjects = createAsyncThunk('auth/fetchProjects', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/projects/?ac=${activeCompany.id}`,
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

export const fetchLeasesSummary = createAsyncThunk('auth/fetchLeasesSummary', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/leases_summary/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        return response.data;
    } catch (error) {
        return {};
    }
});

export const fetchPortfoliosSummary = createAsyncThunk('auth/fetchPortfoliosSummary', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/portfolios_summary/?ac=${activeCompany.id}`,
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

export const fetchTerminatedSummary = createAsyncThunk('auth/fetchTerminatedSummary', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/terminated_summary/?ac=${activeCompany.id}`,
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
        dispatch(setIsProgress(false));
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

export const changePartner = createAsyncThunk('auth/changePartner', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/change_partner/`,
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
        //
        setActiveLeasesLoading: (state,action) => {
            state.activeLeasesLoading = action.payload;
        },
        setActiveLeasesParams: (state,action) => {
            state.activeLeasesParams = {
                ...state.activeLeasesParams,
                ...action.payload
            };
        },
        //
        setUnderReviewLeasesLoading: (state,action) => {
            state.underReviewLeasesLoading = action.payload;
        },
        setUnderReviewLeasesParams: (state,action) => {
            state.underReviewLeasesParams = {
                ...state.underReviewLeasesParams,
                ...action.payload
            };
        },
        //
        setProjectsLoading: (state,action) => {
            state.projectsLoading = action.payload;
        },
        setProjectsParams: (state,action) => {
            state.projectsParams = {
                ...state.projectsParams,
                ...action.payload
            };
        },
        resetProjectsParams: (state,action) => {
            state.projectsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setLeasesSummaryLoading: (state,action) => {
            state.leasesSummaryLoading = action.payload;
        },
        setLeasesSummaryParams: (state,action) => {
            state.leasesSummaryParams = {
                ...state.leasesSummaryParams,
                ...action.payload
            };
        },
        //
        setPortfoliosSummaryLoading: (state,action) => {
            state.portfoliosSummaryLoading = action.payload;
        },
        setPortfoliosSummaryParams: (state,action) => {
            state.portfoliosSummaryParams = {
                ...state.portfoliosSummaryParams,
                ...action.payload
            };
        },
        //
        setTerminatedSummaryLoading: (state,action) => {
            state.terminatedSummaryLoading = action.payload;
        },
        setTerminatedSummaryParams: (state,action) => {
            state.terminatedSummaryParams = {
                ...state.terminatedSummaryParams,
                ...action.payload
            };
        },
        //
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
            //active leases
            .addCase(fetchActiveLeases.pending, (state) => {
                state.activeLeasesLoading = true
            })
            .addCase(fetchActiveLeases.fulfilled, (state,action) => {
                state.activeLeases = action.payload.data || action.payload;
                state.activeLeasesCount = action.payload.recordsTotal || 0;
                state.activeLeasesLoading = false
            })
            .addCase(fetchActiveLeases.rejected, (state,action) => {
                state.activeLeasesLoading = false
            })
            //under review leases
            .addCase(fetchUnderReviewLeases.pending, (state) => {
                state.underReviewLeasesLoading = true
            })
            .addCase(fetchUnderReviewLeases.fulfilled, (state,action) => {
                state.underReviewLeases = action.payload.data || action.payload;
                state.underReviewLeasesCount = action.payload.recordsTotal || 0;
                state.underReviewLeasesLoading = false
            })
            .addCase(fetchUnderReviewLeases.rejected, (state,action) => {
                state.underReviewLeasesLoading = false
            })
            // projects
            .addCase(fetchProjects.pending, (state) => {
                state.projectsLoading = true
            })
            .addCase(fetchProjects.fulfilled, (state,action) => {
                state.projects = action.payload.data || action.payload;
                state.projectsCount = action.payload.recordsTotal || 0;
                state.projectsLoading = false
            })
            .addCase(fetchProjects.rejected, (state,action) => {
                state.projectsLoading = false
            })
            //leases summary
            .addCase(fetchLeasesSummary.pending, (state) => {
                state.leasesSummaryLoading = true
            })
            .addCase(fetchLeasesSummary.fulfilled, (state,action) => {
                state.leasesSummary = action.payload.data || action.payload;
                state.leasesSummaryCount = action.payload.recordsTotal || 0;
                state.leasesSummaryLoading = false
            })
            .addCase(fetchLeasesSummary.rejected, (state,action) => {
                state.leasesSummaryLoading = false
            })
            //portfolios summary
            .addCase(fetchPortfoliosSummary.pending, (state) => {
                state.portfoliosSummaryLoading = true
            })
            .addCase(fetchPortfoliosSummary.fulfilled, (state,action) => {
                state.portfoliosSummary = action.payload.data || action.payload;
                state.portfoliosSummaryCount = action.payload.recordsTotal || 0;
                state.portfoliosSummaryLoading = false
            })
            .addCase(fetchPortfoliosSummary.rejected, (state,action) => {
                state.portfoliosSummaryLoading = false
            })
            //terminated summary
            .addCase(fetchTerminatedSummary.pending, (state) => {
                state.terminatedSummaryLoading = true
            })
            .addCase(fetchTerminatedSummary.fulfilled, (state,action) => {
                state.terminatedSummary = action.payload.data || action.payload;
                state.terminatedSummaryCount = action.payload.recordsTotal || 0;
                state.terminatedSummaryLoading = false
            })
            .addCase(fetchTerminatedSummary.rejected, (state,action) => {
                state.terminatedSummaryLoading = false
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

export const {
    setLeasesLoading,
    setLeasesParams,
    setActiveLeasesLoading,
    setActiveLeasesParams,
    setUnderReviewLeasesLoading,
    setUnderReviewLeasesParams,
    setLeasesSummaryLoading,
    setLeasesSummaryParams,
    setPortfoliosSummaryLoading,
    setPortfoliosSummaryParams,
    setTerminatedSummaryLoading,
    setTerminatedSummaryParams,
    resetLeasesParams,
    deleteLeases,
    setLeaseOverdues,
    setProjectsLoading,
    setProjectsParams,
    resetProjectsParams,
} = leaseSlice.actions;
export default leaseSlice.reducer;