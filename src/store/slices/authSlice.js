import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchMenuItems } from "./subscriptionsSlice";
import { fetchCompaniesForStart } from "./organizationSlice";
import { fetchNotifications } from "./notificationSlice";
import { fetchImportProcess } from "./processSlice";

const rawTheme = Cookies.get("theme");
const theme = rawTheme === "dark" || rawTheme === "light" ? rawTheme : "light";

const initialState = {
    user:null,
    status:false,
    csrfToken:"",
    wrongPath:false,
    dark:false,
    theme:theme,
    logo:require(`../../images/logo/light/ari-logo-full.png`),
    loading:true,
    authMessage:{color:"",icon:"",text:""},
    userInformation:{},
    verifyPhoneNumber:""
}

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_,{ dispatch,rejectWithValue,extra: { navigate } }) => {
    try {
        const sessionResponse = await axios.get(`/users/session/`, {withCredentials: true});
        if(sessionResponse.status === 200 && sessionResponse.data.authenticated){
            const response = await axios.get(`/users/api/users/type_current/`, {withCredentials: true});
            return response.data[0];
        };
        navigate("/auth/login");
        return null;
    } catch (error) {
        return rejectWithValue(null);
    }
    
    //throw new Error('Session not authenticated');
});

export const fetchCSRFToken = createAsyncThunk('auth/fetchCSRFToken', async (_,{ rejectWithValue,dispatch }) => {
    try{
        const response = await axios.get(`/users/csrf_token_get/`, {withCredentials: true});
        return response.data.csrfToken;
    }catch(error){
        return rejectWithValue(null);
    }
    
});

export const changeTheme = createAsyncThunk('auth/changeTheme', async (darkTerm, {getState}) => {
    const { user } = getState().auth;
    try {
        await axios.put(`/users/api/user_profiles/${user["profile"]}/`, 
            {
                pk : user["profile"],
                theme : darkTerm ? "dark" : "light",
            },
            {withCredentials: true},
        );
        return darkTerm;
    } catch {
        return darkTerm;
    }
});

export const loginAuth = createAsyncThunk('auth/loginAuth', async ({email, password, remember},{ rejectWithValue }) => {
    try {
        const response = await axios.post('/users/login/', { 
            email:email,
            password:password,
            remember:remember
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

export const logoutAuth = createAsyncThunk('auth/logoutAuth', async () => {
    const response = await axios.post('/users/logout/', { withCredentials: true});
    return response.data;
});

export const registerAuth = createAsyncThunk('auth/registerAuth', async (form,{rejectWithValue}) => {
    try {
        const response = await axios.post('/users/register/', { 
            email:form.email,
            password:form.password,
            passwordConfirmation:form.passwordConfirmation,
            firstName:form.firstName,
            lastName:form.lastName,
            refCode:form.refCode
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

export const forgotPasswordAuth = createAsyncThunk('auth/forgotPasswordAuth', async (email,{rejectWithValue}) => {
    try {
        const response = await axios.post('/users/password_reset/', { 
            email:email
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

export const fetchUserInformation = createAsyncThunk('auth/fetchUserInformation', async (email,{rejectWithValue}) => {
    try {
        const response = await axios.post('/users/user_information/', { 
            email:email
        },{ withCredentials: true, });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            status:error.status,
            message:error.response.data.message
        });
    };
});

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setLoading: (state,action) => {
            state.loading = action.payload;
        },
        setCSRFToken: (state,action) => {
            state.csrfToken = action.payload;
        },
        fetchTheme: (state,action) => {
            document.documentElement.setAttribute("data-mdb-theme", action.payload);
            state.theme = action.payload;
            state.logo = require(`../../images/logo/${action.payload}/ari-logo-full.png`);
            document.cookie = `theme=${action.payload}; path=/; ${process.env.REACT_APP_SAME_SITE}`;

        },
        setAuthMessage: (state,action) => {
            state.authMessage = action.payload;
        },
        clearAuthMessage: (state,action) => {
            state.authMessage = "";
        },
        setVerifyPhoneNumber: (state,action) => {
            state.verifyPhoneNumber = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //fetch user
            .addCase(fetchUser.pending, (state) => {
                //state.loading = true
            })
            .addCase(fetchUser.fulfilled, (state,action) => {
                if(action.payload){
                    state.user = action.payload || null;
                    state.status = true;
                    state.dark = action.payload["theme"] === "light" ? false : true;
                    state.theme = action.payload["theme"];
                    document.cookie = `theme=${action.payload["theme"]}; path=/; ${process.env.REACT_APP_SAME_SITE || "Lax"}`;
                };
                
                //const wsMain = new WebSocket("ws://localhodst:8000/api/ws/socket/1/");
                // const wsMain = new WebSocket(
                //     (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
                //     + window.location.host
                //     + '/ws/socket/'
                //     + action.payload.id
                //     + '/'
                // );

                // wsMain.onopen = function() {
                //     console.log('WebSocket bağlantısı başarıyla kuruldu.');
                // };
                // wsMain.onerror = function(error) {
                //     console.error('WebSocket hatası:', error);
                //     wsMain.close();
                // };
                
                // wsMain.onclose = function () {
                //     console.log("Websocket kapatıldı!");
                // };
                
                
                
            })
            .addCase(fetchUser.rejected, (state,action) => {
                state.status = false;
            })

            //fetch csrftoken
            .addCase(fetchCSRFToken.fulfilled, (state,action) => {
                state.csrfToken = action.payload;
                axios.defaults.headers['X-CSRFToken'] = action.payload;
                axios.defaults.withCredentials = true
            })
            
            //change theme
            .addCase(changeTheme.fulfilled, (state,action) => {
                state.dark = action.payload;
                state.theme = action.payload ? "dark" : "light";
                state.logo = action.payload
                    ? require(`../../images/logo/dark/ari-logo-full.png`)
                    : require(`../../images/logo/light/ari-logo-full.png`)
                document.cookie = action.payload
                    ? `theme=dark; path=/; ${process.env.REACT_APP_SAME_SITE}`
                    : `theme=light; path=/; ${process.env.REACT_APP_SAME_SITE}`
            })

            //login
            .addCase(loginAuth.pending, (state) => {

            })
            .addCase(loginAuth.fulfilled, (state,action) => {
                state.user = action.payload.user;
                state.status = true;
                state.theme = action.payload.user.theme;
                state.dark = action.payload.user.theme === "dark" ? true : false;
                localStorage.setItem("login", Date.now());
            })
            .addCase(loginAuth.rejected, (state,action) => {
                state.status = false;
                state.authMessage = action.payload.status === 401
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })

            //logout
            .addCase(logoutAuth.pending, (state) => {

            })
            .addCase(logoutAuth.fulfilled, (state,action) => {
                state.user = null;
                state.status = false;
                localStorage.setItem("logout", Date.now());
            })
            .addCase(logoutAuth.rejected, (state,action) => {
                state.authMessage = {color:"",icon:"",text:""};
            })

            //register
            .addCase(registerAuth.pending, (state) => {

            })
            .addCase(registerAuth.fulfilled, (state,action) => {
                state.user = action.payload.user;
                state.status = true;
            })
            .addCase(registerAuth.rejected, (state,action) => {

                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })

            //forgot password
            .addCase(forgotPasswordAuth.pending, (state) => {

            })
            .addCase(forgotPasswordAuth.fulfilled, (state,action) => {

            })
            .addCase(forgotPasswordAuth.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })

            //fetch user information
            .addCase(fetchUserInformation.pending, (state) => {

            })
            .addCase(fetchUserInformation.fulfilled, (state,action) => {
                state.userInformation = action.payload.user;
            })
            .addCase(fetchUserInformation.rejected, (state,action) => {
                state.authMessage = action.payload.status === 400
                    ? {color:"text-red-500",icon:"",text:action.payload.message}
                    : {color:"text-red-500",icon:"fas fa-triangle-exclamation",text:"Sorry, something went wrong!"}
            })
                
    }
})


export const {setLoading,setCSRFToken,fetchTheme,setAuthMessage,clearAuthMessage,setVerifyPhoneNumber} = authSlice.actions;
export default authSlice.reducer;