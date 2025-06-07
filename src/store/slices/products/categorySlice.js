import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    categories:[],
    categoriesCount:0,
    categoriesParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    categoriesLoading:false,
}

export const fetchCategories = createAsyncThunk('auth/fetchCategories', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/products/categories/?active_company=${activeCompany.id}`,
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

export const fetchCategory = createAsyncThunk('auth/fetchCategory', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/products/categories/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/categories");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

export const addCategory = createAsyncThunk('auth/addCategory', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/products/add_category/`,
            data,
            { 
                withCredentials: true
            },
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}))
        navigate("/categories");
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

export const updateCategory = createAsyncThunk('auth/updateCategory', async ({data=null},{dispatch}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/products/update_category/`,
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

export const deleteCategory = createAsyncThunk('auth/deleteCategory', async ({data=null},{dispatch,extra: {navigate}}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.post(`/products/delete_category/`,
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
        navigate("/categories");
    }
});

const categorySlice = createSlice({
    name:"category",
    initialState,
    reducers:{
        setCategoriesLoading: (state,action) => {
            state.categoriesLoading = action.payload;
        },
        setCategoriesParams: (state,action) => {
            state.categoriesParams = {
                ...state.categoriesParams,
                ...action.payload
            };
        },
        deleteCategories: (state,action) => {
            state.categories = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true
            })
            .addCase(fetchCategories.fulfilled, (state,action) => {
                state.categories = action.payload.data || action.payload;
                state.categoriesCount = action.payload.recordsTotal || 0;
                state.categoriesLoading = false
            })
            .addCase(fetchCategories.rejected, (state,action) => {
                state.categoriesLoading = false
            })
    },
  
})

export const {setCategoriesLoading,setCategoriesParams,deleteCategories} = categorySlice.actions;
export default categorySlice.reducer;