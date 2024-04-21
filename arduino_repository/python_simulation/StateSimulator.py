from enum import Enum
from EnumTypes import GeneratorSensorType
from EnumTypes import StateSimStates as State
import random


class StateSimulator:
    def __init__(self):
        self._state = State.UNOCCUPIED
    
    def __getReadingsForProximity(self):
        if self._state == State.RANDOM:
            return f"{random.uniform(0,4):.2f}"
        elif self._state == State.UNOCCUPIED:
            return f"{random.uniform(0.0, 0.3):.2f}"
        elif self._state == State.NEAR_TOILET:
            return f"{random.uniform(1.1, 4.0):.2f}"
        elif self._state == State.NEAR_SINK:
            return f"{random.uniform(0.0, 0.6):.2f}"
        else:
            print("ERROR: Unknown state", self._state)
            return ""

    def __getReadingsForUltrasonic(self):
        if self._state == State.RANDOM:
            return f"{random.uniform(1,101):.2f}"
        elif self._state == State.UNOCCUPIED:
            return f"{random.uniform(80.0, 120.0):.2f}"
        elif self._state == State.NEAR_TOILET:
            return f"{random.uniform(80.0, 120.0):.2f}"
        elif self._state == State.NEAR_SINK:
            return f"{random.uniform(1.0, 40.0):.2f}"
        else:
            print("ERROR: Unknown state", self._state)
            return ""
    
    def __getReadingsForBeaconFake(self):
        if self._state == State.RANDOM:
            return f"{random.uniform(0, 200):.0f}"
        elif self._state == State.UNOCCUPIED:
            return f"{random.uniform(100, 200.0):.0f}"
        elif self._state == State.NEAR_TOILET:
            return f"{random.uniform(10, 90):.0f}"
        elif self._state == State.NEAR_SINK:
            return f"{random.uniform(10, 90):.0f}"
        else:
            print("ERROR: Unknown state", self._state)
            return ""

    def getReadingsForSensor(self, sensor_type):
        if sensor_type == GeneratorSensorType.GROVE_PROXIMITY:
            return self.__getReadingsForProximity()
        elif sensor_type == GeneratorSensorType.GROVE_ULTRASONIC:
            return self.__getReadingsForUltrasonic()
        elif sensor_type == GeneratorSensorType.BEACON_FAKE:
            return self.__getReadingsForBeaconFake()
        else:
            print("ERROR: Unknown sensor type when reading from state simulator")
            return ""

    def handleCmd(self, cmd):
        args = cmd.split()
        if len(args) < 1:
            return
        if args[0] == "random":
            self._state = State.RANDOM
        elif args[0] == "unoccupied":
            self._state = State.UNOCCUPIED
        elif cmd == "near toilet":
            self._state = State.NEAR_TOILET
        elif cmd == "near sink":
            self._state = State.NEAR_SINK
        elif cmd == "help":
            cmd_list = """
List of commands:
help - displays this list
exit - gracefully exits the simulator

random      - sets the sensors to output random data
empty       - sets the sensors to output exepcted unoccupied data
near toilet - sets the sensor to output expected near toilet bowl data
near sink   - sets the sensor to output expected near sink data
"""
            print(cmd_list)
        else:
            print("ERROR: cmd not recognised")