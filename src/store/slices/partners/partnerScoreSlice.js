import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    partnerScores:[],
    partnerScoresCount:0,
    partnerScoresParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    partnerScoresLoading:false,
    partnerScoreInformation:{},
}

export const fetchPartnerScores = createAsyncThunk('auth/fetchPartnerScores', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/partners/partner_scores/?ac=${activeCompany.id}`,
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

export const fetchPartnerScore = createAsyncThunk('auth/fetchPartnerScore', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/partners/partner_scores/?ac=${activeCompany.id}`,
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

export const updatePartnerScore = createAsyncThunk('auth/updatePartnerScore', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/partners/update_partner_score/`,
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


const partnerScoreSlice = createSlice({
    name:"partnerScore",
    initialState,
    reducers:{
        setPartnerScoresLoading: (state,action) => {
            state.partnerScoresLoading = action.payload;
        },
        setPartnerScoresParams: (state,action) => {
            state.partnerScoresParams = {
                ...state.partnerScoresParams,
                ...action.payload
            };
        },
        resetPartnerScoresParams: (state,action) => {
            state.partnerScoresParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deletePartnerScores: (state,action) => {
            state.partnerScores = [];
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartnerScores.pending, (state) => {
                state.partnerScoresLoading = true
            })
            .addCase(fetchPartnerScores.fulfilled, (state,action) => {
                state.partnerScores = action.payload.data || action.payload;
                state.partnerScoresCount = action.payload.recordsTotal || 0;
                state.partnerScoresLoading = false
            })
            .addCase(fetchPartnerScores.rejected, (state,action) => {
                state.partnerScoresLoading = false
            })
    },
  
})

export const {
    setPartnerScoresLoading,
    setPartnerScoresParams,
    deletePartnerScores,
    resetPartnerScoresParams,
    setPartnerScoreNotesLoading,
    setPartnerScoreNotesParams,
    resetPartnerScoreNotesParams,
    deletePartnerScoreNotes
} = partnerScoreSlice.actions;
export default partnerScoreSlice.reducer;