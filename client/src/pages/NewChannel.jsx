import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../contexts/Web3Context";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Link,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { saveChannel } from "../utils/ChannelPersistance";

function NewChannel(props) {
  const [createdChannel, setCreatedChannel] = useState("");
  const navigate = useNavigate();

  const web3Context = useContext(Web3Context);

  /**
   * Listen for Channel created events ..
   */
  useEffect(() => {
    if (web3Context.contract === null) return;

    web3Context.contract.events.ChannelCreated().on("data", (event) => {
      console.log(`createdChannel ${createdChannel}`);
      console.log(event.returnValues);
      if (event.returnValues.name === createdChannel) {
        saveChannel(createdChannel);
        navigate("/home");
      }
    });
  }, [web3Context.contract]);

  /**
   * Create channel function
   * - Executes the createChannel method in the smart contract
   * - Then sets the state variable createdChannel
   * - The listener initiated on top will match the event received to the new
   *   channel name, continuing to home after that
   * @param {string} channel
   * @param {string} password
   * @returns null
   */
  async function createChannel(channel, password) {
    if (channel === "") return;

    const channelPath = `/communneth/1/${channel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;

    console.log(`Creating channel ${channel}`);
    setCreatedChannel(_ => channel);
    console.log(createdChannel);
    // TODO why created channel not being saved here?
    
    await web3Context.contract.methods
      .createChannel(channel, channelPath, password)
      .send({ from: web3Context.accounts[0] });

    // TODO: show waiting for completion
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
        <Typography variant="h5" component="h1">
          Create a channel
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
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await createChannel(values.channel, values.password);
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
              sx={{ mt: 3 }}
            >
              <TextField
                id="channel"
                name="channel"
                label="Channel name"
                variant="outlined"
                placeholder="Conjunto los cerezos"
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
                variant="contained"
                type="submit"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2, mb: 2 }}
              >
                Create
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/home" variant="body2">
                    Go to home
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

export default NewChannel;
