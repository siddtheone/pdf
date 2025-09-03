import { Apple, Help as HelpIcon, Window } from "@mui/icons-material";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  Dialog,
  IconButton,
  ListItemText,
  List,
  ListItem,
} from "@mui/material";
import { useState } from "react";

export function Help() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <HelpIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Apps for setting webpage as wallpaper</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              <ListItem>
                <ListItemText
                  primary="Screen Play"
                  secondary="https://screen-play.app/"
                />{" "}
                <Apple />
                <Window />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Lively Wallpaper"
                  secondary="https://apps.microsoft.com/detail/9ntm2qc6qws7?hl=en-us&gl=US"
                />
                <Window />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Wallpaper Engine"
                  secondary="https://store.steampowered.com/app/431960/Wallpaper_Engine/"
                />
                <Window />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
