import { createTheme } from "@mui/material/styles";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";


export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F38A2C" },   // Ember orange
    secondary: { main: "#C14110" }, // Deep orange
    background: {
      default: "#0B0A0D",
      paper: "#15111A",
    },
    text: {
      primary: "#F2F2F5",
      secondary: "#B8B2C1",
    },
    divider: "#2A2331",
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #2A2331",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderBottom: "1px solid #2A2331",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
