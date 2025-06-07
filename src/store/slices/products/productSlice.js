import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    products:[],
    productsCount:0,
    productsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    productsLoading:false,
}

export const fetchProducts = createAsyncThunk('auth/fetchProducts', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/products/products/?active_company=${activeCompany.id}`,
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

const productSlice = createSlice({
    name:"product",
    initialState,
    reducers:{
        setProductsLoading: (state,action) => {
            state.productsLoading = action.payload;
        },
        setProductsParams: (state,action) => {
            state.productsParams = {
                ...state.productsParams,
                ...action.payload
            };
        },
        deleteProducts: (state,action) => {
            state.products = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.productsLoading = true
            })
            .addCase(fetchProducts.fulfilled, (state,action) => {
                state.products = action.payload.data || action.payload;
                state.productsCount = action.payload.recordsTotal || 0;
                state.productsLoading = false
            })
            .addCase(fetchProducts.rejected, (state,action) => {
                state.productsLoading = false
            })
    },
  
})

export const {setProductsLoading,setProductsParams,deleteProducts} = productSlice.actions;
export default productSlice.reducer;