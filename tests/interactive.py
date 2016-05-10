import unittest
import os
from random import randint
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from time import sleep
from settings.settings import *
from common.helper import *
from common.processes import *
import common.helper

platform = 'iosdevice'
method = getattr(common.helper, 'platform_' + platform)
if not method:
    exit()

platform_options = method()
set_platform(platform_options)

if 'appium' in platform_options and platform_options['appium']:
    restartAppium()

if 'browserautomation' in platform_options and platform_options['browserautomation']:
    restartBrowserAutomation()

if 'chromedriver' in platform_options and platform_options['chromedriver']:
    restartChromedriver()

connect()
