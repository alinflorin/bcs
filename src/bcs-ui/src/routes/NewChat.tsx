import axios from "axios";
import { useNavigate } from "react-router";
import { Chat } from "../models/chat";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Box, CircularProgress } from "@mui/material";
import { useBus } from "react-bus";

export default function NewChat() {
  const router = useNavigate();
  const snackbar = useSnackbar();
  const bus = useBus();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post<Chat>("/api/chat/new");
        bus.emit('newChatCreated', response.data);
        router("/chat/" + response.data._id);
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
      }
    })();
  }, [router, snackbar, bus]);

  return <Box sx={{ display: 'flex' }}><CircularProgress /> </Box>;
}
