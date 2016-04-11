import atexit
import sys
import time
import os
import subprocess

global appiumProcess
global chromedriverProcess

def startAppium():
    global appiumProcess
    atexit.register(killAppium)
    appiumProcess = subprocess.Popen(['appium'], stdout=subprocess.PIPE)
    while True:
        line = appiumProcess.stdout.readline()
        if line != '':
            print line.strip()
        if "listener started" in line:
            return True

def killAppium():
    os.system("ps -A | grep [a]ppium | awk '{print $1}' | xargs kill -9")

def restartAppium():
    killAppium()
    startAppium()

def startChromedriver():
    global chromedriverProcess
    atexit.register(killChromedriver)
    chromedriverPath = os.path.join(os.path.dirname(__file__), '../../tools/chromedriver')
    chromedriverProcess = subprocess.Popen([chromedriverPath], stdout=subprocess.PIPE)
    while True:
        line = chromedriverProcess.stdout.readline()
        if line != '':
            print line.strip()
        if "are allowed" in line:
            time.sleep(2)
            return True

def killChromedriver():
    os.system("ps -A | grep [c]hromedriver | awk '{print $1}' | xargs kill -9")

def restartChromedriver():
    killChromedriver()
    startChromedriver()

