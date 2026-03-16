import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useState } from "react";
import TubesCursorBg from "../landingPage/TubesCursorBg";
import Header from "../landingPage/Header";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GitHubIcon from "@mui/icons-material/GitHub";

const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: 28 }} />,
    title: "Email",
    value: "support@galaxychat.dev",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
    title: "Location",
    value: "Ho Chi Minh City, Vietnam",
  },
  {
    icon: <GitHubIcon sx={{ fontSize: 28 }} />,
    title: "GitHub",
    value: "github.com/nghiaphamhb",
  },
];

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    color: "#F1F5F9",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#7F5AF0", borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#9D7BFF" },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.3)",
    opacity: 1,
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/wallpaper.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%)",
          zIndex: 0,
        }}
      />
      <TubesCursorBg />
      <Header />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          mx: "auto",
          pt: 14,
          pb: 8,
          px: 3,
        }}
      >
        {/* Hero */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            animation: "fadeInUp 0.8s ease-out",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: 2,
            }}
          >
            Get in{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #7F5AF0, #2CB67D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Touch
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontWeight: 400,
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Have a question or feedback? We'd love to hear from you.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: "rgba(15,23,42,0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#F1F5F9", mb: 3 }}
              >
                Send a Message
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Your Name"
                  fullWidth
                  sx={textFieldSx}
                  value={formData.name}
                  onChange={handleChange("name")}
                />
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  sx={textFieldSx}
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                <TextField
                  label="Message"
                  multiline
                  rows={5}
                  fullWidth
                  sx={textFieldSx}
                  value={formData.message}
                  onChange={handleChange("message")}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{
                    py: 1.4,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #3B2F80 100%)",
                    boxShadow: "0 8px 25px rgba(127,90,240,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #9D7BFF 0%, #8B6BFF 50%, #5A3BFF 100%)",
                      boxShadow: "0 12px 38px rgba(157,123,255,0.45)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                height: "100%",
              }}
            >
              {contactInfo.map((c, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(15,23,42,0.7)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      border: "1px solid rgba(127,90,240,0.3)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(127,90,240,0.2), rgba(44,182,125,0.2))",
                      color: "#9D7BFF",
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {c.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#F1F5F9", fontWeight: 500 }}
                    >
                      {c.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
