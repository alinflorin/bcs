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

export default function Admin() {
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

  const uploadedDocs = [
    { id: 1, name: "Project_Plan.pdf" },
    { id: 2, name: "Budget_Report.xlsx" },
    { id: 3, name: "Meeting_Notes.docx" },
  ];

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
          />

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          endIcon={<SaveIcon />}
          sx={{ mt: 3 }}
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

        {uploadedDocs.length === 0 ? (
          <Typography color="text.secondary">
            No documents uploaded yet.
          </Typography>
        ) : (
          <List>
            {uploadedDocs.map((doc) => (
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

                <IconButton color="error">
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
