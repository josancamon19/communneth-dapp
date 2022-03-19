import { Typography } from "@mui/material";
import React from "react";

function PageTitle(props) {
  return (
    <Typography variant="h6" component="h6">
      {props.title}
    </Typography>
  );
}

export default PageTitle;
