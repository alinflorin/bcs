import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  Paper,
  Stack,
  useMediaQuery,
  MenuItem,
  Select,
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

// --- Icons ---
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaletteIcon from "@mui/icons-material/Palette";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import UploadIcon from "@mui/icons-material/Upload";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Chat } from "../models/chat";
import { useBus, useListener } from "react-bus";
import { useConfirm } from "../hooks/useConfirmDialog";

export default function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selected, setSelected] = useState("Profile");

   const snackbar = useSnackbar();
   const [chat, setChat] = useState<Chat[]>([]);

    const bus = useBus();
      const confirm = useConfirm();
   

 

  const sections = [
    { label: "Profile", icon: <PersonIcon /> },
    { label: "General", icon: <SettingsIcon /> },
    { label: "Notifications", icon: <NotificationsIcon /> },
    { label: "Personalization", icon: <PaletteIcon /> },
    { label: "Data & Control", icon: <SecurityIcon /> },
    { label: "Account", icon: <AccountCircleIcon /> },
  ];


    useEffect(() => {
      (async () => {
        try {
          const chats = await axios.get("/api/chats?isArchived=true");
          setChat(chats.data);
          console.log(chats.data)
        } catch (e: any) {
          snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
        }
      })();
    }, [snackbar]);

 const deleteChat = useCallback(
    async (id: string) => {
      try {
        await axios.delete("/api/delete/" + id);
        setChat((prev) => prev.filter((chat) => chat._id?.toString() !== id));
       
      
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
      }
    },
    [snackbar]
  );

    const updateisArchived = useCallback(
  async (id: string) => {
       try {
        await axios.patch("/api/update/" + id, {isArchived: false});
        setChat((prev) => prev.filter(x => x._id !== id));// remove from archived list
       // bus.emit("chatUnArchived", id); // notify other components

        
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
      }
    

  },
  [snackbar ] 
);


  // ---------- Content Renderer ----------
  const renderContent = () => {
    switch (selected) {
      case "Profile":
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Profile Settings</Typography>
            <Typography color="text.secondary">
              Update your personal details and profile picture.
            </Typography>

            <Stack direction="row" alignItems="center" spacing={3}>
              <Avatar
                src="/placeholder-avatar.png"
                sx={{ width: 80, height: 80 }}
              />
              <Button variant="outlined" startIcon={<UploadIcon />}>
                Upload New Photo
              </Button>
            </Stack>

            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField label="Full Name" fullWidth variant="outlined" />
              <TextField label="Email" fullWidth variant="outlined" />
              <TextField label="Username" fullWidth variant="outlined" />
              <Button variant="contained">Save Changes</Button>
            </Stack>
          </Stack>
        );

      case "General":
        return (
          <Stack spacing={3}>
            <Typography variant="h6">General Settings</Typography>
            <Typography color="text.secondary">
              Control language, time zone, and general preferences.
            </Typography>

            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField select label="Language" defaultValue="en">
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </TextField>

              <TextField select label="Time Zone" defaultValue="UTC+0">
                <MenuItem value="UTC+0">UTC+0</MenuItem>
                <MenuItem value="UTC+1">UTC+1</MenuItem>
                <MenuItem value="UTC-5">UTC-5</MenuItem>
              </TextField>

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Auto-save chats"
              />
              <Button variant="contained">Save</Button>
            </Stack>
          </Stack>
        );

      case "Notifications":
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Notifications</Typography>
            <Typography color="text.secondary">
              Manage how and when you receive updates.
            </Typography>

            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email Notifications"
              />
              <FormControlLabel
                control={<Switch />}
                label="Push Notifications"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Chat Mention Alerts"
              />
              <Button variant="contained">Save</Button>
            </Stack>
          </Stack>
        );

      case "Personalization":
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Personalization</Typography>
            <Typography color="text.secondary">
              Customize your theme and chat layout.
            </Typography>

            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Compact Chat Layout"
              />
              <FormControlLabel
                control={<Switch />}
                label="Use Rounded Avatars"
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<LightModeIcon />}
                  color="inherit"
                >
                  Light Mode
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DarkModeIcon />}
                  color="primary"
                >
                  Dark Mode
                </Button>
              </Stack>
            </Stack>
          </Stack>
        );

case "Data & Control":
  return (
    <Stack spacing={3}>
      <Typography variant="h6">Data & Control</Typography>
      <Typography color="text.secondary">
        Manage your archived chats and data privacy options.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Archived Chats
        </Typography>

        <List>
          {chat.map((c) => (
            <ListItem
              key={c._id}
              sx={{
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                backgroundColor: "action.hover",
                borderRadius: 2,
                mb: 1,
                px: 2,
                py: isMobile ? 1.5 : 1,
                gap: isMobile ? 1.5 : 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={c.title} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 1,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  startIcon={<UnarchiveIcon />}
                  fullWidth={isMobile}
                   onClick={async (e)=>{
                    e.stopPropagation();
                     await updateisArchived(c._id!)
                  }} >
                  Unarchive
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  fullWidth={isMobile}
                   onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await confirm({
                        title: "Delete this item?",
                        message: "This action cannot be undone. This chat will be deleted permanently.",
                      });
                      if (ok) {
                        await deleteChat(c._id!);
                      }
                     
                    }}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );

     

      case "Account":
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Account</Typography>
            <Typography color="text.secondary">
              Manage your login credentials and account access.
            </Typography>

            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField label="Current Password" type="password" fullWidth />
              <TextField label="New Password" type="password" fullWidth />
              <TextField label="Confirm New Password" type="password" fullWidth />
              <Button variant="contained" color="primary">
                Update Password
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" color="error">
              Danger Zone
            </Typography>
            <Button variant="outlined" color="error">
              Delete Account Permanently
            </Button>
          </Stack>
        );

      default:
        return null;
    }
  };

  // ---------- Layout ----------
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        height: "100%",
      }}
    >
      {/* LEFT SIDEBAR */}
      <Paper
        elevation={2}
        sx={{
          width: isMobile ? "100%" : 260,
          p: 2,
          borderRadius: 0,
          borderRight: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
          mb: isMobile ? 2 : 0,
        }}
      >
        {isMobile ? (
          <Select
            fullWidth
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {sections.map((section) => (
              <MenuItem key={section.label} value={section.label}>
                {section.label}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Stack spacing={1}>
            {sections.map((section) => (
              <Button
                key={section.label}
                fullWidth
                onClick={() => setSelected(section.label)}
                startIcon={section.icon}
                variant={selected === section.label ? "contained" : "text"}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: selected === section.label ? 600 : 400,
                  borderRadius: 2,
                }}
              >
                {section.label}
              </Button>
            ))}
          </Stack>
        )}
      </Paper>

      {/* RIGHT CONTENT */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4">{selected}</Typography>
        <Divider />
        {renderContent()}
      </Box>
    </Box>
  );
}
