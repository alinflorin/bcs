import axios from "axios";
import { useNavigate } from "react-router";
import { Chat } from "../models/chat";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { Box, CircularProgress } from "@mui/material";

export default function NewChat() {
  const router = useNavigate();

  const snackbar = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post<Chat>("/api/chat/new");
        router("/chat/" + response.data._id);
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
      }
    })();
  }, [router, snackbar]);

  return <Box sx={{ display: 'flex' }}><CircularProgress /> </Box>;
}
