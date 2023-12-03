import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AccessibleIcon from "@mui/icons-material/Accessible";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SmsIcon from "@mui/icons-material/Sms";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PopoverOrigin,
  Toolbar,
} from "@mui/material";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/miimcom-logo.svg";
import { auth, subscribeToUser } from "../firebase";
import { CaUser } from "../model";

export const TopBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<CaUser | null>(null);
  const [anchorEl, setAnchorEl] = useState(null as null | HTMLElement);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        console.error("no user");
      }
      const unsubscribeToUserProfile = subscribeToUser({
        userId: user?.uid ?? "",
        observer: (profile: React.SetStateAction<CaUser | null>) => {
          setUserProfile(profile);
        },
        onError: (error) => {
          setUserProfile(null)
          console.error(error);
        }
      })
      return () => {
        unsubscribe()
        unsubscribeToUserProfile()
      };
    });
  }, [user]);

  const handleClick = () => {
  if (user) {
    setDrawerOpen(true);
  } else {
    navigate("/signin");
  }
};

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      if (user) {
        navigate("/signin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const open = Boolean(anchorEl);
  const popoverOrigin: PopoverOrigin = {
    vertical: "bottom",
    horizontal: "left",
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          width: "100%",
          justifyContent: "center",
          backgroundColor: "#212121",
        }}
      >
        <Toolbar>
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Avatar
                  variant={"rounded"}
                  src={logo}
                  alt="miimcom-logo"
                  onClick={() => navigate("/")}
                ></Avatar>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                size="medium"
                sx={{ color: "GrayText" }}
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Box>
                <IconButton
                  size="medium"
                  sx={{ color: "GrayText" }}
                  onClick={(event) => {
                    user
                      ? setAnchorEl(event.currentTarget)
                      : navigate("/signin");
                  }}
                >
                  <Avatar
                    sx={{ width: 30, height: 30 }}
                    alt="User Avatar"
                    src={userProfile?.photoUrl}
                  />
                </IconButton>
                <Menu
                  sx={{
                    opacity: 0.9,
                    "& .MuiPaper-root": {
                      backgroundColor: "#212121",
                    },
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={popoverOrigin}
                  transformOrigin={popoverOrigin}
                >
                  <MenuItem>
                    <IconButton sx={{ color: "white", m: 1 }} onClick={logout}>
                      <LogoutIcon />
                      Sign Out
                    </IconButton>
                  </MenuItem>
                  <MenuItem>
                    <IconButton
                      sx={{ color: "white", m: 1 }}
                      onClick={() => navigate("/profile")}
                    >
                      <PersonIcon />
                      Profile
                    </IconButton>
                  </MenuItem>
                  <MenuItem>
                    <IconButton
                      sx={{ color: "white", m: 1 }}
                      onClick={handleClose}
                    >
                      <SmsIcon />
                      Messages
                    </IconButton>
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { width: "220px", backgroundColor: "#212121" } }}
      >
        <List>
          <Box>
            <ListItem component={Link} to="/">
              <ListItemIcon sx={{ color: "white" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Home" />
            </ListItem>
          </Box>
          <Box>
            <Divider sx={{ mt: 1, mb: 1, borderColor: "white" }} />
          </Box>
          <Box sx={{ color: "gray", mt: 2 }}>
            <ListItem>
              <ListItemIcon sx={{ color: "gray" }}>
                <CategoryIcon />
              </ListItemIcon>

              <ListItemText primary="Categories" />
            </ListItem>
          </Box>
          <Box>
            <ListItem component={Link} to="/categories/:funny">
              <ListItemIcon sx={{ color: "white" }}>
                <AccessibleIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Funny" />
            </ListItem>
          </Box>
          <Box>
            <ListItem component={Link} to="/categories/:others">
              <ListItemIcon sx={{ color: "white" }}>
                <AccessibilityIcon />
              </ListItemIcon>

              <ListItemText sx={{ color: "white" }} primary="Others" />
            </ListItem>
          </Box>
        </List>
      </Drawer>
    </>
  );
};
