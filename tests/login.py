import unittest
import os
from random import randint
from appium import webdriver
from time import sleep
from settings.settings import Settings

class SimpleLogin(unittest.TestCase):

    def setUp(self):
        self.settings = Settings();
        # set up appium
        app = os.path.join(os.path.dirname(__file__),
                '../platforms/ios/build/emulator',
                'Peerio.app')
        app = os.path.abspath(app)
        self.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            desired_capabilities={
                'app': app,
                'platformName': 'iOS',
                'platform': 'iOS',
                'platformVersion': '9.2',
                'deviceName': 'iPhone 6',
                'autoAcceptAlerts': True, # so that system dialogs are accepted
                'launchTimeout': 90000,
                'autoWebView': True,
                'autoLaunch': False,
                'noReset': True
            })

    def tearDown(self):
        self.driver.quit()

    def test_login(self):
        context_name = "WEBVIEW_1"
        self.driver.switch_to.context(context_name)
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
