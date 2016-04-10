import unittest
import os
import sys
import pdb
from selenium.common.exceptions import NoSuchElementException
from random import randint
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from time import sleep
from settings.settings import *
from common.helper import *

class SimpleLogin(unittest.TestCase):
    def setUp(self):
        self.driver = create_webdriver(ios_92(ios_basic()))
        s = Settings();
        self.driver = webdriver.Remote(
            command_executor=s.executor(),
            desired_capabilities=s.ios(s.basic()))

    def tearDown(self):
        self.driver.quit()

    def test_login(self):
        context_name = "WEBVIEW_1"
        self.driver.switch_to.context(context_name)
        touchaction = TouchAction(self.driver)
        try:
            savedLogin = self.driver.find_element_by_css_selector('.saved-login')
            print 'tapping saved login'
            pdb.set_trace()
            touchaction.tap(savedLogin).perform()
        except NoSuchElementException:
            print 'skipping saved login'
        except:
            print "Unexpected error:", sys.exc_info()[0]
        username = self.driver.find_element_by_css_selector('[id=username]')
        password = self.driver.find_element_by_css_selector('[id=password]')
        username.clear()
        password.clear()
        username.send_keys('testlogin')
        password.send_keys('winding skater rio arrives juicy')
        self.driver.find_element_by_css_selector('.loginForm').submit()
        sleep(5)
        assert self.driver.find_element_by_css_selector('[id=vscroll]').is_displayed()


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleLogin)
    unittest.TextTestRunner(verbosity=2).run(suite)
