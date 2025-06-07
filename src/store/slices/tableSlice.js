import { createSlice } from "@reduxjs/toolkit";
import { createTheme } from "@mui/material/styles";


const initialState = {
    tableLightTheme:createTheme({
        palette: {
            mode: 'light',
        },
        components: {
            MuiDataGrid: {
                defaultProps: {
                    rowHeight: 40,
                    headerHeight: 40,
                },
                styleOverrides: {
                    root: {
                        backgroundColor: "#fff",
                        border:0,
                        borderRadius:0,
                    },
                },
            },
        },
    }),
    tableDarkTheme:createTheme({
        palette: {
            mode: 'dark',
        },
        components: {
            MuiDataGrid: {
                defaultProps: {
                    rowHeight: 40,
                    headerHeight: 40,
                },
                styleOverrides: {
                    root: {
                        backgroundColor: "#1b1f23",
                        border:0,
                        borderRadius:0,
                    },
                },
            },
        },
    }),
}

const tableSlice = createSlice({
    name:"table",
    initialState,
    reducers:{
        setAlert: (state,action) => {

        },
    },
  
})



export const {} = tableSlice.actions;
export default tableSlice.reducer;