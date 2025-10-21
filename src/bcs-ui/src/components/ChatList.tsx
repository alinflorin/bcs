import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Chat } from "../models/chat";
import { Delete } from "@mui/icons-material";

export default function ChatList() {
  const snackbar = useSnackbar();

  const [state, setState] = useState<Chat[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const chats = await axios.get("/api/chats");
        console.log(chats.data);
        setState(chats.data);
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
      }
    })();
  }, [snackbar]);


  const deleteChat = useCallback(async (id: string) => {
    
  }, []);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">Chats</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {state.map((c) => (
            <ListItem key={c._id!}>
              <ListItemButton component={Link} to={"/chat/" + c._id!}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <ListItemText primary={c.title} />
                  <IconButton edge="end" aria-label="delete" onClick={async e => {
                    e.stopPropagation();
                    e.preventDefault();
                    await deleteChat(c._id!);
                  }}>
                    <Delete />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
