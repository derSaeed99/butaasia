import 'firebase/auth';

import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/miimcom-logo.svg';
import { auth, checkUserProfile } from '../firebase';
import { Register } from './Register';

export const SignIn = () => {
  const [, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      const hasProfile = await checkUserProfile();
      if (hasProfile) {
        navigate('/');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setError(`Unexpected error while logging in: ${error}`);
    }
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        mt: 4,
      }}
    >
      <Grid item>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}
        >
          <Typography color={'GrayText'} variant="h5">
            Sign In
          </Typography>
        </Grid>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2 }}
        >
          <Avatar
            sx={{ width: 200, height: 200 }}
            variant={'rounded'}
            src={logo}
            alt="miimcom-logo"
            onClick={() => navigate('/')}
          ></Avatar>
        </Box>
        <Grid
          item
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            sx={{ color: 'black', backgroundColor: 'white' }}
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            mt: 5,
          }}
        >
          <Typography variant="caption" color="GrayText" gutterBottom>
            Not registered yet?
          </Typography>
          <Register />
        </Grid>
      </Grid>
    </Grid>
  );
};
