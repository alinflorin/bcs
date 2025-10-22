import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Settings,
  ChevronLeft,
  ChevronRight,
  Logout,
  Login,
  Chat as ChatIcon,
  Search,
  Home,
} from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link, useNavigate } from "react-router";
import { deepOrange } from "@mui/material/colors";
import type { User } from "oidc-client-ts";
import React, { useState } from "react";
import { version } from "../version";
import ChatList from "./ChatList";

const drawerWidth = 240;

type SlideProps = {
  open: boolean;
  onToggle: () => void;
  user?: User | null;
  onLogout: () => Promise<void>;
  onLogin: () => Promise<void>;
  isMobile: boolean;
};

export default function Sidebar({
  open,
  onToggle,
  user,
  onLogin,
  onLogout,
  isMobile
}: SlideProps) {

  

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(!menuOpen);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: open ? drawerWidth : 64,
        transition: "width 0.3s",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ flex: "auto", minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 1,
          }}
        >
          {open && <span>BCS {version}</span>}
          <IconButton onClick={onToggle}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              {open && <ListItemText primary="Home" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/new-chat">
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              {open && <ListItemText primary="New Chat" />}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/search">
              <ListItemIcon>
                <Search />
              </ListItemIcon>
              {open && <ListItemText primary="Search Chat" />}
            </ListItemButton>
          </ListItem>
        </List>

        {user && open && (
          <Box sx={{flex: 'auto', minHeight: 0, overflow: 'auto'}}>
             <ChatList />
          </Box>
        )}
      </Box>

      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {open && <span>{user?.profile?.name ?? "Guest"}</span>}
        <Avatar sx={{ bgcolor: deepOrange[500] }}>
          {user?.profile?.name ? user.profile.name[0].toUpperCase() : " ?"}
        </Avatar>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          aria-hidden="false"
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            {user && (
            <MenuItem   onClick={() => {
                handleClose();
                router("/admin");
              }}>
              <ListItemIcon>
                <AdminPanelSettingsIcon fontSize="small" />
              </ListItemIcon>
              Admin
            </MenuItem>
          )}
          {user && (
            <MenuItem
              onClick={() => {
                handleClose();
                router("/settings");
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
          )}
          
          {user && (
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          )}
          {!user && (
            <MenuItem onClick={onLogin}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
