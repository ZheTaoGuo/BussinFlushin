#!/usr/bin/env bash

# Before running on mac, pls make sure to `brew install socat`
# Or on linux: apt-get install -y socat
socat -d -d pty,rawer,echo=0,link=/tmp/tty_V0 pty,rawer,echo=0,link=/tmp/ttyV0 >/dev/null 2>&1 &
socat -d -d pty,rawer,echo=0,link=/tmp/tty_V1 pty,rawer,echo=0,link=/tmp/ttyV1 >/dev/null 2>&1 &
socat -d -d pty,rawer,echo=0,link=/tmp/tty_V2 pty,rawer,echo=0,link=/tmp/ttyV2 >/dev/null 2>&1 &
python3 bussin-flushin-simulator.py
