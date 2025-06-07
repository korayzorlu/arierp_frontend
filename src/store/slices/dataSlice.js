import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    countries:[],
    cities:[],
    currencies:[],
    countriesLoading:false,
    citiesLoading:false,
    currenciesLoading:false,
}

export const fetchCountries = createAsyncThunk('data/fetchCountries', async () => {
    const response = await axios.get(`/common/api/countries/`, {withCredentials: true});
    return response.data;
});

export const fetchCities = createAsyncThunk('data/fetchCities', async ({country,name}) => {
    const response = await axios.get(`/common/api/cities/?country=${country}&name=${name}`,
        {
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
    });
    return response.data;
});

export const fetchCurrencies = createAsyncThunk('data/fetchCurrencies', async () => {
    const response = await axios.get(`/common/api/currencies/`, {withCredentials: true});
    return response.data;
});

const dataSlice = createSlice({
    name:"data",
    initialState,
    reducers:{
        deleteCountries: (state,action) => {
            state.countries = [];
        },
        deleteCities: (state,action) => {
            state.cities = [];
        },
    },
    extraReducers: (builder) => {
        builder
            //fetch countries
            .addCase(fetchCountries.pending, (state) => {
                state.countriesLoading = true;
            })
            .addCase(fetchCountries.fulfilled, (state,action) => {
                state.countries = action.payload;
                state.countriesLoading = false;
            })
            .addCase(fetchCountries.rejected, (state,action) => {
                state.countriesLoading = false;
            })
            //fetch cities
            .addCase(fetchCities.pending, (state) => {
                state.citiesLoading = true;
            })
            .addCase(fetchCities.fulfilled, (state,action) => {
                state.cities = action.payload;
                state.citiesLoading = false;
            })
            .addCase(fetchCities.rejected, (state,action) => {
                state.citiesLoading = false;
            })
            //fetch currencies
            .addCase(fetchCurrencies.pending, (state) => {
                state.currenciesLoading = true;
            })
            .addCase(fetchCurrencies.fulfilled, (state,action) => {
                state.currencies = action.payload;
                state.currenciesLoading = false;
            })
            .addCase(fetchCurrencies.rejected, (state,action) => {
                state.currenciesLoading = false;
            })
    }
})

export const {deleteCountries,deleteCities} = dataSlice.actions;
export default dataSlice.reducer;