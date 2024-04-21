const BeaconScanner = require('node-beacon-scanner');
const scanner = new BeaconScanner();

class CircularBuffer {
  constructor(size = 5) {
    this.size = size;
    this.buffer = new Array(size);
    this.head = 0;
    this.length = 0;
  }

  // Add a new value to the buffer
  add(value) {
    this.buffer[this.head] = value;
    this.head = (this.head + 1) % this.size;
    if (this.length < this.size) {
      this.length++;
    }
  }

  // Get all current values in the buffer
  getValues() {
    // Returns the values in the order they were added, oldest first
    if (this.length < this.size) {
      return this.buffer.slice(0, this.length);
    }
    return [
      ...this.buffer.slice(this.head),
      ...this.buffer.slice(0, this.head),
    ];
  }
}

function calculateDistance(rssi, measuredPower, pathLossFactor) {
  // Handle invalid inputs (optional)
  if (
    rssi === undefined ||
    measuredPower === undefined ||
    pathLossFactor === undefined
  ) {
    throw new Error(
      'Missing required arguments: rssi, measuredPower, pathLossFactor'
    );
  }

  // Apply the distance estimation formula
  const distanceInMeters =
    10 ** ((measuredPower - rssi) / (10 * pathLossFactor));

  // Round the distance to two decimal places (optional)
  return Math.round(distanceInMeters * 100) / 100;
}

const measuredPower = -59; // https://fccid.io/2ABU6-D15N/User-Manual/User-Manual-3881008
const pathLossFactor = 2; // 2 -> office, 4 -> warehouse
const beacons = new Set([]);

function addBeacon(address) {
  beacons.add(address);
}

const bufsize = 7;
var circular = new CircularBuffer(bufsize);
var prev = 0;
var prevTimestamp = new Date();
const threshold = 0.75;

function setupBeaconScanner(onFoundBeacon) {
  // default beacon
  for (let i = 0; i < 5; i++) {
    circular.add(bufsize);
  }

  // Set an Event handler for beacons
  scanner.onadvertisement = (ad) => {
    if (ad.address && beacons.has(ad.address)) {
      // calculate the raw distance value (before normalising)
      const rawDistance = calculateDistance(
        ad.rssi,
        measuredPower,
        pathLossFactor
      );

      const pastValues = circular.getValues();
      const delta = rawDistance - prev;

      var currTime = new Date();
      var timeDiff = currTime - prevTimestamp; //in ms
      timeDiff /= 1000;
      var seconds = Math.round(timeDiff);

      // if (seconds > 10) {
      //   for (let i = 0; i < bufsize; i++) {
      //     circular.add(rawDistance)
      //   }
      // }
      // else if (seconds > 5) {
      //   circular.add(rawDistance)
      // }
      if (Math.abs(delta) < threshold) {
        circular.add(rawDistance);
      } else {
        const tmpAvg =
          pastValues.reduce((a, b) => a + b, 0) / pastValues.length;
        var mutedDelta;
        const maxInfluence = 0.5;
        if (delta > 0) {
          mutedDelta = Math.min(delta, maxInfluence);
        } else {
          mutedDelta = Math.max(delta, -maxInfluence);
        }
        circular.add(tmpAvg + mutedDelta);
      }
      const avg = pastValues.reduce((a, b) => a + b, 0) / pastValues.length;
      onFoundBeacon(ad, avg);
      prev = rawDistance;
    }
  };

  // Start scanning for beacons
  scanner
    .startScan()
    .then(() => {
      console.log('Started to scan.');
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  setupBeaconScanner,
  addBeacon,
};
