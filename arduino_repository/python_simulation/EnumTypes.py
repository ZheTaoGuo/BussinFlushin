from enum import Enum

class GeneratorSensorType(Enum):
    GROVE_PROXIMITY = 1
    GROVE_ULTRASONIC = 2
    BEACON_FAKE = 3


class StateSimStates(Enum):
    RANDOM = 0
    UNOCCUPIED = 1
    NEAR_TOILET = 2
    NEAR_SINK = 3

