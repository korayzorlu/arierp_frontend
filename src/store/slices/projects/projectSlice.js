import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setIsProgress } from "../processSlice";
import { setAlert, setDialog } from "../notificationSlice";

const initialState = {
    projects:[],
    projectsCount:0,
    projectsParams:{
        start: 0 * 50,
        end: (0 + 1) * 50,
        format: 'datatables'
    },
    projectsLoading:false,
}

export const fetchProjects = createAsyncThunk('auth/fetchProjects', async ({activeCompany,serverModels=null,params=null}) => {
    try {
        const response = await axios.get(`/projects/projects/?active_company=${activeCompany.id}`,
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

export const fetchProject = createAsyncThunk('auth/fetchProject', async ({activeCompany,params=null},{dispatch,rejectWithValue,extra: { navigate }}) => {
    dispatch(setIsProgress(true));
    try {
        const response = await axios.get(`/projects/projects/?active_company=${activeCompany.id}`,
            {   
                params : params,
                headers: {"X-Requested-With": "XMLHttpRequest"}
            }
        );
        if(response.data.length > 0){
            return response.data[0];
        }else{
            navigate("/projects");
            return {}
        }
    } catch (error) {
        dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        return {}
    } finally {
        dispatch(setIsProgress(false));
    }
});

const projectSlice = createSlice({
    name:"project",
    initialState,
    reducers:{
        setProjectsLoading: (state,action) => {
            state.projectsLoading = action.payload;
        },
        setProjectsParams: (state,action) => {
            state.projectsParams = {
                ...state.projectsParams,
                ...action.payload
            };
        },
        resetProjectsParams: (state,action) => {
            state.projectsParams = {
                start: 0 * 50,
                end: (0 + 1) * 50,
                format: 'datatables'
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.projectsLoading = true
            })
            .addCase(fetchProjects.fulfilled, (state,action) => {
                state.projects = action.payload.data || action.payload;
                state.projectsCount = action.payload.recordsTotal || 0;
                state.projectsLoading = false
            })
            .addCase(fetchProjects.rejected, (state,action) => {
                state.projectsLoading = false
            })
            
    },
  
})

export const {setProjectsLoading,setProjectsParams,resetProjectsParams} = projectSlice.actions;
export default projectSlice.reducer;