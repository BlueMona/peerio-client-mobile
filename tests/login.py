import unittest
import os
from random import randint
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from time import sleep
from settings.settings import Settings

class SimpleLogin(unittest.TestCase):

    def setUp(self):
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
        savedLogin = self.driver.find_element_by_css_selector('.saved-login')
        if(savedLogin):
            print 'tapping saved login'
            touchaction.tap(savedLogin)
            sleep(30)
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
