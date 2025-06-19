import React, { createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { trTR } from '@mui/x-data-grid/locales';

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
    palette: {
        blackhole: {
            main: '#000',
            contrastText: '#fff',
        },
        whitehole: {
            main: '#fff',
            contrastText: '#000',
        },
        navyblack: {
            main: '#1b1f23',
            contrastText: '#fff',
        },
        cream: {
            main: '#F4F2EE',
            contrastText: '#000',
        },
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
                    //borderRadius: 0,
                    //backgroundImage: "none",
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
        MuiChip: {
            styleOverrides: {
                root: {
                    //borderRadius: "4px",
                },
            },
        },
    },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const {theme} = useSelector((store) => store.auth);

    const muiLightTheme = () => createTheme({
        ...commonTheme,
        palette: {
            ...commonTheme.palette,
            mode: 'light',
            opposite: {
                main: '#000',
                contrastText: '#fff',
            },
            mars: {
                main: '#d9ce32',
                contrastText: '#000',
            },
            panelbox: {
                main: '#fff',
                contrastText: '#000',
            },
        },
        components: {
            ...commonTheme.components,
            MuiDataGrid: {
                ...commonTheme.components.MuiDataGrid,
                styleOverrides: {
                    ...commonTheme.components.MuiDataGrid.styleOverrides,
                    root: {
                        ...commonTheme.components.MuiDataGrid.styleOverrides.root,
                        backgroundColor: "#fff",
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        color: "#000",
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        color: "#000",
                    },
                },
            },
        },
    },trTR)
    const muiDarkTheme = () => createTheme({
        ...commonTheme,
        palette: {
            ...commonTheme.palette,
            mode: 'dark',
            opposite: {
                main: '#fff',
                contrastText: '#000',
            },
            mars: {
                main: '#efe237',
                contrastText: '#000',
            },
            panelbox: {
                main: '#1b1f23',
                contrastText: '#fff',
            },
        },
        components: {
            ...commonTheme.components,
            MuiDataGrid: {
                ...commonTheme.components.MuiDataGrid,
                styleOverrides: {
                    ...commonTheme.components.MuiDataGrid.styleOverrides,
                    root: {
                        ...commonTheme.components.MuiDataGrid.styleOverrides.root,
                        backgroundColor: "#1b1f23",
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        ...commonTheme.components.MuiPaper.styleOverrides.root,
                        backgroundColor: "#1b1f23",
                    }
                }
            },
            MuiListSubheader: {
                ...commonTheme.components.MuiListSubheader,
                styleOverrides: {
                    ...commonTheme.components.MuiListSubheader.styleOverrides,
                    root: {
                        ...commonTheme.components.MuiListSubheader.styleOverrides.root,
                        backgroundColor: "#1b1f23",
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: "rgba(255, 255, 255, 0.24)",
                    },
                },
            },
        },
    },trTR)

    return (
        <ThemeContext.Provider value={{ theme }}>
            <MuiThemeProvider theme={theme === "light" ? muiLightTheme() : muiDarkTheme()}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};