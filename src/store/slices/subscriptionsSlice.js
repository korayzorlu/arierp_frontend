import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
    menuItems:[],
}

export const fetchMenuItems = createAsyncThunk('auth/fetchMenuItems', async () => {
    const response = await axios.get(`/subscriptions/api/menu_items`, {withCredentials: true});
    return response.data[0].menu_items;
});

const subscriptionsSlice = createSlice({
    name:"subscriptions",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            //fetch user
            .addCase(fetchMenuItems.pending, (state) => {
                
            })
            .addCase(fetchMenuItems.fulfilled, (state,action) => {
                state.menuItems = action.payload;
            })
            .addCase(fetchMenuItems.rejected, (state,action) => {

            })

                
    }
})

export const {} = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;