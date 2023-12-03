import { MoreVert } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import {
  Box,
  CardMedia,
  Divider,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { TopBar } from "../Components/TopBar";
import { auth, subscribeToMemes } from "../firebase";
import { CaPost } from "../model";

export const HomePage = () => {
  const [memes, setMemes] = useState<CaPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeToMemes = subscribeToMemes((memes) => {
      if (memes) {
        setMemes(memes);
      } else {
        console.error("no user");
      }
    });

    return () => {
      unsubscribeToMemes();
    };
  }, [navigate]);
  const handleUpvote = () => {
    if (auth) {
      navigate("/signin");
    }
    console.log("upvote");
  };
  const handleDownVote = () => {
    if (auth) {
      navigate("/signin");
    }
    console.log("downvote");
  };
  const handleMoreVert = () => {
    if (auth) {
      navigate("/signin");
    }
    console.log("report post");
  };
  return (
    <>
    <TopBar/>
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <List>
        {memes?.map((post) => (
          <>
            <ListItem key={post.postId} sx={{ borderRadius: "8px", mb: 2 }}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent={"space-between"}
                >
                  <ListItemText
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      mb: 2,
                    }}
                    primary={
                      <Typography
                        variant="h6"
                        color={"white"}
                        fontWeight={"bold"}
                      >
                        {post.caption}
                      </Typography>
                    }
                    secondary={
                      <IconButton
                        size="small"
                        sx={{ color: "GrayText" }}
                        onClick={handleMoreVert}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    src={post.mediaUrl}
                    alt={post.caption}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                    }}
                    sx={{ maxHeight: "45vh", p: 0, m: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 2,
                      mb: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    <IconButton
                      size="medium"
                      sx={{ color: "GrayText" }}
                      onClick={handleUpvote}
                    >
                      <ThumbUpOffAltIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body1" sx={{ color: "GrayText" }}>
                        {post.upvotes}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <IconButton
                        size="medium"
                        sx={{ color: "GrayText" }}
                        onClick={handleDownVote}
                      >
                        <ThumbDownOffAltIcon />
                      </IconButton>
                      <Typography
                        variant="body1"
                        sx={{ color: "GrayText", ml: 1 }}
                      >
                        {post.downvotes}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <IconButton size="medium" sx={{ color: "GrayText" }}>
                        <ChatBubbleOutlineIcon />
                      </IconButton>
                      <Typography
                        variant="body1"
                        sx={{ color: "GrayText", ml: 1 }}
                      >
                        {Math.floor(Math.random() * 100)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </ListItem>
            <Grid item xs={12}>
              <Divider sx={{ mt: 2, mb: 2, borderColor: "GrayText" }} />
            </Grid>
          </>
        ))}
      </List>
      <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
        <Link to="/form">
          <Fab
            sx={{ color: "purple", backgroundColor: "yellow" }}
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </Link>
      </Box>
    </Grid>
    </>
  );
};
