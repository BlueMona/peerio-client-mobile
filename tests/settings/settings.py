import unittest
import os
from random import randint
from appium import webdriver
from time import sleep

executor = 'http://127.0.0.1:4723/wd/hub'
ios_dir = '../../platforms/ios/build/emulator'
ios_appname = 'Peerio.app'

def ios_path():
    return os.path.abspath(
        os.path.join(os.path.dirname(__file__),
                     ios_dir,
                     ios_appname))

def ios_basic():
    return {
        'app': ios_path(),
        'launchTimeout': 90000,
        'newCommandTimeout': 12000
    }

def ios_92(config):
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


