const { SerialPort } = require('serialport');
const WebSocket = require('ws');
const { createActor } = require('xstate');
const toiletStateMachine = require('./toiletStateMachine');
const { setupBeaconScanner, addBeacon } = require('./beaconScanner.js');

const serialport_toilet = new SerialPort({
  path: '/dev/ttyACM-T',
  // path: '/dev/ttyACM0',
  // Below is simulator version of tty port
  // path: '/dev/ttyS1',
  baudRate: 115200,
});

const serialport_sink = new SerialPort({
  path: '/dev/ttyACM-S',
  baudRate: 115200,
});

// ============== Magic Numbers ==============
const TIMEOUT = 30000; // 30 seconds
const PROXIMITY_THRESHOLD = 5; //
const BEACON_THRESHOLD = 1; // meters
const FINISH_TOILET = 5000; // 5 seconds
const TOILET_DISTANCE = 80; // 80 cm
const INFRARED_THRESHOLD = 2; //
const MANS_GONE = 15000; // 15 seconds
let currState = 'unoccupied';
var prevState = currState;
// ============== Magic Numbers ==============

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
var conns = new Set();

const sendData = (data) => {
  console.log('Sending data:', data);
  prevState = data;
  for (let conn of conns) {
    conn.send(JSON.stringify({ data }));
    // ws.send(JSON.stringify({ data }));
  }
};

const toiletService = createActor(toiletStateMachine(sendData)).start();
var toilet_reading = 0;
var sink_reading = 0;

serialport_sink.on(
  'open',
  () => console.log('Serial Port Opened'),
  (err) => console.log('Error:', err)
);

serialport_toilet.on(
  'open',
  () => console.log('Serial Port Opened'),
  (err) => console.log('Error:', err)
);

// add beacons that you want to track
addBeacon('ac:23:3f:63:21:2f');
// addBeacon('ac:23:3f:63:21:24');

// setup beacon scanner to start scanning
// configure it with a callback
setupBeaconScanner((ad, distance) => {
  console.log(distance);
  if (distance < BEACON_THRESHOLD) {
    handleSensorEvent('BEACON_DETECTED');
  } else {
    handleSensorEvent('BEACON_OUT_OF_RANGE');
  }
});

// Listen for data from the serial port
serialport_sink.on('data', (data) => {
  const str = data.toString();
  const parts = str.split('-');
  if (parts.length === 2) {
    sink_reading = parseFloat(parts[1]);
    if (sink_reading > INFRARED_THRESHOLD) {
      console.log(`sink reading: ${sink_reading}`)
      handleSensorEvent('WASH_HANDS');
    }
  }
});

serialport_toilet.on('data', (data) => {
  const str = data.toString();
  const parts = str.split('-');
  if (parts.length === 2) {
    toilet_reading = parseFloat(parts[1]);
    if (toilet_reading < TOILET_DISTANCE) {
      handleSensorEvent('TOILET_USED');
    } else {
      handleSensorEvent('TOILET_UNUSED');
    }
  }
});

// Create client set for ws connect to add to. Will be removed when ws close.

const handleSensorEvent = (type) => {
  toiletService.send({ type });
};

toiletService.subscribe((state) => {
  console.log('State:', state.value);
  if (state.value !== currState) {
    if (state.value === 'unoccupied') {
      sendData('UNOCCUPIED-' + new Date().toISOString());
    } else if (state.value === 'enterToilet') {
      sendData('INUSE-ENTER-' + new Date().toISOString());
    } else if (state.value === 'usingToilet') {
      sendData('INUSE-USING-' + new Date().toISOString());
    } else if (state.value === 'finishToilet') {
      sendData('INUSE-FINISH-' + new Date().toISOString());
    } else if (state.value === 'washingHands') {
      sendData('INUSE-WASHING-' + new Date().toISOString());
    } else if (state.value === 'assist') {
      sendData('ASSISTANCE-' + new Date().toISOString());
    }
    currState = state.value;
  }
});

// while (true) {
//   console.log(currState, beaconReadings);
//   let distance = beaconReadings.get('ac:23:3f:63:21:2f');
//   if (currState !== 'enterToilet' && currState !== 'unoccupied') {
//     if (distance > BEACON_THRESHOLD) {
//       // Check if a timer already exists for this beacon
//       if (!beaconTimers.has('ac:23:3f:63:21:2f')) {
//         // Set a timer for 30 seconds
//         const timer = setTimeout(() => {
//           handleSensorEvent('BEACON_OUT_OF_RANGE_LONG');
//           console.log(
//             `${'ac:23:3f:63:21:2f'} has been over 10 meters away for 30 seconds.`
//           );
//           beaconTimers.delete('ac:23:3f:63:21:2f'); // Remove the timer after firing
//         }, TIMEOUT); // 30 seconds
//         beaconTimers.set('ac:23:3f:63:21:2f', timer);
//       }
//     } else {
//       // If the beacon comes within 10 meters, clear the timer and remove it from the map
//       if (beaconTimers.has('ac:23:3f:63:21:2f')) {
//         clearTimeout(beaconTimers.get('ac:23:3f:63:21:2f'));
//         beaconTimers.delete('ac:23:3f:63:21:2f');
//       }

//       handleSensorEvent('BEACON_DETECTED');
//     }
//   }
//   if (currState === 'unoccupied') {
//     if (distance < BEACON_THRESHOLD) {
//       handleSensorEvent('BEACON_DETECTED');
//     }
//   } else if (currState === 'enterToilet') {
//     if (toilet_reading < TOILET_DISTANCE) {
//       handleSensorEvent('TOILET_USED');
//       clearTimeout(beaconTimers.get('ac:23:3f:63:21:2f'));
//     } else {
//       if (!beaconTimers.has('ac:23:3f:63:21:2f')) {
//         // Set a timer for 30 seconds
//         const timer = setTimeout(() => {
//           handleSensorEvent('BEACON_OUT_OF_RANGE_SHORT');
//           console.log(
//             `${'ac:23:3f:63:21:2f'} has been over 10 meters away for 15 seconds.`
//           );
//           beaconTimers.delete('ac:23:3f:63:21:2f'); // Remove the timer after firing
//         }, MANS_GONE); // 15 seconds
//         beaconTimers.set('ac:23:3f:63:21:2f', timer);
//       }
//     }
//   } else if (currState === 'usingToilet') {
//     if (toilet_reading > PROXIMITY_THRESHOLD) {
//       if (!timer) {
//         // If timer is not already set
//         timer = setTimeout(() => {
//           handleSensorEvent('FINISH');
//           timer = null; // Reset timer after the event is handled
//         }, FINISH_TOILET); // Wait for 5 seconds
//       }
//     } else {
//       // If the object comes within the threshold, reset the timer and counter
//       if (timer) {
//         clearTimeout(timer); // Clear the timeout
//         timer = null; // Reset the timer variable
//       }
//     }
//   } else if (currState === 'finishToilet') {
//     if (sink_reading < INFRARED_THRESHOLD) {
//       handleSensorEvent('WASH_HANDS');
//     }
//   } else if (currState === 'washingHands') {
//     if (sink_reading < INFRARED_THRESHOLD) {
//       // The user has started washing hands, start the timer
//       startHandwashingTimer();
//     } else if (distance > BEACON_THRESHOLD && isHandwashingStarted) {
//       // If the beacon goes out of range before handwashing is deemed completed, trigger an event
//       handleSensorEvent('BEACON_OUT_OF_RANGE_SHORT');
//       // Reset the handwashing currState
//       clearTimeout(handwashingTimer);
//       isHandwashingStarted = false;
//       isHandwashingCompleted = false; // Reset this based on your actual completion logic
//     }
//   }
// }

app.ws('/serial-data', (ws, req) => {
  console.log('WebSocket connection established');
  conns.add(ws);
  ws.send(JSON.stringify({ data: prevState }));

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    conns.delete(ws);
  });
});

app.listen(3000);
