import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    bddkHesaplar:[],
    bddkHesaplarCount:0,
    bddkHesaplarParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    bddkHesaplarLoading:false,
    //
    bl222af:[],
    bl222afCount:0,
    bl222afParams:{
        start: 0 * 100,
        length: (0 + 1) * 100,
        format: 'datatables'
    },
    bl222afLoading:false,
    //
    kz222af:[],
    kz222afCount:0,
    kz222afParams:{
        start: 0 * 100,
        length: (0 + 1) * 100,
        format: 'datatables'
    },
    kz222afLoading:false,
}

export const fetchBddkHesaplar = createAsyncThunk('auth/fetchBddkHesaplar', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/bddk_hesaplar/?ac=${activeCompany.id}`,
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
    
export const fetchBl222af = createAsyncThunk('auth/fetchBl222af', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/bl222af/?ac=${activeCompany.id}`,
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

export const fetchKz222af = createAsyncThunk('auth/fetchKz222af', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/accounting/kz222af/?ac=${activeCompany.id}`,
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

const bddkSlice = createSlice({
    name:"bddk",
    initialState,
    reducers:{
        setBddkHesaplarLoading: (state,action) => {
            state.bddkHesaplarLoading = action.payload;
        },
        setBddkHesaplarParams: (state,action) => {
            state.bddkHesaplarParams = {
                ...state.bddkHesaplarParams,
                ...action.payload
            };
        },
        resetBddkHesaplarParams: (state,action) => {
            state.bddkHesaplarParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
        deleteBddkHesaplar: (state,action) => {
            state.bddkHesaplar = [];
        },
        //
        setBl222afLoading: (state,action) => {
            state.bl222afLoading = action.payload;
        },
        setBl222afParams: (state,action) => {
            state.bl222afParams = {
                ...state.bl222afParams,
                ...action.payload
            };
        },
        resetBl222afParams: (state,action) => {
            state.bl222afParams = {
                start: 0 * 120,
                length: (0 + 1) * 120,
                format: 'datatables'
            };
        },
        deleteBl222af: (state,action) => {
            state.bl222af = [];
        },
        //
        setKz222afLoading: (state,action) => {
            state.kz222afLoading = action.payload;
        },
        setKz222afParams: (state,action) => {
            state.kz222afParams = {
                ...state.kz222afParams,
                ...action.payload
            };
        },
        resetKz222afParams: (state,action) => {
            state.kz222afParams = {
                start: 0 * 120,
                length: (0 + 1) * 120,
                format: 'datatables'
            };
        },
        deleteKz222af: (state,action) => {
            state.kz222af = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBddkHesaplar.pending, (state) => {
                state.bddkHesaplarLoading = true
            })
            .addCase(fetchBddkHesaplar.fulfilled, (state,action) => {
                state.bddkHesaplar = action.payload.data || action.payload;
                state.bddkHesaplarCount = action.payload.recordsTotal || 0;
                state.bddkHesaplarLoading = false
            })
            .addCase(fetchBddkHesaplar.rejected, (state,action) => {
                state.bddkHesaplarLoading = false
            })
            //
            .addCase(fetchBl222af.pending, (state) => {
                state.bl222afLoading = true
            })
            .addCase(fetchBl222af.fulfilled, (state,action) => {
                state.bl222af = action.payload.data || action.payload;
                state.bl222afCount = action.payload.recordsTotal || 0;
                state.bl222afLoading = false
            })
            .addCase(fetchBl222af.rejected, (state,action) => {
                state.bl222afLoading = false
            })
            //
            .addCase(fetchKz222af.pending, (state) => {
                state.kz222afLoading = true
            })
            .addCase(fetchKz222af.fulfilled, (state,action) => {
                state.kz222af = action.payload.data || action.payload;
                state.kz222afCount = action.payload.recordsTotal || 0;
                state.kz222afLoading = false
            })
            .addCase(fetchKz222af.rejected, (state,action) => {
                state.kz222afLoading = false
            })
    },
  
})

export const {
    setBddkHesaplarLoading,
    setBddkHesaplarParams,
    resetBddkHesaplarParams,
    deleteBddkHesaplar,
    setBl222afLoading,
    setBl222afParams,
    resetBl222afParams,
    deleteBl222af,
    setKz222afLoading,
    setKz222afParams,
    resetKz222afParams,
    deleteKz222af
} = bddkSlice.actions;
export default bddkSlice.reducer;