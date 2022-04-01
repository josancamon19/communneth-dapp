// import { Button, TextField } from "@mui/material";
import React, { useContext } from "react";
import { proto } from "../../utils/ProtoUtils";
import { WakuMessage } from "js-waku";
import { Formik, FormikErrors } from "formik";
import WakuContext from "../../contexts/WakuContext";
import Web3Context from "../../contexts/Web3Context";
import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import SendRounded from "@mui/icons-material/SendRounded";
import { getSavedChannel } from "../../utils/ChannelPersistance";

interface MessageFormValues {
  message: string;
}

function NewMessage() {
  const initialValues: MessageFormValues = { message: "" };
  const wakuContext = useContext(WakuContext);
  const web3Context = useContext(Web3Context);

  const channel = getSavedChannel();

  async function sendMessage(message: string) {
    const data = {
      timestamp: new Date().getTime(),
      text: message,
      sender: web3Context.accounts[0],
      messageType: 0,
    };

    const payload = proto.Message.encode(data);
    const msg = await WakuMessage.fromBytes(payload, `${channel}`);
    await wakuContext.waku.relay.send(msg);
  }

  // TODO send poll message
  // TODO send payment request message

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validate={(values: MessageFormValues) => {
          let errors: FormikErrors<MessageFormValues> = {};
          if (values.message === "") {
            errors.message = "What's the message? 🤔 ";
          }
          return errors;
        }}
        onSubmit={async (
          values: MessageFormValues,
          { setSubmitting, setValues }
        ) => {
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
            {/* <Button
              variant="outlined"
              disabled={isSubmitting}
              endIcon={<ArrowDropDownCircleIcon />}
              size="large"
              onClick={() => {
                // TODO: Display drodpwn list for
                // - Initiate Poll
                // - Initiate Payment message
              }}
            /> */}
          </Box>
        )}
      </Formik>
    </Container>
  );
}

export default NewMessage;
