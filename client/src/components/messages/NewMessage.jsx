// import { Button, TextField } from "@mui/material";
import React, { useContext } from "react";
import { proto } from "../../utils/ProtoUtils";
import { WakuMessage } from "js-waku";
import { Formik } from "formik";
import WakuContext from "../../contexts/WakuContext";
import { Button, Container, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import SendRounded from "@mui/icons-material/SendRounded";

function NewMessage(props) {
  const wakuContext = useContext(WakuContext);

  async function sendMessage(message) {
    const data = {
      timestamp: new Date().getTime(),
      text: message,
      sender: props.accounts[0],
      messageType: 0,
    };

    const payload = proto.Message.encode(data);
    const msg = await WakuMessage.fromBytes(payload, props.channel);
    await wakuContext.waku.relay.send(msg);
  }

  return (
    <Container>
      <Formik
        initialValues={{ message: "" }}
        validate={(values) => {
          const errors = {};
          if (values.message === "") {
            errors.message = "What's the message? 🤔 ";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);

          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextField
              id="message"
              name="message"
              label="Message"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.channel}
              required
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              endIcon={<SendRounded />}
              size="large"
            ></Button>
          </Box>
        )}
      </Formik>
    </Container>
  );
}

export default NewMessage;