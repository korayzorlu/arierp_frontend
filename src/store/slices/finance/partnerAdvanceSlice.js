import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    partnerAdvances:[],
    partnerAdvancesCount:0,
    partnerAdvancesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerAdvancesLoading:false,
}

export const fetchPartnerAdvances = createAsyncThunk('auth/fetchPartnerAdvances', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/finance/partner_advances/?ac=${activeCompany.id}`,
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

export const addPartnerAdvanceActivity = createAsyncThunk('auth/addPartnerAdvanceActivity', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    
    try {
        const response = await axios.post(`/operation/add_partner_advance_activity/`,
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

const partnerAdvanceSlice = createSlice({
    name:"partnerAdvance",
    initialState,
    reducers:{
        setPartnerAdvancesLoading: (state,action) => {
            state.partnerAdvancesLoading = action.payload;
        },
        setPartnerAdvancesParams: (state,action) => {
            state.partnerAdvancesParams = {
                ...state.partnerAdvancesParams,
                ...action.payload
            };
        },
        resetPartnerAdvancesParams: (state,action) => {
            state.partnerAdvancesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        updatePartnerAdvance(state, action) {
            const { uuid } = action.payload;
            const item = state.partnerAdvances.find(obj => obj.uuid === uuid);
            if (item) {
                item.partner_advance_activity = true;
            }
        }
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartnerAdvances.pending, (state) => {
                state.partnerAdvancesLoading = true
            })
            .addCase(fetchPartnerAdvances.fulfilled, (state,action) => {
                state.partnerAdvances = action.payload.data || action.payload;
                state.partnerAdvancesCount = action.payload.recordsTotal || 0;
                state.partnerAdvancesLoading = false
            })
            .addCase(fetchPartnerAdvances.rejected, (state,action) => {
                state.partnerAdvancesLoading = false
            })
            
    },
  
})

export const {setPartnerAdvancesLoading,setPartnerAdvancesParams,resetPartnerAdvancesParams,deletePartnerAdvances,setPartnerAdvancesOverdues,updatePartnerAdvance} = partnerAdvanceSlice.actions;
export default partnerAdvanceSlice.reducer;