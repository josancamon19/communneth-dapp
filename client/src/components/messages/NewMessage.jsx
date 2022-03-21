// import { Button, TextField } from "@mui/material";
import React, { useContext } from "react";
import { proto } from "../../utils/ProtoUtils";
import { WakuMessage } from "js-waku";
import { Formik } from "formik";
import WakuContext from "../../contexts/WakuContext";

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
    <>
      <Formik
        initialValues={{ message: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.message) {
            errors.message = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          sendMessage(values.message);
          setSubmitting(false);
        }}
      >
        {/* https://formik.org/docs/overview */}
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="message"
              name="message"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.message}
            />
            {errors.message && touched.message && errors.message}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}

export default NewMessage;
