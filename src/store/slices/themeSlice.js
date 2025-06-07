import { createSlice } from "@reduxjs/toolkit";
import { createTheme } from "@mui/material/styles";

const commonTheme = {
    typography: {
        fontFamily: [
            '-apple-system',
            'system-ui',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Fira Sans',
            'Ubuntu',
            'Oxygen',
            'Oxygen Sans',
            'Cantarell',
            'Droid Sans',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Lucida Grande',
            'Helvetica',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiDataGrid: {
            defaultProps: {
                rowHeight: 40,
                headerHeight: 40,
            },
            styleOverrides: {
                root: {
                    border: 0,
                    borderRadius: 0,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundImage: "none",
                },
            },
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    textAlign: "center",
                    lineHeight: "36px",
                },
            },
        },
    },
};

const initialState = {
    // muiLightTheme:createTheme({
    //     ...commonTheme,
    //     palette: {
    //         mode: 'light',
    //     },
    //     components: {
    //         ...commonTheme.components,
    //         MuiDataGrid: {
    //             ...commonTheme.components.MuiDataGrid,
    //             styleOverrides: {
    //                 ...commonTheme.components.MuiDataGrid.styleOverrides,
    //                 root: {
    //                     ...commonTheme.components.MuiDataGrid.styleOverrides.root,
    //                     backgroundColor: "#fff",
    //                 },
    //             },
    //         },
    //         MuiListItem: {
    //             styleOverrides: {
    //                 root: {
    //                     color: "#000",
    //                 },
    //             },
    //         },
    //         MuiListItemIcon: {
    //             styleOverrides: {
    //                 root: {
    //                     color: "#000",
    //                 },
    //             },
    //         },
    //     },
    // }),
    // muiDarkTheme:createTheme({
    //     ...commonTheme,
    //     palette: {
    //         mode: 'dark',
    //     },
    //     components: {
    //         ...commonTheme.components,
    //         MuiDataGrid: {
    //             ...commonTheme.components.MuiDataGrid,
    //             styleOverrides: {
    //                 ...commonTheme.components.MuiDataGrid.styleOverrides,
    //                 root: {
    //                     ...commonTheme.components.MuiDataGrid.styleOverrides.root,
    //                     backgroundColor: "#1b1f23",
    //                 },
    //             },
    //         },
    //         MuiPaper: {
    //             styleOverrides: {
    //                 root: {
    //                     ...commonTheme.components.MuiPaper.styleOverrides.root,
    //                     backgroundColor: "#1b1f23",
    //                 }
    //             }
    //         },
    //         MuiListSubheader: {
    //             ...commonTheme.components.MuiListSubheader,
    //             styleOverrides: {
    //                 ...commonTheme.components.MuiListSubheader.styleOverrides,
    //                 root: {
    //                     ...commonTheme.components.MuiListSubheader.styleOverrides.root,
    //                     backgroundColor: "#1b1f23",
    //                 },
    //             },
    //         },
    //         MuiDivider: {
    //             styleOverrides: {
    //                 root: {
    //                     borderColor: "rgba(255, 255, 255, 0.24)",
    //                 },
    //             },
    //         },
    //     },
    // }),
}

const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        
    },
  
})



export const {} = themeSlice.actions;
export default themeSlice.reducer;