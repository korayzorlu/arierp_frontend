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
        ari: {
            main: '#980748',
            contrastText: '#fff',
        },
        smoke: {
            main: '#4e2337',
            contrastText: '#fff',
        },
        blackhole: {
            main: '#000',
            contrastText: '#fff',
        },
        cream: {
            main: '#F4F2EE',
            contrastText: '#000',
        },
        frostedbirch: {
            main: '#D1C6B8',
            contrastText: '#000',
        },
        greengecko: {
            main: '#46c22aff',
            contrastText: '#000',
        },
        navyblack: {
            main: '#1b1f23',
            contrastText: '#fff',
        },
        neonnavy: {
            main: '#131937',
            contrastText: '#fff',
        },
        neonnephrite: {
            main: '#3D8C28',
            contrastText: '#fff',
        },
        silvercoin: {
            main: '#E4DDD3',
            contrastText: '#000',
        },
        snowfall: {
            main: '#E7DFD9',
            contrastText: '#000',
        },
        steelplate: {
            main: '#6E767A',
            contrastText: '#000',
        },
        whitehole: {
            main: '#fff',
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
            celticglow: {
                main: '#009562',
                contrastText: '#fff',
            },
            bluelemonade: {
                main: '#0045B0',
                contrastText: '#fff',
            },
            opposite: {
                main: '#000',
                contrastText: '#fff',
            },
            mars: {
                main: '#d9ce32',
                contrastText: '#000',
            },
            metallicblue: {
                main: '#05308C',
                contrastText: '#fff',
            },
            metallicgold: {
                main: '#DAA51D',
                contrastText: '#000',
            },
            metallicorange: {
                main: '#EE9103',
                contrastText: '#fff',
            },
            panelbox: {
                main: '#fff',
                contrastText: '#000',
            },
            paper: {
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
            MuiAccordion: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#f4f2ee",
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
            celticglow: {
                main: '#009562',
                contrastText: '#000',
            },
            bluelemonade: {
                main: '#0045AC',
                contrastText: '#fff',
            },
            opposite: {
                main: '#fff',
                contrastText: '#000',
            },
            mars: {
                main: '#efe237',
                contrastText: '#000',
            },
            metallicblue: {
                main: '#0045AC',
                contrastText: '#fff',
            },
            metallicgold: {
                main: '#D1CE21',
                contrastText: '#000',
            },
            metallicorange: {
                main: '#EA9A00',
                contrastText: '#fff',
            },
            panelbox: {
                main: '#1b1f23',
                contrastText: '#fff',
            },
            paper: {
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