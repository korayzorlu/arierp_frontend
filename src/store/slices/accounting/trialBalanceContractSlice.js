import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    trialBalanceContracts:[],
    trialBalanceContractsCount:0,
    trialBalanceContractsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    trialBalanceContractsLoading:false,
}

export const fetchTrialBalanceContracts = createAsyncThunk('auth/fetchTrialBalanceContracts', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/trial_balance_contracts/?ac=${activeCompany.id}`,
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


export const fetchTrialBalanceContract = createAsyncThunk('auth/fetchTrialBalanceContract', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/trial_balance_contracts/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/trialBalanceContracts");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

const trialBalanceContractSlice = createSlice({
    name:"trialBalanceContract",
    initialState,
    reducers:{
        setTrialBalanceContractsLoading: (state,action) => {
            state.trialBalanceContractsLoading = action.payload;
        },
        setTrialBalanceContractsParams: (state,action) => {
            state.trialBalanceContractsParams = {
                ...state.trialBalanceContractsParams,
                ...action.payload
            };
        },
        resetTrialBalanceContractsParams: (state,action) => {
            state.trialBalanceContractsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteTrialBalanceContracts: (state,action) => {
            state.trialBalanceContracts = [];
        },
        setTrialBalanceContractOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrialBalanceContracts.pending, (state) => {
                state.trialBalanceContractsLoading = true
            })
            .addCase(fetchTrialBalanceContracts.fulfilled, (state,action) => {
                state.trialBalanceContracts = action.payload.data || action.payload;
                state.trialBalanceContractsCount = action.payload.recordsTotal || 0;
                state.trialBalanceContractsLoading = false
            })
            .addCase(fetchTrialBalanceContracts.rejected, (state,action) => {
                state.trialBalanceContractsLoading = false
            })
    },
  
})

export const {
    setTrialBalanceContractsLoading,
    setTrialBalanceContractsParams,
    resetTrialBalanceContractsParams,
    deleteTrialBalanceContracts,
    setTrialBalanceContractOverdues,
    //
    setMainAccountCodesLoading,
    setMainAccountCodesParams,
    resetMainAccountCodesParams,
} = trialBalanceContractSlice.actions;
export default trialBalanceContractSlice.reducer;