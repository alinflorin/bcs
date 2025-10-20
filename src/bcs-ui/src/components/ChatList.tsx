import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Chat } from "../models/chat";

export default function ChatList() {
  const snackbar = useSnackbar();

  const [state, setState]= useState<Chat[]>([])



  useEffect(() => {
    (async () => {
      try {
        const chats = await axios.get("/api/chats");
        console.log(chats.data);
        setState(chats.data)
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
      }
    })();
  }, [snackbar]);

  return (
    <Accordion defaultExpanded  >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">Chats</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
         {state.map(c =>  <ListItem key={c._id!}>
            <ListItemButton component={Link} to={"/chat/"+ c._id!}>
              <ListItemText primary={c.title} />
            </ListItemButton>
          </ListItem>)}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
