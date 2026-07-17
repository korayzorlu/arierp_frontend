import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    krsReports:[],
    krsReportsCount:0,
    krsReportsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsLoading:false,
    //
    krsReportsCS0000:[],
    krsReportsCS0000Count:0,
    krsReportsCS0000Params:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsCS0000Loading:false,
    //
    krsReportsCS0100:[],
    krsReportsCS0100Count:0,
    krsReportsCS0100Params:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsCS0100Loading:false,
    //
    krsReportsCS0200:[],
    krsReportsCS0200Count:0,
    krsReportsCS0200Params:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsCS0200Loading:false,
    //
    krsReportsCS0301:[],
    krsReportsCS0301Count:0,
    krsReportsCS0301Params:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsCS0301Loading:false,
    //
    krsReportsCS9999:[],
    krsReportsCS9999Count:0,
    krsReportsCS9999Params:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    krsReportsCS9999Loading:false,
}

export const fetchKrsReports = createAsyncThunk('auth/fetchKrsReports', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports/?ac=${activeCompany.id}`,
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

export const createKrsReport = createAsyncThunk('auth/createKrsReport', async ({activeCompany,data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/krs/create_krs_report/`,
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

export const fetchKrsReportsCS0000 = createAsyncThunk('auth/fetchKrsReportsCS0000', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports_cs0000/?ac=${activeCompany.id}`,
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

export const fetchKrsReportsCS0100 = createAsyncThunk('auth/fetchKrsReportsCS0100', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports_cs0100/?ac=${activeCompany.id}`,
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

export const fetchKrsReportsCS0200 = createAsyncThunk('auth/fetchKrsReportsCS0200', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports_cs0200/?ac=${activeCompany.id}`,
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

export const fetchKrsReportsCS0301 = createAsyncThunk('auth/fetchKrsReportsCS0301', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports_cs0301/?ac=${activeCompany.id}`,
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

export const fetchKrsReportsCS9999 = createAsyncThunk('auth/fetchKrsReportsCS9999', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/krs/krs_reports_cs9999/?ac=${activeCompany.id}`,
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

const krsReportSlice = createSlice({
    name:"krsReport",
    initialState,
    reducers:{
        setKrsReportsLoading: (state,action) => {
            state.krsReportsLoading = action.payload;
        },
        setKrsReportsParams: (state,action) => {
            state.krsReportsParams = {
                ...state.krsReportsParams,
                ...action.payload
            };
        },
        resetKrsReportsParams: (state,action) => {
            state.krsReportsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setKrsReportsCS0000Params: (state,action) => {
            state.krsReportsCS0000Params = {
                ...state.krsReportsCS0000Params,
                ...action.payload
            };
        },
        resetKrsReportsCS0000Params: (state,action) => {
            state.krsReportsCS0000Params = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setKrsReportsCS0100Params: (state,action) => {
            state.krsReportsCS0100Params = {
                ...state.krsReportsCS0100Params,
                ...action.payload
            };
        },
        resetKrsReportsCS0100Params: (state,action) => {
            state.krsReportsCS0100Params = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setKrsReportsCS0200Params: (state,action) => {
            state.krsReportsCS0200Params = {
                ...state.krsReportsCS0200Params,
                ...action.payload
            };
        },
        resetKrsReportsCS0200Params: (state,action) => {
            state.krsReportsCS0200Params = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setKrsReportsCS0301Params: (state,action) => {
            state.krsReportsCS0301Params = {
                ...state.krsReportsCS0301Params,
                ...action.payload
            };
        },
        resetKrsReportsCS0301Params: (state,action) => {
            state.krsReportsCS0301Params = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        //
        setKrsReportsCS9999Params: (state,action) => {
            state.krsReportsCS9999Params = {
                ...state.krsReportsCS9999Params,
                ...action.payload
            };
        },
        resetKrsReportsCS9999Params: (state,action) => {
            state.krsReportsCS9999Params = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKrsReports.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReports.fulfilled, (state,action) => {
                state.krsReports = action.payload.data || action.payload;
                state.krsReportsCount = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReports.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
            //
            .addCase(fetchKrsReportsCS0000.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReportsCS0000.fulfilled, (state,action) => {
                state.krsReportsCS0000 = action.payload.data || action.payload;
                state.krsReportsCS0000Count = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReportsCS0000.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
            //
            .addCase(fetchKrsReportsCS0100.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReportsCS0100.fulfilled, (state,action) => {
                state.krsReportsCS0100 = action.payload.data || action.payload;
                state.krsReportsCS0100Count = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReportsCS0100.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
            //
            .addCase(fetchKrsReportsCS0200.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReportsCS0200.fulfilled, (state,action) => {
                state.krsReportsCS0200 = action.payload.data || action.payload;
                state.krsReportsCS0200Count = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReportsCS0200.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
            //
            .addCase(fetchKrsReportsCS0301.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReportsCS0301.fulfilled, (state,action) => {
                state.krsReportsCS0301 = action.payload.data || action.payload;
                state.krsReportsCS0301Count = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReportsCS0301.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
            //
            .addCase(fetchKrsReportsCS9999.pending, (state) => {
                state.krsReportsLoading = true
            })
            .addCase(fetchKrsReportsCS9999.fulfilled, (state,action) => {
                state.krsReportsCS9999 = action.payload.data || action.payload;
                state.krsReportsCS9999Count = action.payload.recordsTotal || 0;
                state.krsReportsLoading = false
            })
            .addCase(fetchKrsReportsCS9999.rejected, (state,action) => {
                state.krsReportsLoading = false
            })
    },
  
})

export const {
    setKrsReportsLoading,
    setKrsReportsParams,
    resetKrsReportsParams,

    setKrsReportsCS0000Params,
    resetKrsReportsCS0000Params,

    setKrsReportsCS0100Params,
    resetKrsReportsCS0100Params,

    setKrsReportsCS0200Params,
    resetKrsReportsCS0200Params,

    setKrsReportsCS0301Params,
    resetKrsReportsCS0301Params,

    setKrsReportsCS9999Params,
    resetKrsReportsCS9999Params,
} = krsReportSlice.actions;
export default krsReportSlice.reducer;