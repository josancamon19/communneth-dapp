import React, { useEffect } from "react";
import NewChannel from "./NewChannel";
import { Button } from "@mui/material";

function Login() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const channel = queryParams.get("channel");
  });
  return (
    <div>
      <Button>Test Button</Button>
    </div>
  );
}

export default Login;
