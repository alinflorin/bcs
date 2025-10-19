import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Chat } from "../models/chat";
import { useSnackbar } from "notistack";

export default function ViewChat() {
  const params = useParams();
  const snackbar = useSnackbar();

  const [chat, setChat] = useState<Chat | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<Chat>("/api/chat/" + params.id);
        setChat(response.data);
      } catch (e: any) {
        console.error(e);
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: 'error'
        });
      }
    })();
  }, [params.id, snackbar]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h2>{chat?.title}</h2>
        <p>What are you working on?</p>

        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">
            Ask anything
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">+</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Box>
    </>
  );
}
