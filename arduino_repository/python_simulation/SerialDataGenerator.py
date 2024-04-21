import time
from enum import Enum
import random
import threading
from StateSimulator import StateSimulator
from EnumTypes import GeneratorSensorType


class SerialDataGenerator:
    def __init__(self, sensor_type, state_sim):
        self._sensor_type = sensor_type
        self._state_sim = state_sim

        # non param instance variables
        self._data = ""
        
        # create thread to continuously add data.
        self._data_thread = threading.Thread(target=self._add_data_continuously)
        self._data_thread.daemon = True
        self._data_thread.start()
    
    def readline(self):
        returnIndex = self._data.find("\n")  # Search for newline character in string
        if returnIndex != -1:
            s = self._data[:returnIndex + 1].encode('utf-8')  # Convert slice to bytes
            self._data = self._data[returnIndex + 1:]
            return s
        else:
            return b""


    ## All the continuous data types.
    def _add_data_handle_grove_proximity(self):
        while True:
            time.sleep(0.25)
            additional_data = f"grove_prox-{self._state_sim.getReadingsForSensor(GeneratorSensorType.GROVE_PROXIMITY)}\n"
            self._data += additional_data
    
    def _add_data_handle_grove_ultrasonic(self):
        while True:
            time.sleep(0.25)
            additional_data = f"ultrasonic-{self._state_sim.getReadingsForSensor(GeneratorSensorType.GROVE_ULTRASONIC)}"
            additional_data += "\n"
            self._data += additional_data
    
    def _add_data_handle_beacon_fake(self):
        while True:
            time.sleep(1.0)
            additional_data = f"beaconId-{self._state_sim.getReadingsForSensor(GeneratorSensorType.BEACON_FAKE)}"
            additional_data += "\n"
            self._data += additional_data

    def switch_case(self, sensor_type):
        switcher = {
            GeneratorSensorType.GROVE_PROXIMITY: self._add_data_handle_grove_proximity,
            GeneratorSensorType.GROVE_ULTRASONIC: self._add_data_handle_grove_ultrasonic,
            GeneratorSensorType.BEACON_FAKE: self._add_data_handle_beacon_fake
        }
        # Get the function corresponding to the sensor type and call it
        switcher.get(sensor_type, lambda: print("Unknown sensor type"))()

    def _add_data_continuously(self):
        self.switch_case(self._sensor_type)

    