import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    collections:[],
    collectionsCount:0,
    collectionsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    collectionsLoading:false,
    installmentsInCollection:[],
    installmentsLoading:false
}

export const fetchCollections = createAsyncThunk('auth/fetchCollections', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/leasing/collections/?active_company=${activeCompany.id}`,
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

export const fetchCollection = createAsyncThunk('auth/fetchCollection', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/leasing/collections/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/collections");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addCollection = createAsyncThunk('auth/addCollection', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/add_collection/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/collections");
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

export const updateCollection = createAsyncThunk('auth/updateCollection', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/update_collection/`,
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

export const deleteCollection = createAsyncThunk('auth/deleteCollection', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/leasing/delete_collection/`,
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
        navigate("/collections");
    }
});

export const fetchInstallmentsInCollection = createAsyncThunk('organization/fetchInstallmentsInCollection', async ({activeCompany,collection_id}) => {
    const response = await axios.get(`/leasing/installments/?active_company=${activeCompany.id}&collection_id=${collection_id}`, {withCredentials: true});
    console.log(response);
    return response.data;
});

const collectionSlice = createSlice({
    name:"collection",
    initialState,
    reducers:{
        setCollectionsLoading: (state,action) => {
            state.collectionsLoading = action.payload;
        },
        setCollectionsParams: (state,action) => {
            state.collectionsParams = {
                ...state.collectionsParams,
                ...action.payload
            };
        },
        resetCollectionsParams: (state,action) => {
            state.collectionsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteCollections: (state,action) => {
            state.collections = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollections.pending, (state) => {
                state.collectionsLoading = true
            })
            .addCase(fetchCollections.fulfilled, (state,action) => {
                state.collections = action.payload.data || action.payload;
                state.collectionsCount = action.payload.recordsTotal || 0;
                state.collectionsLoading = false
            })
            .addCase(fetchCollections.rejected, (state,action) => {
                state.collectionsLoading = false
            })
            //fetch installemnts in collection
            .addCase(fetchInstallmentsInCollection.pending, (state) => {
                state.installmentsLoading = true;
            })
            .addCase(fetchInstallmentsInCollection.fulfilled, (state,action) => {
                state.installmentsInCollection = action.payload;
                state.installmentsLoading = false;
            })
            .addCase(fetchInstallmentsInCollection.rejected, (state,action) => {
                state.installmentsLoading = false;
            })
    },
  
})

export const {setCollectionsLoading,setCollectionsParams,resetCollectionsParams,deleteCollections} = collectionSlice.actions;
export default collectionSlice.reducer;