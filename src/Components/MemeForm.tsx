// import * as Yup from 'yup';
import { Button, MenuItem } from "@mui/material";
import { Box, Grid, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import { useState } from "react";

import { auth, uploadMemeAndSaveUrl } from "../firebase";
import { CaPost } from "../model";

const categories = [
  {
    value: "funny",
    label: "Funny",
  },
  {
    value: "non-funny",
    label: "Not Funny",
  },
];

// const validationSchema = Yup.object().shape({
//   caption: Yup.string().required('Required'),
//   category: Yup.string().required('Required'),
//   image: Yup.mixed()
//     .required('Required')
//     .test('fileType', 'Unsupported File Format', (value) => {
//       console.log('Testing file type:', value);
//       if (!value) {
//         return false;
//       }
//       const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
//       const isValid = supportedFormats.includes((value as File).type);
//       console.log('Validation result:', isValid);
//       return isValid;
//     }),
// });

export interface MemeFormValues {
  caption: string;
  category: string;
  imageUrl: string;
}

export const MemeForm = () => {
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  const handleSubmit = async (values: MemeFormValues) => {
    const postData: CaPost = {
      userId: auth.currentUser?.uid || "",
      caption: values.caption,
      mediaUrl: imageUrl || "",
      created: Timestamp.now(),
      category: values.category,
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      comments: [],
    };
    if (image) {
      await uploadMemeAndSaveUrl(image, postData);
    }
  };
  const initialValues = {
    caption: "",
    category: "",
    imageUrl: "",
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImage(file);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        // validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Grid container height="100vh">
            <Grid
              item
              xs={12}
              sm={10}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Form style={{ color: "white" }}>
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", mb: 1, mt: 1 }}
                  >
                    Caption
                  </Typography>
                  <Field
                    component={TextField}
                    name="caption"
                    type="text"
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
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "white", mb: 1, mt: 1 }}
                  >
                    Category
                  </Typography>
                  <Field
                    component={Select}
                    name="category"
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
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: "column-reverse",
                  }}
                  item
                >
                  <Field
                    component={TextField}
                    type="file"
                    name="image"
                    label="Image"
                    onChange={handleImageChange}
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
                    inputProps={{
                      sx: { accept: "image/*, video/mp4, video/*, .gif" },
                    }}
                    InputLabelProps={{ sx: { color: "white" } }}
                  />
                  {image && (
                    <Box sx={{ position: "relative", width: 200, height: 200 }}>
                      {imageUrl?.endsWith(".mp4") ? (
                        <video
                          src={imageUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          controls
                        >
                          <track kind="captions" />
                        </video>
                      ) : (
                        <img
                          src={imageUrl}
                          alt="Uploaded Meme"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          p: 1,
                        }}
                      >
                        <Typography variant="caption"></Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    sx={{ backgroundColor: "white", color: "black" }}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    Post
                  </Button>
                </Grid>
              </Form>
            </Grid>
          </Grid>
        )}
      </Formik>
    </Box>
  );
};
