import React from "react";
import {
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from "@mui/material";

const LeftColumn = () => {
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <RadioGroup defaultValue={"liveView"}>
        <FormControlLabel
          value="liveView"
          control={<Radio />}
          label="Live View"
        />
      </RadioGroup>
    </Paper>
  );
};

export default LeftColumn;
