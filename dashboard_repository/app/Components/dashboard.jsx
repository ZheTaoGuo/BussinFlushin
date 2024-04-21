'use client';
import {
  Box,
  Paper,
  Typography,
  Radio,
  Grid,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import LeftColumn from './leftColumn';
import MidColumn from './midColumn';
import RightColumn from './rightColumn';

const Dashboard = () => {
  const [isOccupied, setIsOccupied] = useState();
  const [isAssistanceRequired, setIsAssistanceRequired] = useState();
  const [timeEntered, setTimeSince] = useState();
  const [lastActivity, setLastActivity] = useState([
    //will contain the last time the toilet
  ]);

  useEffect(() => {
    const hostname = window.location.hostname.split(":")[0]
    const ws = new WebSocket(`ws://${hostname}:3000/serial-data`);
    ws.onmessage = function(event) {
      const data = JSON.parse(event.data);
      var state = parseLine(data.data);
      var timeSince = parseTime(data.data);

      // debug
      console.log(state);
      console.log(timeSince);

      setVariables(state);
      setTimeSince(timeSince);
    };
  }, []);

  useEffect(() => {
    //upate last activity with latest time when isOccupied becomes false
    if (!isOccupied) {
      setLastActivity((prevActivity) => [...prevActivity, new Date()]);
    }
  }, [isOccupied]);

  function parseTime(line) {
    // get the time
    const timeSince = convertToSingaporeTime(line);

    return timeSince;
  }

  function parseLine(line) {
    // Debug
    console.log(line);

    // get the state
    const regex = /^["-]*([^0-9]*)/;
    const state = line.match(regex);
    var stateFirstKey = state[0];
    var stateKey = stateFirstKey.split('-');

    // return both the state and the time
    return stateKey[0];
  }

  function convertToSingaporeTime(inputStr) {
    // Extract the timestamp part from the input string
    const timestampStr = inputStr.substring(
      inputStr.lastIndexOf('2024'),
      inputStr.length - 1
    );
    // Convert the extracted timestamp to a Date object
    const timestamp = new Date(timestampStr);

    // Calculate the Singapore time offset in hours (UTC+8)
    const singaporeOffset = 8;
    const singaporeTime = new Date(
      timestamp.getTime() + singaporeOffset * 60 * 60 * 1000
    );
    // Extract and format the hours and minutes
    let hours = singaporeTime.getHours();
    let minutes = singaporeTime.getMinutes();
    // Pad single digit minutes with a leading zero
    minutes = minutes < 10 ? '0' + minutes : minutes;
    // Combine the hours and minutes in HH:MM format
    const formattedTime = hours + ':' + minutes; //${hours}:${minutes}

    return formattedTime;
  }

  function setVariables(item) {
    switch (item) {
      case 'UNOCCUPIED':
        setIsOccupied(false);
        setIsAssistanceRequired(false);
        break;
      case 'ASSISTANCE':
        setIsAssistanceRequired(true);
        break;
      case 'INUSE':
        setIsOccupied(true);
        setIsAssistanceRequired(false);
        break;
      default:
        break;
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '30%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        LIVE VIEW (DASHBOARD) -{' '}
        {isOccupied
          ? isAssistanceRequired
            ? 'REQUIRE ASSISTANCE'
            : 'IN USE'
          : 'EMPTY'}
      </Typography>

      <Box display="flex" justifyContent={'center'}>
        {/* left column */}
        <LeftColumn />
        {/* middle column */}
        <MidColumn
          isOccupied={isOccupied}
          isAssistanceRequired={isAssistanceRequired}
          timeEntered={timeEntered}
        />

        {/* right column */}
        <RightColumn lastActivity={lastActivity} />
      </Box>
    </div>
  );
};

export default Dashboard;
