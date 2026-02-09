import { Avatar, Box, Stack, Typography } from "@mui/material";

export default function SideCard({
  lastMsg,
  lastMsgAt,
  title,
  unreadCount,
  onClick,
  active,
}) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        cursor: "pointer",
        color: "white",
        bgcolor: active ? "#5a4fcf9d" : "transparent",
        "&:hover": { bgcolor: "#5a4fcf5e" },
      }}
      onClick={onClick}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ border: 1, borderColor: "#f9c076" }} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700} noWrap>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lastMsgAt}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {lastMsg}
            </Typography>

            {unreadCount > 0 ? (
              <Box
                sx={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.5)",
                  color: "white",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 0.8,
                }}
              >
                {unreadCount}
              </Box>
            ) : (
              <Box></Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
