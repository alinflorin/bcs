import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Avatar, Box, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";


export default function Admin() {
    const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
    return <Box sx={{height:'100', width:'100%'}} >
    
    <Box sx={{ display: "flex", flexDirection:'column', justifyContent: "center", alignItems: "center", }} >

    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div"> Upload documents here </Typography>

    <TextField sx={{ mb: 2 }}  id="outlined-basic" label="Name" variant="outlined" />
   
   <Button sx={{ mb: 2 }}  component="label"role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
  Upload files <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
  </Button>

  <Button sx={{ mb: 2 }}  variant="contained" endIcon={<SaveIcon />}> Send </Button>

  
    </Box>
          
     <Box sx={{ mt: 4, backgroundColor: "black", width: "100%", borderRadius: 2 }}>
      <List>
        <ListItemButton
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="hello" />
          </Box>

          {/* Delete Icon Button on the right */}
          <IconButton
            edge="end"
            aria-label="delete"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </List>
    </Box>

</Box>

   

   
}