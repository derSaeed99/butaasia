import { Button, Grid } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React from "react";

import { firebaseAddContactMessages } from "../firebase";
import { CaContactFormValues } from "../Types/interfaces";

export const ContactForm = () => {
  const initialValues: CaContactFormValues = {
    name: "",
    email: "",
    message: "",
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: CaContactFormValues) => {
          await firebaseAddContactMessages(values);
        }}
      >
        <Form>
          <Grid
            rowSpacing={2}
            container
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Field
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 50,
                  },
                }}
                placeholder="Name"
                name="name"
                type="text"
                component={TextField}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 50,
                  },
                }}
                placeholder="Email"
                name="email"
                type="text"
                component={TextField}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 50,
                  },
                }}
                placeholder="Nachricht"
                name="message"
                type="text"
                component={TextField}
              />
            </Grid>
            <Grid item sm={12}>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: 50 }}
                type="submit"
              >
                Absenden
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </>
  );
};
