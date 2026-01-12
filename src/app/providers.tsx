"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ff8a1f" },
    secondary: { main: "#ff5a1a" },
    background: {
      default: "#07070a",
      paper: "rgba(18,18,24,0.72)",
    },
    text: {
      primary: "rgba(255,255,255,0.92)",
      secondary: "rgba(255,255,255,0.64)",
    },
    divider: "rgba(255,255,255,0.10)",
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    h5: { fontWeight: 900 },
    h6: { fontWeight: 900 },
    button: { textTransform: "none", fontWeight: 800 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          letterSpacing: "0.2px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(14px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingLeft: 14,
          paddingRight: 14,
        },
        contained: {
          boxShadow: "0 10px 28px rgba(255, 138, 31, 0.18)",
        },
        outlined: {
          borderColor: "rgba(255, 138, 31, 0.35)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          borderColor: "rgba(255, 138, 31, 0.35)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.10)",
        },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
