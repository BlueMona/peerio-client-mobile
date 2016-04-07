import unittest
import os
from random import randint
from appium import webdriver
from time import sleep

class Settings:
    def appPath(self):
        return os.path.abspath(os.path.join(os.path.dirname(__file__),
                '../../platforms/ios/build/emulator',
                'Peerio.app'))

    def executor(self):
        return 'http://127.0.0.1:4723/wd/hub'

    def basic(self):
        return {
            'app': self.appPath(),
            'launchTimeout': 90000,
            'autoWebView': True,
        }

    def ios(self, config):
        config = config.copy();
        config.update({
            'platformName': 'iOS',
            'platform': 'iOS',
            'platformVersion': '9.2',
            'deviceName': 'iPhone 6',
            'autoAcceptAlerts': True, # so that system dialogs are accepted
            'autoLaunch': False,
            'noReset': True
            })
        return config



