import React from "react";
import { Paper, Typography } from "@mui/material";

const MidColumn = ({ isOccupied, isAssistanceRequired, timeEntered }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginLeft: 1 }}>
      <Typography variant="h6">
        <u>Toilet</u>
      </Typography>
      <div style={{ marginTop: 5 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Occupancy:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            backgroundColor: isOccupied
              ? isAssistanceRequired
                ? "#FFC0CB"
                : "#FFFF99"
              : "white",
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #000",
          }}
        >
          {isOccupied
            ? isAssistanceRequired
              ? "REQUIRE ASSISTANCE"
              : "IN USE"
            : "EMPTY"}
        </Typography>
      </div>

      <div style={{ marginTop: 5 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Since:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #000",
          }}
        >
          {(timeEntered == null) ? "-" : timeEntered}
        </Typography>
      </div>
      {/* ... Other fields like 'by' and 'since' */}
    </Paper>
  );
};

export default MidColumn;
