import {
  Avatar,
  Typography,
  Button,
  Box,
  Toolbar,
  AppBar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

export default function Header({ handleOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      sx={{
        bgcolor: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 3,
        top: 16,
        left: 16,
        right: 16,
        width: "auto",
      }}
    >
      <Toolbar disableGutters sx={{ px: { xs: 2, md: 4 } }}>
        <Avatar
          src="/logo.jpg"
          variant="square"
          sx={{
            bgcolor: "transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />
        <Typography
          sx={{
            fontWeight: 800,
            color: "#fff",
            fontSize: 22,
            ml: 1.5,
            letterSpacing: "-0.01em",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Galaxy Chat
        </Typography>

        <Box sx={{ display: "flex", gap: 1, ml: "auto", alignItems: "center" }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Button
                key={link.label}
                onClick={() => navigate(link.path)}
                sx={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  textTransform: "none",
                  fontWeight: isActive ? 700 : 500,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: isActive ? "rgba(127,90,240,0.15)" : "transparent",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {link.label}
              </Button>
            );
          })}

          <Button
            variant="contained"
            onClick={handleOpen || (() => navigate("/"))}
            sx={{
              ml: 1,
              px: 3,
              fontWeight: 700,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 100%)",
              boxShadow: "0 4px 15px rgba(127,90,240,0.3)",
              transition: "all 0.25s ease",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #9D7BFF 0%, #7F5AF0 100%)",
                boxShadow: "0 6px 24px rgba(127,90,240,0.45)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
