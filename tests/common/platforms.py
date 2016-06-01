import appium
import selenium
import time
import random
from settings.settings import *
from common.processes import *
from websocket import create_connection
from browserdriver import BrowserDriver
from androiddriver import AndroidDriver
from iosdriver import IosDriver
from iosdriverfast import IosDriverFast

def launchPlatform(platform):
    method = getattr(sys.modules[__name__], 'platform_' + platform)
    if not method:
        return False
    platform_options = method()
    set_platform(platform_options)
    if 'appium' in platform_options and platform_options['appium']:
        restartAppium()
    if 'ios_webkit_debug_proxy' in platform_options and platform_options['ios_webkit_debug_proxy']:
        restartIosDebugProxy()
    if 'browserautomation' in platform_options and platform_options['browserautomation']:
        restartBrowserAutomation()
    if 'chromedriver' in platform_options and platform_options['chromedriver']:
        restartChromedriver()
    return True

__platform = None

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
        'type': 'browser',
        'device': False,
        'driver': lambda extra: BrowserDriver(True)
    }

def platform_ios():
    return {
        'appium': True,
        'type': 'ios',
        'device': False,
        'driver': lambda extra: IosDriverFast(executor, ios_93(ios_basic()), extra)
    }

def platform_iosdevice():
    udid = getIPhoneDeviceID()
    if not udid:
        raise Exception("No iOS devices connected")
    return {
        'type': 'ios',
        'device': True,
        'appium': True,
        'ios_webkit_debug_proxy': True,
        'driver': lambda extra: IosDriverFast(executor, ios_device(udid), extra)
    }

def platform_androiddevice():
    device = getFirstPhysicalAndroidDeviceID()
    return {
        'appium': True,
        'type': 'android',
        'device': True,
        'chromedriver': True,
        'driver': lambda extra: AndroidDriver(executor, android_device(device["name"]), chromium_executor, chromium_basic(), extra)
    }

def platform_android():
    device = getFirstGenyMotionAndroidDeviceID()
    return {
        'platformName': 'GenyMotion',
        'type': 'android',
        'device': True, # genymotion simulators have full capabilities of a device, so adding true here
        'appium': True,
        'chromedriver': True,
        'driver': lambda extra: AndroidDriver(executor, android_600(android_basic(device["name"])), chromium_executor, chromium_basic(), extra)
    }

