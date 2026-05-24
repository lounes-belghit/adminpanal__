import { createTheme, PaletteMode } from '@mui/material';

export const getAppTheme = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#1a73e8', // A nice Algerian blue or standard professional blue
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'light'
                        ? '0px 2px 4px rgba(0,0,0,0.05)'
                        : '0px 4px 20px rgba(0,0,0,0.5)',
                },
            },
        },
    },
});
