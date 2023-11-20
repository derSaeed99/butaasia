import { Box } from "@mui/material";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { MemeForm } from "./Components/MemeForm";
import { SignIn } from "./Components/SignIn";
import { TopBar } from "./Components/TopBar";
import { auth, subscribeToMemes } from "./firebase";
import { CaMeme, CaPost } from "./model";
import { HomePage } from "./Pages/HomePage";
import { UserProfile } from "./Pages/UserProfile";
import ProtectedRoutes from "./utils/ProtectedRoutes";

export const App = () => {
  const [memes, setMemes] = useState<CaPost[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        console.error("no user");
      }
    });
    const unsubscribeToMemes = subscribeToMemes((memes) => {
      if (memes) {
        setMemes(memes);
      } else {
        console.error("no user");
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToMemes();
    };
  }, [navigate]);

  return (
    <Box sx={{ backgroundColor: "#121212" }}>
      <TopBar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<HomePage memes={memes} />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes user={user}>
              <UserProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/form"
          element={
            <ProtectedRoutes user={user}>
              <MemeForm />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Box>
  );
};
