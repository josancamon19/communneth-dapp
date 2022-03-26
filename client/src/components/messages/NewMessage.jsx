// import { Button, TextField } from "@mui/material";
import React, { useContext } from "react";
import { proto } from "../../utils/ProtoUtils";
import { WakuMessage } from "js-waku";
import { Formik } from "formik";
import WakuContext from "../../contexts/WakuContext";
import Web3Context from "../../contexts/Web3Context";
import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import SendRounded from "@mui/icons-material/SendRounded";
import { getSavedChannel } from "../../utils/ChannelPersistance";

function NewMessage(props) {
  const wakuContext = useContext(WakuContext);
  const web3Context = useContext(Web3Context);

  async function sendMessage(message) {
    const data = {
      timestamp: new Date().getTime(),
      text: message,
      sender: web3Context.accounts[0],
      messageType: 0,
    };

    const payload = proto.Message.encode(data);
    const msg = await WakuMessage.fromBytes(payload, getSavedChannel());
    await wakuContext.waku.relay.send(msg);
  }

  // TODO send poll message
  // TODO send payment request message

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
        onSubmit={async (values, { setSubmitting, setValues }) => {
          await sendMessage(values.message);
          setSubmitting(false);
          setValues({ message: "" });
          // props.reloadMessages();
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
              value={values.message}
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
            />
          </Box>
        )}
      </Formik>
    </Container>
  );
}

export default NewMessage;
