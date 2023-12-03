import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProfileForm } from "../Components/ProfileForm";
import { ProfileInfos } from "../Components/ProfileInfos";
import { subscribeToUser } from "../firebase";
import { CaUser } from "../model";

export const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<CaUser | null>(null);
  const { userId } = useParams<{userId: string}>();
  useEffect(() => {
    if (userId) {
      const unsubscribeToUserProfile = subscribeToUser({
        userId: userId,
        observer: (profile: CaUser | null) => {
          setUserProfile(profile);
        },
        onError: (error) => {
          setUserProfile(null);
          console.error(error);
        },
      });
      return () => {
        unsubscribeToUserProfile()
      };
    }
  }, [userId]);


  return (
    <Box sx={{display:"flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <ProfileInfos userProfile={userProfile} />
      <ProfileForm userProfile={userProfile} />
    </Box>
  );
};
