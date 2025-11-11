import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    underReviews:[],
    underReviewsCount:0,
    underReviewsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    underReviewsLoading:false,
}

export const fetchUnderReviews = createAsyncThunk('auth/fetchUnderReviews', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/under_reviews/?ac=${activeCompany.id}`,
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


export const fetchUnderReview = createAsyncThunk('auth/fetchUnderReview', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/accounting/under_reviews/?ac=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/underReviews");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

const underReviewSlice = createSlice({
    name:"underReview",
    initialState,
    reducers:{
        setUnderReviewsLoading: (state,action) => {
            state.underReviewsLoading = action.payload;
        },
        setUnderReviewsParams: (state,action) => {
            state.underReviewsParams = {
                ...state.underReviewsParams,
                ...action.payload
            };
        },
        resetUnderReviewsParams: (state,action) => {
            state.underReviewsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteUnderReviews: (state,action) => {
            state.underReviews = [];
        },
        setUnderReviewOverdues: (state,action) => {
            state.leaseOverdues = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnderReviews.pending, (state) => {
                state.underReviewsLoading = true
            })
            .addCase(fetchUnderReviews.fulfilled, (state,action) => {
                state.underReviews = action.payload.data || action.payload;
                state.underReviewsCount = action.payload.recordsTotal || 0;
                state.underReviewsLoading = false
            })
            .addCase(fetchUnderReviews.rejected, (state,action) => {
                state.underReviewsLoading = false
            })
    },
  
})

export const {
    setUnderReviewsLoading,
    setUnderReviewsParams,
    resetUnderReviewsParams,
    deleteUnderReviews,
    setUnderReviewOverdues,
    //
    setMainAccountCodesLoading,
    setMainAccountCodesParams,
    resetMainAccountCodesParams,
} = underReviewSlice.actions;
export default underReviewSlice.reducer;