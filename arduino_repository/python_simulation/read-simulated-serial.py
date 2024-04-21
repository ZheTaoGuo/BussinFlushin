#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import serial
import serial.tools.list_ports
import os
import sys
import logging
import argparse
import random
import signal
import pprint
import time
import datetime
import glob

logging.basicConfig(
    format="%(asctime)s %(levelname)s %(filename)s:%(funcName)s():%(lineno)i: %(message)s", 
    datefmt="%Y-%m-%d %H:%M:%S", 
    level=logging.DEBUG)
logger = logging.getLogger(__name__)


def signal_handler(signum, frame):
    if signum == signal.SIGINT:
        print()
        print("kthxbye")
    exit(1)
signal.signal(signal.SIGINT, signal_handler)


def print_serial_ports() -> None:

    vidpid_filter = [ 
                     "0D28:0204", # micro:bit
                     "2341:805A", # Nano 33 BLE
                     "2341:045F", # Nicla Vision
                     ]

    ports = list(serial.tools.list_ports.comports())
    
    if not ports:
        print("No ports found.")
        return
    
    print("Ports found:") 
    for port in ports:
        if any(x.upper() in port[2].upper() for x in vidpid_filter):
            identifier = port.hwid.split(' ')[2].split('=')[1]
            print(f"{port.device}")
            print(f"    desc: {port.description}")
            print(f"    hwid: {port.hwid}")
            
            # For some OSes, print the device aliases
            aliases = glob.glob(f"/dev/serial/by-id/*{identifier}*")
            for alias in aliases:
                print(f"    device alias: {alias}")
            print()


def main() -> None:

    parser = argparse.ArgumentParser()
    parser.add_argument("port", nargs="?")
    args = parser.parse_args()
    args_port = args.port

    if args_port:
        print_serial_ports()
        print(f"Using serial port: {args_port}")
    else:
        print(f"Error: must specify the serial port 💤")
        print(f"Example:")
        print()
        print(f"    python {os.path.basename(__file__)} INSERT_YOUR_SERIAL_PORT_HERE")
        print()
        print(f"Serial ports available:")
        print_serial_ports()
        exit()

    try:
        # Open serial connection
        with serial.Serial(port=args_port, baudrate=115200, timeout=2) as s:
            # Open a file for writing inside the serial loop
            print("Press Ctrl-C to stop")
            print("--------------------")

            while True:
                line = s.readline()
                line = line.decode('utf-8')
                if line:
                    # Write the line to the file
                    print(f"{datetime.datetime.now():%H:%M:%S}, {line}")
            
    except KeyboardInterrupt:
        print("\nCtrl-C pressed. Closing the file and exiting gracefully.")
        # The file will be closed automatically when exiting the `with` block


if __name__ == "__main__":
    main()