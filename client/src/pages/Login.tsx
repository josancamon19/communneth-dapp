import React, { useContext, useEffect } from "react";
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
import { Formik, FormikErrors } from "formik";
import Web3Context from "../contexts/Web3Context";
import { saveChannel, getSavedChannel } from "../utils/ChannelPersistance";
interface SignInFormValues {
  channel: string;
  password: string;
}

function Login() {
  const initialValues: SignInFormValues = { channel: "/communneth/1/123/proto", password: "13" };

  const navigate = useNavigate();
  const web3Context = useContext(Web3Context);

  useEffect(() => {
    if (getSavedChannel() !== null) {
      navigate("/home");
    }
    // eslint-disable-next-line
  }, []);

  /**
   * DISCLAIMER: of course this is not going to work. Blockchain is public thus passwording does not work.
   * Options:
   * - Handling a list (admin managed or voting managed) of users allowed in it
   * - Using zkSnarks for proving the password?
   *
   * What this method does?
   * -> Basically goes to the contract and checks credentials,
   *    if valid, saves them, finally navigates to home
   * @param {string} channel
   * @param {string} password
   */
  async function handleSignIn(channel: string, password: string) {
    console.log(
      `Authenticating with channel: '${channel}' and password '${password}'`
    );
    await web3Context.contract.methods
      .matchesCredentials(channel, password)
      .call({ from: web3Context.accounts[0] }, (err: Error, result: any) => {
        if (err !== null) {
          // Show err
          return;
        } else if (!result) {
          // Password not matching
          return;
        }
        saveChannel(channel);
        navigate("/home");
      });
    // communeth/1/conjunto1/proto
  }

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
          initialValues={initialValues}
          validate={(values: SignInFormValues) => {
            let errors: FormikErrors<SignInFormValues> = {};
            if (values.channel === "") {
              errors.channel = "Channel field required";
            }
            if (values.password === "") {
              errors.password = "Password field required";
            }
            if (errors.channel === undefined) {
              if (values.channel.split("/").length !== 5) {
                errors.channel = "Invalid channel value";
              }
            }

            return errors;
          }}
          onSubmit={(values: SignInFormValues, actions) => {
            handleSignIn(values.channel, values.password).then(() => {
              actions.setSubmitting(false);
            });
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
                placeholder="/communneth/1/conjunto1/proto"
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
