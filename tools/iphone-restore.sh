#!/bin/sh

idevicebackup2 restore --system --reboot backup/
# wait until the iPhone is fully booted
python tools/iphone-wait-restore.py
# restart to make the nasty iOS alerts go away (they interfere with testing)
idevicediagnostics restart
