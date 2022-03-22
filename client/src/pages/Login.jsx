import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { Formik, ErrorMessage } from "formik";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const channel = queryParams.get("channel");
    console.log(channel);
    // TODO use router way of params
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{ channel: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (values.channel === "") {
              errors.channel = "Channel field required";
            }
            if (values.password === "") {
              errors.password = "Password field required";
            }
            if (errors.channel === undefined) {
              if (values.channel.split("/").length !== 4) {
                errors.channel = "Invalid channel value";
              }
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            // TODO go to contract and find channel matches password
            // TODO if so, 
            // - save in local storage using store.js
            // - go to home
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                placeholder="communeth/1/conjuntoloscerezos/proto"
                id="channel"
                label="Channel"
                name="channel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.channel}
                fullWidth
                autoFocus
                required
              />
              {errors.channel && touched.channel && errors.channel}
              <TextField
                margin="normal"
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                fullWidth
                autoFocus
                required
              />
              {errors.password && touched.password && errors.password}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/new-channel" variant="body2">
                    Create channel
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Login;
