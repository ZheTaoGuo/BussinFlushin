//boilerplate code for right column
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const RightColumn = ({ lastActivity }) => {
  const [minsAgo, setMinsAgo] = useState([]);
  useEffect(() => {
     // Create a new current date object
    const currentDate = new Date();

    // Calculate the time difference for each item in lastActivity
    const timeDifferences = lastActivity.map(activityDate => {
      // Calculate the time difference in milliseconds
      const timeDifferenceMs = currentDate.getTime() - activityDate.getTime();
      // Convert milliseconds to minutes
      const minsDifference = Math.floor(timeDifferenceMs / (1000 * 60));
      return minsDifference;
    });
    setMinsAgo(timeDifferences);
  },[lastActivity]);
  return (
    <Paper elevation={3} sx={{ padding: 3, marginLeft: 1 }}>
      <Typography variant="h6">
        <u>Last Toilet Activity</u>
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {minsAgo.slice(0, 5).map((minutes, index) => (
            <TableRow key={index}>
              <TableCell>{minutes} minutes ago</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RightColumn;
