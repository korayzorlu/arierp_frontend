import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    thirdPersons:[],
    thirdPersonsCount:0,
    thirdPersonsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    thirdPersonsLoading:false,
    scanning:false,
    //
    vPosThirdPersons:[],
    vPosThirdPersonsCount:0,
    vPosThirdPersonsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    vPosThirdPersonsLoading:false,
    //
    thirdPerson:{
        Images: [],
        OtherNames: [],
        BirthDetails: [],
        AddressDetails: [],
        Links: []
    },
}

export const fetchThirdPersons = createAsyncThunk('auth/fetchThirdPersons', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/compliance/third_persons/?ac=${activeCompany.id}`,
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

export const fetchVPosThirdPersons = createAsyncThunk('auth/fetchVPosThirdPersons', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/compliance/vpos_third_persons/?ac=${activeCompany.id}`,
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

export const updateThirdPersonStatus = createAsyncThunk('auth/updateThirdPersonStatus', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/compliance/update_third_person_status/`,
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

export const updateThirdPersonIsEmailSent = createAsyncThunk('auth/updateThirdPersonIsEmailSent', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    
    try {
        const response = await axios.post(`/compliance/update_third_person_is_email_sent/`,
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
        dispatch(updateThirdPersonDowngrade({id: data.id}));
        return null
    } finally {
        dispatch(setIsProgress(false));
    }
});

const thirdPersonSlice = createSlice({
    name:"thirdPerson",
    initialState,
    reducers:{
        setThirdPersonsLoading: (state,action) => {
            state.thirdPersonsLoading = action.payload;
        },
        setThirdPersonsParams: (state,action) => {
            state.thirdPersonsParams = {
                ...state.thirdPersonsParams,
                ...action.payload
            };
        },
        resetThirdPersonsParams: (state,action) => {
            state.thirdPersonsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        setScanning: (state,action) => {
            state.scanning = action.payload;
        },
        //
        setVPosThirdPersonsLoading: (state,action) => {
            state.vPosThirdPersonsLoading = action.payload;
        },
        setVPosThirdPersonsParams: (state,action) => {
            state.vPosThirdPersonsParams = {
                ...state.vPosThirdPersonsParams,
                ...action.payload
            };
        },
        resetVPosThirdPersonsParams: (state,action) => {
            state.vPosThirdPersonsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setThirdPerson: (state,action) => {
            state.thirdPerson = action.payload;
        },
        //
        updateThirdPerson(state, action) {
            const { id } = action.payload;
            const item = state.thirdPersons.find(obj => obj.id === id);
            if (item) {
                item.is_email_sent = true;
            }
        },
        updateThirdPersonDowngrade(state, action) {
            const { id } = action.payload;
            const item = state.thirdPersons.find(obj => obj.id === id);
            if (item) {
                item.is_email_sent = false;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchThirdPersons.pending, (state) => {
                state.thirdPersonsLoading = true
            })
            .addCase(fetchThirdPersons.fulfilled, (state,action) => {
                state.thirdPersons = action.payload.data || action.payload;
                state.thirdPersonsCount = action.payload.recordsTotal || 0;
                state.thirdPersonsLoading = false
            })
            .addCase(fetchThirdPersons.rejected, (state,action) => {
                state.thirdPersonsLoading = false
            })
            
    },
  
})

export const {
    setThirdPersonsLoading,
    setThirdPersonsParams,
    resetThirdPersonsParams,
    deleteThirdPersons,
    setVPosThirdPersonsLoading,
    setVPosThirdPersonsParams,
    resetVPosThirdPersonsParams,
    deleteVPosThirdPersons,
    setThirdPersonsOverdues,
    setScanning,
    setThirdPerson,
    updateThirdPerson,
    updateThirdPersonDowngrade
} = thirdPersonSlice.actions;
export default thirdPersonSlice.reducer;