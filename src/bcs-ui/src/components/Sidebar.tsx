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
  useMediaQuery,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import { Home, Settings, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router";
import { deepOrange } from "@mui/material/colors";

const drawerWidth = 240;

export default function Sidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Box sx={{ flex: "auto", minHeight: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 1,
          }}
        >
          {open && <span>LOGO</span>}
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
            <ListItemButton component={Link} to="/settings">
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              {open && <ListItemText primary="Settings" />}
            </ListItemButton>
          </ListItem>
        </List>

        {open && (
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Chats</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemButton component="a">
                    <ListItemText primary="Chat 1" />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {open && <span>Name</span>}
        <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
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
