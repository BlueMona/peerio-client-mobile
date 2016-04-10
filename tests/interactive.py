import unittest
import os
from random import randint
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from time import sleep
from settings.settings import *
from common.helper import *
from common.processes import *

restartAppium()
test_connect()
switch_to_webview()
tap_by_css('.btn-safe')
# tap_by_css('.saved-login')
# driver = test_connect()
# context_name = "WEBVIEW_1"
# driver.switch_to.context(context_name)
# savedLogin = driver.find_element_by_css_selector('.saved-login')


