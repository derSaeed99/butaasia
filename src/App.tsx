import { Box } from '@mui/material';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MemeForm } from './Components/MemeForm';
import { SignIn } from './Components/SignIn';
import { TopBar } from './Components/TopBar';
import { auth } from './firebase';
import { CaMeme, HomePage } from './Pages/HomePage';
import { UserProfile } from './Pages/UserProfile';
import ProtectedRoutes from './utils/ProtectedRoutes';

export const App = () => {
  const [memes, setMemes] = useState<CaMeme[]>([]);
  const [, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        console.error('no user');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getMemes = async () => {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const json = await response.json();
      setMemes(json.data.memes);
    };
    getMemes();
  }, []);

  return (
    <BrowserRouter>
      <Box sx={{ backgroundColor: '#121212' }}>
        <TopBar />
        <Routes>
          <Route path="/" element={<HomePage memes={memes} />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/form"
            element={
              <ProtectedRoutes>
                <MemeForm />
              </ProtectedRoutes>
            }
          />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};
