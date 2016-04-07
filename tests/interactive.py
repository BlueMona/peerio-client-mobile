import unittest
import os
from random import randint
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from time import sleep
from settings.settings import Settings

def test_connect():
    s = Settings()
    return webdriver.Remote(command_executor=s.executor(),
                            desired_capabilities=s.ios(s.basic()))

driver = test_connect()
context_name = "WEBVIEW_1"
driver.switch_to.context(context_name)
