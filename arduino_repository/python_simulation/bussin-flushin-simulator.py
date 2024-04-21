#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from SerialDataGenerator import SerialDataGenerator
from EnumTypes import GeneratorSensorType
from StateSimulator import StateSimulator
import serial
import signal
import threading
import sys


def signal_handler(signum, frame):
    if signum == signal.SIGINT:
        print()
        print("kthxbye, ctrl-C exit. You can also use `exit` cmd to exit.")
    exit(1)
signal.signal(signal.SIGINT, signal_handler)


def simulateSensorData(run_event, portStr, sensor_type):
    try:
        with serial.Serial(port=portStr, baudrate=115200, timeout=2) as pyser:
            dataGenerator = SerialDataGenerator(sensor_type=sensor_type, state_sim=stateSim)
            while run_event.is_set():
                line = dataGenerator.readline()
                if line:
                    pyser.write(line)
    except OSError:
        print("OSError caught post keyboard interrupt, should be able to join thread now.")


run_event = threading.Event()
stateSim = StateSimulator()
thread_groveProximity = threading.Thread(target=simulateSensorData, args=(run_event, "/tmp/tty_V0", GeneratorSensorType.GROVE_PROXIMITY,))
thread_groveUltrasonic = threading.Thread(target=simulateSensorData, args=(run_event, "/tmp/tty_V1", GeneratorSensorType.GROVE_ULTRASONIC,))
thread_beaconFAKE = threading.Thread(target=simulateSensorData, args=(run_event, "/tmp/tty_V2", GeneratorSensorType.BEACON_FAKE,))


def handle_exit():
    run_event.clear()
    thread_groveProximity.join()
    thread_groveUltrasonic.join()
    thread_beaconFAKE.join()
    print("threads successfully closed.")


def handle_input():
    cmd = input("Enter cmd: ")
    if cmd == "exit":
        handle_exit()
        print("system exiting gracefully now")
        sys.exit()

    stateSim.handleCmd(cmd)
    




def main() -> None:
    run_event.set()
    
    thread_groveProximity.start()
    thread_groveUltrasonic.start()
    thread_beaconFAKE.start()
    try:
        while True:
            handle_input()
    except KeyboardInterrupt:
        handle_exit()
            
if __name__ == "__main__":
    main()
