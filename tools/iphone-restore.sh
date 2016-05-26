#!/bin/sh

idevicebackup2 restore --settings --system backup/
sleep 5
idevicediagnostics restart
sleep 55
# wait until the iPhone is fully booted
python tools/iphone-wait-restore.py
# restart to make the nasty iOS alerts go away (they interfere with testing)
# idevicediagnostics restart
# python tools/iphone-wait-reboot.py
# sleep 5
echo "Device ready"
