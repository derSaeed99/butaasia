import "firebase/auth";

import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { CaUser } from "model";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/miimcom-logo.svg";
import { auth, subscribeToUser } from "../firebase";

export const SignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const userInfoFromLocalStorage = localStorage.getItem("userInfo");
  const userExists = userInfoFromLocalStorage
    ? JSON.parse(userInfoFromLocalStorage)
    : null;
  const [userProfile, setUserProfile] = useState<CaUser | null>(null);
  useEffect(() => {
    if (userExists) {
      const unsubscribeToUserProfile = subscribeToUser({
        userId: userExists.uid,
        observer: (profile: CaUser | null) => {
          setUserProfile(profile);
        },
        onError: (error) => {
          setUserProfile(null);
          console.error(error);
        },
      });
      return () => {
        unsubscribeToUserProfile();
      };
    }
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setUserInfoInLocalStorage();
      if (userProfile?.userName) {
        navigate("/");
      } else {
        navigate(`/profile/${auth.currentUser?.uid}`);
      }
    } catch (error) {
      setError(`Unexpected error while logging in: ${error}`);
    }
  };
  const setUserInfoInLocalStorage = () => {
    const user = auth.currentUser;
    if (user) {
      const { uid } = user;
      const userInfo = { uid };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        mt: 4,
      }}
    >
      <Grid item>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Typography color={"GrayText"} variant="h5">
            Sign In
          </Typography>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            m: 2,
          }}
        >
          <Avatar
            sx={{ width: 200, height: 200 }}
            variant={"rounded"}
            src={logo}
            alt="miimcom-logo"
            onClick={() => navigate("/")}
          ></Avatar>
        </Box>
        <Grid
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ color: "black", backgroundColor: "white" }}
            onClick={handleGoogleSignIn}
          >
            Register/Sign In with Google
          </Button>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={() => navigate("/")}>Home</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
