import appium
import selenium
import time
import random
from settings.settings import *
from common.processes import *
from websocket import create_connection
from wsdriver import BrowserDriver
from androiddriver import AndroidDriver
from iosdriver import IosDriver
from iosdriver import IosDriverFast

def launchPlatform(platform):
    method = getattr(sys.modules[__name__], 'platform_' + platform)
    if not method:
        return False
    platform_options = method()
    set_platform(platform_options)
    if 'appium' in platform_options and platform_options['appium']:
        restartAppium()
    if 'browserautomation' in platform_options and platform_options['browserautomation']:
        restartBrowserAutomation()
    if 'chromedriver' in platform_options and platform_options['chromedriver']:
        restartChromedriver()
    if 'ios_webkit_debug_proxy' in platform_options and platform_options['ios_webkit_debug_proxy']:
        restartIosDebugProxy()
    return True

global __platform

def get_platform():
    if not __platform:
        set_platform(platform_browser())
    return __platform

def set_platform(platform):
    global __platform
    __platform = platform

def platform_browser():
    return {
        'browserautomation': True,
        'driver': lambda: BrowserDriver(True)
    }

def platform_ios():
    return {
        'appium': True,
        'driver': lambda: IosDriverFast(executor, ios_93(ios_basic()))
    }

def platform_iosdevice():
    udid = getIPhoneDeviceID()
    if not udid:
        raise Exception("No iOS devices connected")
    return {
        'appium': True,
        'ios_webkit_debug_proxy': True,
        'driver': lambda: IosDriverFast(executor, ios_device(udid))
    }

def platform_androiddevice():
    device = getFirstPhysicalAndroidDeviceID()
    return {
        'appium': True,
        'chromedriver': True,
        'driver': lambda: AndroidDriver(executor, android_device(device["name"]), chromium_executor, chromium_basic())
    }

def platform_android():
    device = getFirstGenyMotionAndroidDeviceID()
    return {
        'platformName': 'GenyMotion',
        'appium': True,
        'chromedriver': True,
        'driver': lambda: AndroidDriver(executor, android_600(android_basic(device["name"])), chromium_executor, chromium_basic())
    }

