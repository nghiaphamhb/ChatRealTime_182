import {
  Box,
  Stack,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import UserIdPicker from "./UserIdPicker";

export default function SideHeader({ createConversation }) {
  const [menuEl, setMenuEl] = useState(null);
  const menuOpen = Boolean(menuEl);

  const [mode, setMode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const openMenu = (e) => setMenuEl(e.currentTarget);

  const closeMenu = () => setMenuEl(null);

  const startNewDM = () => {
    closeMenu();
    setMode("DM");
    setDialogOpen(true);
    setGroupName("");
    setSelectedIds([]);
  };

  const startNewGroup = () => {
    closeMenu();
    setMode("GROUP");
    setDialogOpen(true);
    setGroupName("");
    setSelectedIds([]);
  };

  const closeDialog = () => setDialogOpen(false);

  const addUserId = (value) => {
    const id = value.trim();
    if (!id) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeUserId = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const canSubmit = useMemo(() => {
    if (mode === "DM") return selectedIds.length === 1;
    if (mode === "GROUP")
      return groupName.trim().length > 0 && selectedIds.length >= 2;
    return false;
  }, [mode, selectedIds, groupName]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload =
      mode === "DM"
        ? { type: mode, memberUserIds: selectedIds }
        : {
            type: mode,
            title: groupName.trim(),
            memberUserIds: selectedIds,
          };

    await createConversation(payload);
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          background:
            "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #3B2F80 100%)",
          borderBottom: "1px solid rgba(43,34,80,0.14)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          color: "white",
        }}
      >
        <Typography fontWeight={700} variant="h6">
          Chats
        </Typography>
        <IconButton
          aria-label="add-button"
          onClick={openMenu}
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            color: "#2B2250",
            backgroundColor: "rgba(255,241,214,0.75)",
            border: "1px solid rgba(43,34,80,0.14)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #9D7BFF 0%, #8B6BFF 50%, #5A3BFF 100%)",
              boxShadow: "0 12px 38px rgba(157,123,255,0.45)",
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Menu anchorEl={menuEl} open={menuOpen} onClose={closeMenu}>
        <MenuItem onClick={startNewDM}>New DM</MenuItem>
        <MenuItem onClick={startNewGroup}>New Group</MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {mode === "DM" ? "New direct message" : "New group"}
        </DialogTitle>

        <DialogContent>
          {mode == "GROUP" && (
            <TextField
              label="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
              autoFocus
              sx={{ mb: 1 }}
            />
          )}

          {/* Enter user id here */}
          <UserIdPicker addUserId={addUserId} />

          <Stack direction="row">
            {selectedIds.map((id) => (
              <Chip
                key={id}
                label={`${id.slice(0, 6)}...`}
                onDelete={() => removeUserId(id)}
              />
            ))}
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.7, p: 2 }}>
            Tip: type userId and press Enter
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {mode === "DM" ? "Start chat" : "Create group"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
