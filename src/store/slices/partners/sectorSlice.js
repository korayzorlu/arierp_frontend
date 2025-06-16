import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    sectors:[],
    sectorsCount:0,
    sectorsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    sectorsLoading:false,
}

export const fetchSectors = createAsyncThunk('auth/fetchSectors', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/partners/sectors/?active_company=${activeCompany.id}`,
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

export const fetchSector = createAsyncThunk('auth/fetchSector', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/partners/sectors/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/sectors");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addSector = createAsyncThunk('auth/addSector', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/add_sector/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/sectors");
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

export const updateSector = createAsyncThunk('auth/updateSector', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    console.log(data)
    try {
        const response = await axios.post(`/partners/update_sector/`,
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

export const deleteSector = createAsyncThunk('auth/deleteSector', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/delete_sector/`,
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
        navigate("/sectors");
    }
});

const sectorSlice = createSlice({
    name:"sector",
    initialState,
    reducers:{
        setSectorsLoading: (state,action) => {
            state.sectorsLoading = action.payload;
        },
        setSectorsParams: (state,action) => {
            state.sectorsParams = {
                ...state.sectorsParams,
                ...action.payload
            };
        },
        deleteSectors: (state,action) => {
            state.sectors = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSectors.pending, (state) => {
                state.sectorsLoading = true
            })
            .addCase(fetchSectors.fulfilled, (state,action) => {
                state.sectors = action.payload.data || action.payload;
                state.sectorsCount = action.payload.recordsTotal || 0;
                state.sectorsLoading = false
            })
            .addCase(fetchSectors.rejected, (state,action) => {
                state.sectorsLoading = false
            })
    },
  
})

export const {setSectorsLoading,setSectorsParams,deleteSectors} = sectorSlice.actions;
export default sectorSlice.reducer;