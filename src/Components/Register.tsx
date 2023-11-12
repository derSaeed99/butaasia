import { Box, Button, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';

import { auth } from '../firebase';

export const Register = () => {
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(`Unexpected error while logging in: ${error}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        variant="contained"
        sx={{ color: 'black', backgroundColor: 'white' }}
        onClick={register}
      >
        Register with Google
      </Button>
      <Typography variant="caption" color="error">
        {error}
      </Typography>
    </Box>
  );
};