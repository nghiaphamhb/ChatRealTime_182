import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#7F5AF0",
      light: "#9D7BFF",
      dark: "#5A3BFF",
    },
    secondary: {
      main: "#2CB67D",
    },
    background: {
      default: "#0F172A",
      paper: "rgba(15, 23, 42, 0.85)",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "rgba(148, 163, 184, 0.8)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
