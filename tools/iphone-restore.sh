#!/bin/sh

idevicebackup2 restore --settings --system backup/
sleep 5
idevicediagnostics restart
sleep 55
# wait until the iPhone is fully booted
python tools/iphone-wait-restore.py
cordova run ios
sleep 15
echo "Device ready"
