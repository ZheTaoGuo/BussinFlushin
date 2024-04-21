const { setup, assign } = require('xstate');
const { informTO } = require('./request.js');

let handwashingTimer = null;
let isHandwashingStarted = false;

const toiletStateMachine = (sendData) =>
  setup({
    actions: {
      informTO: (context, params) => {
        console.log(`informing To : ${params.data}`)
        informTO(params.data);
        sendData('ASSISTANCE-' + new Date().toISOString());
      },
      checkHandWashingSpeed: (context, params) => {
        clearTimeout(handwashingTimer); // Clear any existing timer
        isHandwashingStarted = true;
        handwashingTimer = setTimeout(() => {
          // After 20 seconds, check if handwashing is completed properly
          if (!isHandwashingCompleted) {
            handleSensorEvent('HANDWASHING_SHORT');
          }
          // Reset state
          isHandwashingStarted = false;
          isHandwashingCompleted = false; // Assuming you track this based on some criteria
        }, 20000); // 20 seconds
      },
      log: (context, params) => { },
    },
  }).createMachine({
    initial: 'unoccupied',
    states: {

      // toilet is unoccupied state
      unoccupied: {
        on: {
          // when someone enters the toilet, transition to enterToilet
          BEACON_DETECTED: 'enterToilet',
        },
      },

      // toilet is occupied state
      enterToilet: {
        entry: [
          {
            type: 'informTO',
            params: {
              data: 'User entered the toilet',
            },
          },
        ],
        on: {
          // when someone uses the toilet, transition to usingToilet
          TOILET_USED: 'usingToilet',
          // when the user leaves without using the toilet
          BEACON_OUT_OF_RANGE: 'unoccupied',
        },
      },

      // toilet is in use state
      usingToilet: {
        on: {
          TOILET_UNUSED: 'finishToilet',
          // Assuming BEACON_OUT_OF_RANGE_SHORT means the user left
          BEACON_OUT_OF_RANGE: {
            after: {
              30000: 'unoccupied',
              actions: [
                {
                  type: 'informTO',
                  params: { data: 'User left without using the toilet' },
                },
              ],
            },
          },
        },
      },
      finishToilet: {
        on: {
          TOILET_USED: 'usingToilet',
          WASH_HANDS: 'washingHands',
          BEACON_OUT_OF_RANGE: 'assist'
          // {
          // after: {
          //   30000: 'unoccupied',
          //   actions: [
          //     {
          //       type: 'informTO',
          //       params: { data: 'User left without using the toilet' },
          //     },
          //   ],
          // },
          // },
        },
      },
      assist: {
        entry: [
          {
            type: 'informTO',
            params: { data: 'User left without washing hands' },
          },
        ],
        on: {
          BEACON_DETECTED: 'finishToilet',
          BEACON_OUT_OF_RANGE: {
            after: {
              60000: 'unoccupied',
            },
          },
        },
      },
      washingHands: {
        on: {
          // If the user leaves during hand washing
          BEACON_OUT_OF_RANGE: {
            target: 'unoccupied',
            // actions: [
            //   {
            //     type: 'informTO',
            //     params: { data: 'User left without using the toilet' },
            //   },
            // ],
          },
        },
        exit: [
          {
            type: 'informTO',
            params: { data: 'User finished using toilet' },
          },
        ]
      },
    },
  });

module.exports = toiletStateMachine;
