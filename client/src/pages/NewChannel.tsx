import React, { useContext, useState, useEffect } from "react";

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
import { Formik, FormikErrors } from "formik";
import { saveChannel } from "../utils/ChannelPersistance";
import { EventData } from "web3-eth-contract";

interface CreateChannelValues {
  channel: string;
  password: string;
}

function NewChannel() {
  const [createdChannel] = useState("");
  const navigate = useNavigate();

  const web3Context = useContext(Web3Context);

  /**
   * Listen for Channel created events ..
   */
  useEffect(() => {
    if (
      web3Context.contract === null ||
      web3Context.contract.events === undefined
    )
      return;

    web3Context.contract.events
      .ChannelCreated()
      .on("data", (event: EventData) => {
        console.log(`createdChannel ${createdChannel}`);
        if (event.returnValues.name === createdChannel) {
          saveChannel(createdChannel);
          navigate("/home");
        }
      });
    // eslint-disable-next-line
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
  async function createChannel(channel: string, password: string) {
    console.log(channel, password);

    if (channel === "") return;
    const cleanedChannelStr = channel
      .toString()
      .replace(" ", "-")
      .toLowerCase();

    const channelPath = `/communneth/1/${cleanedChannelStr}/proto`;

    console.log(`Creating channel ${channel}`);

    await web3Context.contract.methods
      .createChannel(channel, channelPath, password)
      .send({ from: web3Context.accounts[0] });
    console.log(`Channel create request sent`);
    // TODO: show waiting for completion
  }

  const initialValues: CreateChannelValues = { channel: "", password: "" };
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
          initialValues={initialValues}
          validate={(values: CreateChannelValues) => {
            // const errors = { channel: "", password: "" };
            let errors: FormikErrors<CreateChannelValues> = {};
            if (values.channel === "") {
              errors.channel = "Channel field required";
            }
            if (values.password === "") {
              errors.password = "Password field required";
            }
            return errors;
          }}
          onSubmit={(values: CreateChannelValues, actions) => {
            console.log(values);
            createChannel(values.channel, values.password).then(() => {
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
              <Grid
                container
                sx={{
                  display: "none",
                }}
              >
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
