import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    mobile:"",
    collapse:Cookies.get("collapse") === "true" ? true : false,
    toggle:false,
    contentWidth:{sidebar:"240px",page:"calc(100% - 240px)"},
    tabNavItems:[],
    tabNavContents:[],
}

const sidebarSlice = createSlice({
    name:"sidebar",
    initialState,
    reducers:{
        setSidebar: (state,action) => {
            console.log(action.payload)
            state.collapse = action.payload.collapseTerm;
            state.toggle = action.payload.toggleTerm;
            state.mobile = window.innerWidth <= 1024 ? true : false;
            state.contentWidth = window.innerWidth <= 1024
                ? {sidebar:"0",page:"100%"}
                : (action.payload.collapseTerm)
                    ? {sidebar:"78px",page:"calc(100% - 78px)"}
                    : {sidebar:"240px",page:"calc(100% - 240px)"};
            document.cookie = `collapse=${action.payload.collapseTerm}; path=/; ${process.env.REACT_APP_SAME_SITE}`;
        },
        checkMobile: (state,action) => {
            state.mobile = window.innerWidth <= 1024 ? true : false;
            state.contentWidth = window.innerWidth <= 1024
                ? {sidebar:"0",page:"100%"}
                : (Cookies.get("collapse") === "true")
                    ? {sidebar:"78px",page:"calc(100% - 78px)"}
                    : {sidebar:"240px",page:"calc(100% - 240px)"};

        },
        setResize: (state,action) => {
            state.mobile = window.innerWidth <= 1024 ? true : false;
            state.contentWidth = window.innerWidth <= 1024
                ? {sidebar:"0",page:"100%"}
                : {sidebar:"240px",page:"calc(100% - 240px)"};
        },
    },
  
})

export const {setSidebar,checkMobile,setResize} = sidebarSlice.actions;
export default sidebarSlice.reducer;