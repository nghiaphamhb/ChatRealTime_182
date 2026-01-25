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
        bgcolor: "rgba(255,255,255,0.8)",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Sidebar header */}
      <Box sx={{ p: 2 }}>
        <Typography fontWeight={700} variant="h6">
          Chats
        </Typography>

        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search..."
            fullWidth
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  <SearchIcon fontSize="small" />
                </Box>
              ),
            }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Chat list */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {/* Item */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
            bgcolor: "rgba(25,118,210,0.08)", // active
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Badge color="success" variant="dot" overlap="circular">
              <Avatar />
            </Badge>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700} noWrap>
                  Phong Bui
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  6:08 PM
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Hello guys
                </Typography>

                <Box
                  sx={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    bgcolor: "primary.main",
                    color: "white",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.8,
                  }}
                >
                  3
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Item 2 */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700} noWrap>
                  Alice
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5:12 PM
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" noWrap>
                Ok, see you tomorrow!
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
