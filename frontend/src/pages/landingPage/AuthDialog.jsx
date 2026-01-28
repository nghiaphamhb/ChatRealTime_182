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

export default function AuthDialog({ open = false, handleClose }) {
  const colorText = "rgba(255,255,255,0.5)";
  const colorText_input = "#fff";

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          width: 400,
          padding: 4,
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.5)",
          bgcolor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)",
          overflow: "hidden",
          color: "rgba(255,255,255,0.8)",
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 45,
          height: 45,
          borderRadius: "0 0 0 8px",
          color: "#fff",
          "&:hover": { bgcolor: "#162938" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h3" sx={{ mx: "auto", pb: 1 }}>
        {isRegister ? "Register" : "Login"}
      </Typography>

      {/* Display name */}
      {isRegister ? (
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <BadgeIcon sx={{ mr: 1, my: 0.5, color: colorText }} />
          <TextField
            fullWidth
            id="display-name"
            label="Display name"
            variant="standard"
            sx={{
              "& .MuiInputLabel-root": { color: colorText },
              "& .MuiInputLabel-root.Mui-focused": { color: colorText_input },
              "& .MuiInputBase-input": { color: colorText_input },

              "& .MuiInput-underline:before": { borderBottomColor: colorText },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: colorText_input,
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: colorText_input,
              },
            }}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Box>
      ) : (
        <></>
      )}

      {/* Username */}
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <AccountCircle sx={{ mr: 1, my: 0.5, color: colorText }} />
        <TextField
          fullWidth
          id="username"
          label="Username"
          variant="standard"
          sx={{
            "& .MuiInputLabel-root": { color: colorText },
            "& .MuiInputLabel-root.Mui-focused": { color: colorText_input },
            "& .MuiInputBase-input": { color: colorText_input },

            "& .MuiInput-underline:before": { borderBottomColor: colorText },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: colorText_input,
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: colorText_input,
            },
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Box>

      {/* Password */}
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <KeyIcon sx={{ mr: 1, my: 0.5, color: colorText }} />
        <FormControl fullWidth variant="standard">
          <InputLabel
            htmlFor="standard-adornment-password"
            sx={{
              color: colorText,
              "&.Mui-focused": { color: colorText_input },
            }}
          >
            Password
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            sx={{
              color: colorText_input,
              "&:before": { borderBottomColor: colorText },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottomColor: "rgba(255,255,255,0.8)",
              },
              "&:after": { borderBottomColor: colorText_input },
              "& input::-ms-reveal, & input::-ms-clear": { display: "none" },
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ color: colorText }}
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
          <SyncLockIcon sx={{ mr: 1, my: 0.5, color: colorText }} />
          <FormControl fullWidth variant="standard" error={unMatchPassword}>
            <InputLabel
              htmlFor="standard-adornment-password"
              sx={{
                color: colorText,
                "&.Mui-focused": { color: colorText_input },
              }}
            >
              Repeat password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              sx={{
                color: colorText_input,
                "&:before": { borderBottomColor: colorText },
                "&:hover:not(.Mui-disabled, .Mui-error):before": {
                  borderBottomColor: "rgba(255,255,255,0.8)",
                },
                "&:after": { borderBottomColor: colorText_input },
                "& input::-ms-reveal, & input::-ms-clear": { display: "none" },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: colorText }}
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

      {/* Check box */}
      {isRegister ? (
        <></>
      ) : (
        <FormControlLabel
          control={
            <Checkbox
              sx={{
                color: colorText,
                "&.Mui-checked": { color: colorText_input },
              }}
            />
          }
          label="Remember login"
          sx={{
            mt: 1,
            color: colorText,
            // '&:hover': { color: colorText_input }
          }}
        />
      )}

      <Button
        variant="contained"
        sx={{
          my: 3,
          borderRadius: 1,
          background:
            "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #3B2F80 100%)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #9D7BFF 0%, #8B6BFF 50%, #5A3BFF 100%)",
            boxShadow: "0 12px 38px rgba(157,123,255,0.45)",
          },
          "&.Mui-disabled": {
            background: "rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "none",
          },
        }}
        disabled={disableSubmit}
        onClick={submit}
      >
        <LoginIcon sx={{ mr: 1 }} />
        {isRegister ? "Register" : "Login"}
      </Button>

      {alert && (
        <Alert
          severity={alert.type}
          sx={{
            mb: 1,
            borderRadius: 2,
            opacity: 0.85,
          }}
        >
          {alert.msg}
        </Alert>
      )}

      <Typography sx={{ mx: "auto", color: colorText }}>
        {isRegister ? "Already have an account?" : "No account yet?"}{" "}
        <Link
          component="button"
          color={colorText_input}
          sx={{
            textDecoration: "none",
            "&:hover": {
              textDecoration: "none",
              fontWeight: 600,
            },
          }}
          onClick={changeMode}
        >
          {isRegister ? "Login now" : "Register now"}
        </Link>
      </Typography>
    </Dialog>
  );
}
