import atexit
import sys
import time
import os
import subprocess
import browserautomationserver
import commands

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

global browserAutomationProcess
def startBrowserAutomation():
    # do not kill browser automation server on exit so that there are
    # no noisy messages about not able to connect to automation socket in browser
    print "waiting for browser automation server to start and for browser to connect"
    automationServerPath = os.path.join(os.path.dirname(__file__), '../browserautomationserver.py')
    os.system("python " + automationServerPath + "&")
    return True

def killBrowserAutomation():
    os.system("ps -A | grep [b]rowserautomationserver.py | awk '{print $1}' | xargs kill -9")

def restartBrowserAutomation():
    killBrowserAutomation()
    startBrowserAutomation()

global iosDebugProxyProcess
def startIosDebugProxy():
    atexit.register(killIosDebugProxy)
    print "waiting for ios debug proxy to start"
    udid = getIPhoneDeviceID()
    if not udid:
        raise Exception("No iOS devices connected")
    os.system("ios_webkit_debug_proxy -c %s:27753 &" % udid)
    return True

def killIosDebugProxy():
    os.system("ps -A | grep [i]os_webkit_debug_proxy | awk '{print $1}' | xargs kill -9")

def restartIosDebugProxy():
    killIosDebugProxy()
    startIosDebugProxy()

def getIPhoneDeviceID():
    res = commands.getstatusoutput("ideviceinfo | grep UniqueDeviceID")
    if len(res) < 2:
        return False
    res = res[1]
    res = res.split(': ')
    if len(res) < 2:
        return False
    return res[1]



