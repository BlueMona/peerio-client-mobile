import atexit
import sys
import time
import os
import subprocess

global appiumProcess

def startAppium():
    global appiumProcess
    atexit.register(killAppium)
    appiumProcess = subprocess.Popen(['appium'], stdout=subprocess.PIPE)
    while True:
        line = appiumProcess.stdout.readline()
        if line != '':
            print line
        if "listener started" in line:
            return True

def killAppium():
    os.system("ps -A | grep [a]ppium | awk '{print $1}' | xargs kill -9")

def restartAppium():
    killAppium()
    startAppium()

