import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { User } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  auth,
  createUserProfile,
  uploadImageAndSaveUrl,
} from "../firebase";
import { subscribeToUser } from "../firebase";
import { CaUser } from "../model";

interface UserProfileFormValues {
  userName: string;
  userNumber: number;
  photoUrl?: string;
  bio?: string;
  created?: Date;
  lastUpdate?: Date;
}

interface AvatarInputProps {
  name: string;
  value: string;
  userId: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarInput = ({ name, value, onChange, userId }: AvatarInputProps) => {
  const [avatarImage, setAvatarImage] = useState<string>("");

  const handleAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await uploadImageAndSaveUrl(userId, file);
        setAvatarImage(imageUrl);
        onChange({
          target: {
            name,
            value: imageUrl,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Avatar
        sx={{ width: 100, height: 100 }}
        alt="user profile image"
        src={avatarImage || value}
        onClick={handleAvatarClick}
      />
    </>
  );
};

export const UserProfile = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<CaUser | null>(null);
  const [avatarImage, setAvatarImage] = useState<string>("");
const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<UserProfileFormValues>({
    userName: userProfile?.userName || "",
    userNumber: userProfile?.userNumber || 0,
    photoUrl: userProfile?.photoUrl || "",
    bio: userProfile?.bio || "",
    created: new Date(),
    lastUpdate: new Date(),
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
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
      return ()=>{
        unsubscribe()
        unsubscribeToUserProfile()
      };
    });

  }, []);


  useEffect(() => {
    if (userProfile) {
      setInitialValues({
        userName: userProfile.userName || "",
        userNumber: 0,
        photoUrl: userProfile.photoUrl || "",
        bio: userProfile.bio || "",
        created: new Date(),
        lastUpdate: new Date(),
      });
    }
  }, [userProfile]);

  const handleSubmit = async (values: UserProfileFormValues) => {
    const profileValues = { ...values, photoUrl: avatarImage };
    if (authUser && values) {
    try {
      await createUserProfile(authUser?.uid, profileValues)
      setUserProfile(profileValues);
    } catch (e) {
      console.warn(e);
    }
  }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSubmit(values);
        navigate("/");
      }}
    >
      {({ values, dirty }) => (
        <Form>
          <Grid
            container
            direction="column"
            alignItems="center"
            minHeight="90vh"
            sx={{ mt: 2 }}
          >
            <Grid item sx={{ m: 2 }}>
              <Field
                name="photoUrl"
                userId={authUser?.uid || ""}
                component={AvatarInput}
                value={values.photoUrl || avatarImage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAvatarImage(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <Field
                sx={{
                  mb: 2,
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: "10px",
                  ":hover": {
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
                InputLabelProps={{ sx: { color: "white" } }}
                name="userName"
                component={TextField}
                label="Username"
              />
            </Grid>
            <Grid item>
              <Field
                sx={{
                  mb: 2,
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: "10px",
                  ":hover": {
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
                InputLabelProps={{ sx: { color: "white" } }}
                name="bio"
                component={TextField}
                label="Description"
              />
            </Grid>
            <Grid item>
              <Button type="submit" disabled={!dirty}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
