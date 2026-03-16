import {
  Dialog,
  Zoom,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import SyncLockIcon from "@mui/icons-material/SyncLock";

const accentGradient =
  "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #3B2F80 100%)";
const accentGradientHover =
  "linear-gradient(135deg, #9D7BFF 0%, #8B6BFF 50%, #5A3BFF 100%)";

const inputSx = {
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.45)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#9D7BFF" },
  "& .MuiInputBase-input": { color: "#F1F5F9" },
  "& .MuiInput-underline:before": {
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "rgba(255,255,255,0.4)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#7F5AF0",
  },
};

export default function AuthDialog({ open = false, handleClose }) {
  const navigate = useNavigate();
  const [isRegister, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const changeMode = () => {
    setRegister((prev) => !prev);
    setUsername("");
    setDisplayName("");
    setPassword("");
    setRepPassword("");
  };

  const submit = async () => {
    setAlert(null);

    const payload = isRegister
      ? { displayName, username, password }
      : { username, password };

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 403) {
        setAlert({
          type: "error",
          msg: isRegister ? "This account already exists!" : "Login failed!",
        });
      } else {
        setAlert({ type: "error", msg: "Server error" });
      }
      return;
    }

    const data = await res.json();
    const token = data?.token;

    setAlert({
      type: "success",
      msg: isRegister ? "Register successful!" : "Login successful!",
    });

    if (!isRegister) {
      localStorage.setItem("token", token);
      navigate("/home");
    }
  };

  const unMatchPassword = isRegister && repPassword && repPassword !== password;
  const disableSubmit =
    (isRegister && (!password || !repPassword || unMatchPassword)) ||
    (!isRegister && !password);

  const iconColor = "rgba(255,255,255,0.35)";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Zoom}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: 420,
          padding: 4,
          borderRadius: 4,
          border: "1px solid rgba(127,90,240,0.2)",
          bgcolor: "rgba(15,23,42,0.92)",
          backdropFilter: "blur(30px)",
          boxShadow:
            "0 0 60px rgba(127,90,240,0.15), 0 25px 50px rgba(0,0,0,0.5)",
          overflow: "hidden",
          color: "rgba(255,255,255,0.85)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, #7F5AF0, #2CB67D, #7F5AF0)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          },
          "@keyframes shimmer": {
            "0%": { backgroundPosition: "100% 0" },
            "100%": { backgroundPosition: "-100% 0" },
          },
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 36,
          height: 36,
          color: "rgba(255,255,255,0.4)",
          transition: "all 0.2s",
          "&:hover": {
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          mx: "auto",
          pb: 2,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #F1F5F9, #9D7BFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {isRegister ? "Register" : "Welcome back"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Display name */}
        {isRegister ? (
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <BadgeIcon sx={{ mr: 1, my: 0.5, color: iconColor }} />
            <TextField
              fullWidth
              id="display-name"
              label="Display name"
              variant="standard"
              sx={inputSx}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Box>
        ) : (
          <></>
        )}

        {/* Username */}
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccountCircle sx={{ mr: 1, my: 0.5, color: iconColor }} />
          <TextField
            fullWidth
            id="username"
            label="Username"
            variant="standard"
            sx={inputSx}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>

        {/* Password */}
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <KeyIcon sx={{ mr: 1, my: 0.5, color: iconColor }} />
          <FormControl fullWidth variant="standard">
            <InputLabel
              htmlFor="standard-adornment-password"
              sx={{
                color: "rgba(255,255,255,0.45)",
                "&.Mui-focused": { color: "#9D7BFF" },
              }}
            >
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              sx={{
                color: "#F1F5F9",
                "&:before": {
                  borderBottomColor: "rgba(255,255,255,0.15)",
                },
                "&:hover:not(.Mui-disabled, .Mui-error):before": {
                  borderBottomColor: "rgba(255,255,255,0.4)",
                },
                "&:after": { borderBottomColor: "#7F5AF0" },
                "& input::-ms-reveal, & input::-ms-clear": {
                  display: "none",
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{
                      color: "rgba(255,255,255,0.35)",
                      "&:hover": { color: "#9D7BFF" },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Box>

        {/* Repeat password */}
        {isRegister ? (
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <SyncLockIcon sx={{ mr: 1, my: 0.5, color: iconColor }} />
            <FormControl fullWidth variant="standard" error={unMatchPassword}>
              <InputLabel
                htmlFor="repeat-password"
                sx={{
                  color: "rgba(255,255,255,0.45)",
                  "&.Mui-focused": { color: "#9D7BFF" },
                }}
              >
                Repeat password
              </InputLabel>
              <Input
                id="repeat-password"
                type={showPassword ? "text" : "password"}
                sx={{
                  color: "#F1F5F9",
                  "&:before": {
                    borderBottomColor: "rgba(255,255,255,0.15)",
                  },
                  "&:hover:not(.Mui-disabled, .Mui-error):before": {
                    borderBottomColor: "rgba(255,255,255,0.4)",
                  },
                  "&:after": { borderBottomColor: "#7F5AF0" },
                  "& input::-ms-reveal, & input::-ms-clear": {
                    display: "none",
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{
                        color: "rgba(255,255,255,0.35)",
                        "&:hover": { color: "#9D7BFF" },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                value={repPassword}
                onChange={(e) => setRepPassword(e.target.value)}
              />
              <FormHelperText>
                {unMatchPassword ? "Passwords do not match" : ""}
              </FormHelperText>
            </FormControl>
          </Box>
        ) : (
          <></>
        )}
      </Box>

      {/* Check box */}
      {isRegister ? (
        <></>
      ) : (
        <FormControlLabel
          control={
            <Checkbox
              sx={{
                color: "rgba(255,255,255,0.3)",
                "&.Mui-checked": { color: "#7F5AF0" },
              }}
            />
          }
          label="Remember login"
          sx={{
            mt: 1.5,
            color: "rgba(255,255,255,0.5)",
          }}
        />
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          mb: 2,
          py: 1.4,
          borderRadius: 2.5,
          fontSize: "0.95rem",
          fontWeight: 700,
          background: accentGradient,
          boxShadow: "0 8px 25px rgba(127,90,240,0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: accentGradientHover,
            boxShadow: "0 12px 38px rgba(157,123,255,0.45)",
            transform: "translateY(-1px)",
          },
          "&.Mui-disabled": {
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "none",
          },
        }}
        disabled={disableSubmit}
        onClick={submit}
      >
        <LoginIcon sx={{ mr: 1 }} />
        {isRegister ? "Create Account" : "Sign In"}
      </Button>

      {alert && (
        <Alert
          severity={alert.type}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor:
              alert.type === "error"
                ? "rgba(211,47,47,0.15)"
                : "rgba(46,125,50,0.15)",
            color: "#F1F5F9",
            "& .MuiAlert-icon": { opacity: 0.8 },
          }}
        >
          {alert.msg}
        </Alert>
      )}

      <Typography
        sx={{ mx: "auto", color: "rgba(255,255,255,0.45)", mt: 1 }}
      >
        {isRegister ? "Already have an account?" : "No account yet?"}{" "}
        <Link
          component="button"
          sx={{
            color: "#9D7BFF",
            textDecoration: "none",
            fontWeight: 600,
            transition: "color 0.2s",
            "&:hover": {
              textDecoration: "none",
              color: "#BDA4FF",
            },
          }}
          onClick={changeMode}
        >
          {isRegister ? "Sign in" : "Register now"}
        </Link>
      </Typography>
    </Dialog>
  );
}
