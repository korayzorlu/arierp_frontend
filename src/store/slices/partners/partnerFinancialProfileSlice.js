import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    partnerFinancialProfiles:[],
    partnerFinancialProfilesCount:0,
    partnerFinancialProfilesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerFinancialProfilesLoading:false,
    partnerFinancialProfileInformation:{},
    //
    partnerFinancialProfileNotes:[],
    partnerFinancialProfileNotesCount:0,
    partnerFinancialProfileNotesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerFinancialProfileNotesLoading:false,
}

export const fetchPartnerFinancialProfiles = createAsyncThunk('auth/fetchPartnerFinancialProfiles', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/partners/partner_financial_profiles/?ac=${activeCompany.id}`,
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

export const fetchPartnerFinancialProfile = createAsyncThunk('auth/fetchPartnerFinancialProfile', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/partners/partner_financial_profiles/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/partner-financial-profiles/");
            return {}
        }
    } catch (error) {
        //dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const updatePartnerFinancialProfile = createAsyncThunk('auth/updatePartnerFinancialProfile', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/update_partner_financial_profile/`,
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


const partnerFinancialProfileSlice = createSlice({
    name:"partnerFinancialProfile",
    initialState,
    reducers:{
        setPartnerFinancialProfilesLoading: (state,action) => {
            state.partnerFinancialProfilesLoading = action.payload;
        },
        setPartnerFinancialProfilesParams: (state,action) => {
            state.partnerFinancialProfilesParams = {
                ...state.partnerFinancialProfilesParams,
                ...action.payload
            };
        },
        resetPartnerFinancialProfilesParams: (state,action) => {
            state.partnerFinancialProfilesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deletePartnerFinancialProfiles: (state,action) => {
            state.partnerFinancialProfiles = [];
        },
        //
        setPartnerFinancialProfileNotesLoading: (state,action) => {
            state.partnerFinancialProfileNotesLoading = action.payload;
        },
        setPartnerFinancialProfileNotesParams: (state,action) => {
            state.partnerFinancialProfileNotesParams = {
                ...state.partnerFinancialProfileNotesParams,
                ...action.payload
            };
        },
        resetPartnerFinancialProfileNotesParams: (state,action) => {
            state.partnerFinancialProfileNotesParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deletePartnerFinancialProfileNotes: (state,action) => {
            state.partnerFinancialProfileNotes = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartnerFinancialProfiles.pending, (state) => {
                state.partnerFinancialProfilesLoading = true
            })
            .addCase(fetchPartnerFinancialProfiles.fulfilled, (state,action) => {
                state.partnerFinancialProfiles = action.payload.data || action.payload;
                state.partnerFinancialProfilesCount = action.payload.recordsTotal || 0;
                state.partnerFinancialProfilesLoading = false
            })
            .addCase(fetchPartnerFinancialProfiles.rejected, (state,action) => {
                state.partnerFinancialProfilesLoading = false
            })
    },
  
})

export const {
    setPartnerFinancialProfilesLoading,
    setPartnerFinancialProfilesParams,
    deletePartnerFinancialProfiles,
    resetPartnerFinancialProfilesParams,
    setPartnerFinancialProfileNotesLoading,
    setPartnerFinancialProfileNotesParams,
    resetPartnerFinancialProfileNotesParams,
    deletePartnerFinancialProfileNotes
} = partnerFinancialProfileSlice.actions;
export default partnerFinancialProfileSlice.reducer;