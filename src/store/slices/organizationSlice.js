import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { setAlert, setDialog } from "./notificationSlice";
import { setIsProgress } from "./processSlice";

const initialState = {
    companies:[],
    activeCompany:null,
    companiesLoading:false,
    usersLoading:false,
    disabled:false,
    invitations:[],
    usersInCompany:[],
}

export const fetchCompaniesForStart = createAsyncThunk('organization/fetchCompaniesForStart', async () => {
    const response = await axios.get(`/companies/api/user_companies`, {withCredentials: true});
    return response.data;
});

export const fetchCompanies = createAsyncThunk('organization/fetchCompanies', async () => {
    const response = await axios.get(`/companies/api/user_companies`, {withCredentials: true});
    return response.data;
});

export const changeActiveCompany = createAsyncThunk('organization/changeActiveCompany', async () => {
    const response = await axios.get(`/companies/api/user_companies`, {withCredentials: true});
    return response.data;
});

export const fetchCompany = createAsyncThunk('auth/fetchCompany', async ({params=null},{dispatch,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/companies/api/companies/${params.companyId}/`,
            {   
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );

        if(response.data){
            return response.data;
        }else{
            navigate("/companies");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addCompany = createAsyncThunk('auth/addCompany', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const formData = new FormData();
        const jsonData = JSON.stringify(
            Object.fromEntries(
                Object.entries(data).filter(([key]) => key !== 'image')
            )
        );
        formData.append("data", jsonData);
        
        if (data.image) {
            formData.append("image", data.image);
        };

        const response = await axios.post(`/companies/add_company/`, 
            formData,
            {   
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/companies");
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(fetchCompaniesForStart());
        dispatch(setIsProgress(false));
    }
});

export const updateCompany = createAsyncThunk('auth/updateCompany', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const formData = new FormData();
        const jsonData = JSON.stringify(
            Object.fromEntries(
                Object.entries(data).filter(([key]) => key !== 'image')
            )
        );
        formData.append("data", jsonData);

        if (data.image) {
            formData.append("image", data.image);
        };

        const response = await axios.post(`/companies/update_company/`,
            formData,
            {   
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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

export const deleteCompany = createAsyncThunk('auth/deleteCompany', async ({id=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/companies/delete_company/`,
            {id:id},
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
        navigate("/companies");
    }
});

export const deleteCompanyy = createAsyncThunk('organization/deleteCompany', async (id,{dispatch,rejectWithValue,extra: { navigate }}) => {
    try {
        const response = await axios.post(`/companies/delete_company/`, 
            {   
                id : id,
            },
            {withCredentials: true},
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}));
        navigate("/companies");
        return id;

    } catch (error) {
        dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        return rejectWithValue(error.response.data);
    } finally {
        dispatch(fetchCompanies());
        dispatch(setDialog(false));
    }
});

export const fetchUsersInCompany = createAsyncThunk('organization/fetchUsersInCompany', async (companyId) => {
    const response = await axios.get(`/companies/api/users_in_company/?companyId=${companyId}`, {withCredentials: true});
    return response.data;
});

export const fetchInvitations = createAsyncThunk('organization/fetchInvitations', async () => {
    const response = await axios.get(`/companies/api/invitations`, {withCredentials: true});
    return response.data;
});

const organizationSlice = createSlice({
    name:"organization",
    initialState,
    reducers:{
        setActiveCompany: (state,action) => {
            state.activeCompany = action.payload;
            sessionStorage.setItem('active_company', JSON.stringify(action.payload));
            localStorage.setItem('active_company', JSON.stringify(action.payload));
        },
        deleteActiveCompany: (state,action) => {
            state.activeCompany = null;
            sessionStorage.removeItem('active_company');
            localStorage.removeItem('active_company');
        },
    },
    extraReducers: (builder) => {
        builder
            //fetch companies for start
            .addCase(fetchCompaniesForStart.pending, (state) => {
                state.companiesLoading = true;
            })
            .addCase(fetchCompaniesForStart.fulfilled, (state,action) => {
                state.companies = action.payload;

                if(sessionStorage.getItem('active_company') === "null" || sessionStorage.getItem('active_company') === "undefined"){
                    state.activeCompany = null;
                    sessionStorage.removeItem('active_company');
                    localStorage.removeItem('active_company');
                };

                if (!action.payload.length === 0) {
                    //console.log("1");
                    state.activeCompany = null;
                    sessionStorage.removeItem('active_company');
                    localStorage.removeItem('active_company');
                } else if (!state.activeCompany) {
                    //console.log("2");
                    if (sessionStorage.getItem('active_company') || localStorage.getItem('active_company')) {
                        //console.log("2-1");
                        state.activeCompany = JSON.parse(sessionStorage.getItem('active_company') || localStorage.getItem('active_company'));
                        localStorage.setItem('active_company', JSON.stringify(action.payload.find(({is_active}) => is_active === true)));
                    } else {
                        //console.log("2-2");
                        if (localStorage.getItem('active_company')) {
                            //console.log("2-2-1");
                            state.activeCompany = JSON.parse(localStorage.getItem('active_company'));
                            sessionStorage.setItem('active_company', localStorage.getItem('active_company'));
                        } else {
                            //console.log("2-2-2");
                            state.activeCompany = action.payload.find(({is_active}) => is_active === true);
                            sessionStorage.setItem('active_company', JSON.stringify(action.payload.find(({is_active}) => is_active === true)));
                            localStorage.setItem('active_company', JSON.stringify(action.payload.find(({is_active}) => is_active === true)));
                        }
                    }
                } else if (!action.payload.includes(state.activeCompany)) {
                    //console.log("3");
                    const activeCompany = action.payload.find(({is_active}) => is_active === true);
                    if (activeCompany) {
                        //console.log("3-1");
                        state.activeCompany = activeCompany;
                        sessionStorage.setItem('active_company', JSON.stringify(activeCompany));
                        localStorage.setItem('active_company', JSON.stringify(activeCompany));
                    } else {
                        //console.log("3-2");
                        state.activeCompany = null;
                        sessionStorage.removeItem('active_company');
                        localStorage.removeItem('active_company');
                    }
                };
                state.companiesLoading = false;
            })
            .addCase(fetchCompaniesForStart.rejected, (state,action) => {
                state.companiesLoading = false;
            })
            //fetch companies
            .addCase(fetchCompanies.pending, (state) => {
                state.companiesLoading = true;
            })
            .addCase(fetchCompanies.fulfilled, (state,action) => {
                state.companies = action.payload;
                state.companiesLoading = false;
            })
            .addCase(fetchCompanies.rejected, (state,action) => {
                state.companiesLoading = false;
            })
            //delete company
            .addCase(deleteCompany.pending, (state) => {
                state.disabled = true;
            })
            .addCase(deleteCompany.fulfilled, (state,action) => {
                state.disabled = false;
            })
            .addCase(deleteCompany.rejected, (state,action) => {
                state.disabled = false;
            })
            //fetch users in company
            .addCase(fetchUsersInCompany.pending, (state) => {
                state.usersLoading = true;
            })
            .addCase(fetchUsersInCompany.fulfilled, (state,action) => {
                state.usersInCompany = action.payload;
                state.usersLoading = false;
            })
            .addCase(fetchUsersInCompany.rejected, (state,action) => {
                state.usersLoading = false;
            })
            //fetch invitations
            .addCase(fetchInvitations.pending, (state) => {
                state.disabled = true;
            })
            .addCase(fetchInvitations.fulfilled, (state,action) => {
                state.invitations = action.payload;
                state.disabled = false;
            })
            .addCase(fetchInvitations.rejected, (state,action) => {
                state.disabled = false;
            })
                
    }
})

export const {setActiveCompany,deleteActiveCompany} = organizationSlice.actions;
export default organizationSlice.reducer;