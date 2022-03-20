import React, { useEffect } from "react";
import { Button } from "@mui/material";

function Login() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const channel = queryParams.get("channel");
    console.log(channel);
    // TODO use router way of params
  }, []);

  return <Button>Test Button</Button>;
}

export default Login;
