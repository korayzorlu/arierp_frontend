import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAlert, setDialog } from "../notificationSlice";
import { setIsProgress } from "../processSlice";
import { fetchUser } from "../authSlice";
import { fetchCompanies, fetchCompaniesForStart } from "../organizationSlice";

const initialState = {
    
}

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({data=null},{dispatch}) => {
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

        const response = await axios.post(`/users/profile_settings/`,
            formData,
            {   
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            },
        );  
        dispatch(setAlert({status:response.data.status,text:response.data.message}));
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(fetchUser());
        dispatch(setIsProgress(false));
    }
});

export const updatePersonal = createAsyncThunk('auth/updatePersonal', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.put(`/users/api/users/${data.id}/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:"success",text:"Saved successfully!"}));
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(fetchUser());
        dispatch(setIsProgress(false));
    }
});

export const updateEmail = createAsyncThunk('auth/updateEmail', async ({data=null},{dispatch}) => {
    dispatch(setAlert({status:"info",text:"Please wait..."}));
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/users/email_settings/`,
            {email:data.email},
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        return true;
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(setIsProgress(false));
        dispatch(fetchUser());
    }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/users/password_settings/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        window.location.href="/auth/login"
    } catch (error) {
        if(error.response.data){
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        }else{
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        };
        return null
    } finally {
        dispatch(fetchUser());
        dispatch(setIsProgress(false));
    }
});

export const updateDisplayCurrency = createAsyncThunk('auth/updateDisplayCurrency', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/companies/display_currency_settings/`,
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
        dispatch(fetchCompaniesForStart());
        dispatch(setIsProgress(false));
    }
});

const settingsSlice = createSlice({
    name:"settings",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        
    },
  
})

export const {} = settingsSlice.actions;
export default settingsSlice.reducer;