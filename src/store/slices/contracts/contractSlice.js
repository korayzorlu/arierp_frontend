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
    },
  
})

export const {setContractsLoading,setContractsParams,deleteContracts} = contractSlice.actions;
export default contractSlice.reducer;