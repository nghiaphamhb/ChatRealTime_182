import {
  Avatar,
  Typography,
  Button,
  Box,
  Toolbar,
  AppBar,
} from "@mui/material";

export default function Header({ handleOpen }) {
  return (
    <AppBar sx={{ bgcolor: "transparent", boxShadow: "none" }}>
      <Toolbar disableGutters sx={{ px: 8 }}>
        <Avatar
          src="/logo.jpg"
          variant="square"
          sx={{ bgcolor: "transparent", backgroundColor: "transparent" }}
        />
        <Typography
          sx={{ fontWeight: 900, color: "#fff", fontSize: 28, ml: 2 }}
        >
          Rainbow Chat
        </Typography>

        <Box sx={{ display: "flex", gap: 4, ml: "auto", alignItems: "center" }}>
          {["Home", "About", "Services", "Contact"].map((t) => (
            <Button
              key={t}
              sx={{
                color: "#fff",
                textTransform: "none",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: -6,
                  width: "100%",
                  height: 3,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform .5s",
                },
                "&:hover::after": { transform: "scaleX(1)" },
              }}
            >
              {t}
            </Button>
          ))}

          <Button
            variant="outlined"
            onClick={handleOpen}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              px: 3,
              "&:hover": {
                bgcolor: "#fff",
                color: "#162938",
                borderColor: "#fff",
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
