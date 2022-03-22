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

function NewChannel(props) {
  const [createdChannel, setCreatedChannel] = useState("");
  const navigate = useNavigate();

  const web3Context = useContext(Web3Context);

  useEffect(() => {
    if (web3Context.contract === null) return;
    web3Context.contract.events.ChannelCreated().on("data", (event) => {
      const data = event.returnValues;
      console.log(data);
      console.log(createdChannel);
      if (data.name === createdChannel) {
        console.log(`Channel created -> send me to home`);
      }
    });
  }, [web3Context.contract]);

  async function createChannel(channel) {
    if (channel === "") return;

    const channelPath = `/communneth/1/${channel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;

    console.log(`Creating channel ${channel}`);
    await web3Context.contract.methods
      .createChannel(channel, channelPath)
      .send({ from: web3Context.accounts[0] });

    setCreatedChannel(channel);
    // navigate("/home");

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
          initialValues={{ channel: "" }}
          validate={(values) => {
            const errors = {};
            if (values.channel === "") {
              errors.channel = "Channel field required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            createChannel(values.channel);
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
