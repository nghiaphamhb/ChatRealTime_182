import {
  Avatar,
  Badge,
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SideBar() {
  return (
    <Box
      sx={{
        width: 340,
        height: "100%",
        bgcolor: "rgba(15,23,42,0.85)",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Sidebar header */}
      <Box sx={{ p: 2 }}>
        <Typography
          fontWeight={800}
          variant="h6"
          sx={{ color: "#F1F5F9", letterSpacing: "-0.01em" }}
        >
          Chats
        </Typography>

        <Box sx={{ mt: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search..."
            fullWidth
            InputProps={{
              startAdornment: (
                <Box
                  sx={{
                    mr: 1,
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  <SearchIcon fontSize="small" />
                </Box>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                color: "#F1F5F9",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.08)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.15)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7F5AF0",
                  borderWidth: 1,
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.35)",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Chat list */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {/* Item - Active */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            cursor: "pointer",
            transition: "all 0.2s ease",
            bgcolor: "rgba(127,90,240,0.12)",
            borderLeft: "3px solid #7F5AF0",
            "&:hover": { bgcolor: "rgba(127,90,240,0.18)" },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Badge
              color="success"
              variant="dot"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  boxShadow: "0 0 6px rgba(44,182,125,0.6)",
                },
              }}
            >
              <Avatar />
            </Badge>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700} noWrap sx={{ color: "#F1F5F9" }}>
                  Phong Bui
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.4)" }}
                >
                  6:08 PM
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
              >
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Hello guys
                </Typography>

                <Box
                  sx={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #7F5AF0, #2CB67D)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.8,
                    boxShadow: "0 2px 8px rgba(127,90,240,0.4)",
                  }}
                >
                  3
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />

        {/* Item 2 */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            cursor: "pointer",
            borderLeft: "3px solid transparent",
            transition: "all 0.2s ease",
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700} noWrap sx={{ color: "#F1F5F9" }}>
                  Alice
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.35)" }}
                >
                  5:12 PM
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                noWrap
                sx={{ color: "rgba(255,255,255,0.4)" }}
              >
                Ok, see you tomorrow!
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
