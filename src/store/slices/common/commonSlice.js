import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {

}

export const fetchObjects = createAsyncThunk('auth/fetchObjects', async ({activeCompany,app=null,model=null,params=null}) => {
    try {
        const response = await axios.get(`/${app}/${model.toLower()}s/?active_company=${activeCompany.id}`,
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


const commonSlice = createSlice({
    name:"common",
    initialState,
    reducers:{

    },
  
})

export const {setPartnersLoading,setPartnersParams,deletePartners} = commonSlice.actions;
export default commonSlice.reducer;