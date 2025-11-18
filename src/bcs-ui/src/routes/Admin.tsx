import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useConfirm } from "../hooks/useConfirmDialog";
import { CollectionPdf } from "../models/collectionpdf";


export default function Admin() {


  const [name, setName]= useState("");
  const [files, setFiles]= useState<File[]>([]);
  const [document, setDocument]= useState<CollectionPdf[]>([]);

  const snackbar = useSnackbar();
     const confirm = useConfirm();



  const handleName = (event: React.ChangeEvent<HTMLInputElement>)=>{
      setName(event.target.value)
  
  }

  const handleFiileChnage = (event: React.ChangeEvent<HTMLInputElement>)=>{
     if(event.target.files){
      setFiles(Array.from(event.target.files))
     }
  }


  useEffect(() => {
    (async () => {
      try {
        const resposneDocuments = await axios.get("/api/collection");
        setDocument(resposneDocuments.data);
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
      }
    })();
  }, []);

  

  const handleUpload = async ()=>{

  const formData = new FormData();

  files.forEach((file) => formData.append("files", file));

try {
    // Send POST request with Axios
    const res = await axios.post(`/api/upload?name=${encodeURIComponent(name)}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res.data)

    // Clear form
    setName("");
    setFiles([]);
  } catch (e: any) {
   snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });

  }
     
  }

  const deleteDocument = useCallback(
    async (id: string) => {
      try {
        await axios.delete("/api/collection/" + id);
        setDocument((prev) => prev.filter((chat) => chat.id?.toString() !== id));
      
       
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
      }
    },
    [snackbar]
  );


  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 3,
        width: "100%",
      }}
    >
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Admin Panel
        </Typography>
        <Divider />
      </Box>

      {/* Upload Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Upload Documents
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload and manage important files and reports here.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={{ maxWidth: 500 }}
        >
          <TextField
            fullWidth
            label="Document Name"
            variant="outlined"
            placeholder="Enter document name"
            onChange={handleName}
          />

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
            <VisuallyHiddenInput
              type="file"
              onChange={handleFiileChnage}
              multiple
            />
          </Button>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          endIcon={<SaveIcon />}
          sx={{ mt: 3 }}
          onClick={handleUpload}
        >
          Send
        </Button>
      </Paper>

      {/* Uploaded Files Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Uploaded Files
        </Typography>

        {document.length === 0 ? (
          <Typography color="text.secondary">
            No documents uploaded yet.
          </Typography>
        ) : (
          <List>
            {document.map((doc) => (
              <ListItem
                key={doc.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "action.hover",
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={doc.name} />
                </Box>

                <IconButton   onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await confirm({
                        title: "Delete this item?",
                        message: "This action cannot be undone. This chat will be deleted permanently.",
                      });
                      if (ok) {
                       await deleteDocument(doc.id!)}
                      }} color="error">   
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
