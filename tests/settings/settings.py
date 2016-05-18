import sys
import unittest
import os
from random import randint
from appium import webdriver
from time import sleep

executor = 'http://127.0.0.1:4723/wd/hub'
ios_dir = '../../platforms/ios/build/emulator'
ios_appname = 'Peerio.app'
ios_bundle = 'com.peerio'

chromium_executor = 'http://127.0.0.1:9515'
android_dir = '../../platforms/android/build/outputs/apk'
android_appname = 'android-x86-debug.apk'
android_package = 'com.peerio'
android_activity = 'MainActivity'

test_logins = {
    'wss://app.peerio.com': {
        'user': 't20160511003719',
        'secret': 'fished richter retarded buyer council'
    },
    'wss://hocuspocus.peerio.com': {
        'user': 't20160426200617',
        'secret': 'require opinions ants heather missile'
    }
}

wait_timeout = 15

def ios_path():
    return os.path.abspath(
        os.path.join(os.path.dirname(__file__),
                     ios_dir,
                     ios_appname))

def android_path():
    return os.path.abspath(
        os.path.join(os.path.dirname(__file__),
                     android_dir,
                     android_appname))

def ios_basic():
    return {
        'platformName': 'iOS',
        'app': ios_path(),
        'launchTimeout': 90000,
        'autoAcceptAlerts': True, # so that system dialogs are accepted
        'autoLaunch': False,
        'noReset': True,
        'newCommandTimeout': 12000
    }

def ios_92(config):
    config = config.copy()
    config.update({
        'platform': 'iOS',
        'platformVersion': '9.2',
        'deviceName': 'iPhone 6 Plus',
    })
    return config

def ios_93(config):
    config = ios_92(config.copy())
    config.update({
        'platformVersion': '9.3'
    })
    return config

def ios_device(udid):
    config = ios_basic()
    config.update({
        'deviceName': 'iPhone',
        'udid': udid,
        'app': ios_bundle
    })
    return config

def android_device(deviceName):
    config = android_basic(deviceName)
    config.update({
        'app': android_package
    })
    return config

def android_basic(deviceName):
    return {
        'appPackage': android_package,
        'appActivity': '.' + android_activity,
        'platformName': 'Android',
        'device': 'Android',
        'deviceName': deviceName,
        'udid': deviceName,
        'newCommandTimeout': 12000,
        'noReset': True,
        'androidDeviceSocket': android_package + '_devtools_remote',
        'autoLaunch': False,
    }

def android_600(config):
    config = config.copy();
    config.update({
        'platformVersion': '6.0.0'
    })
    return config

def chromium_basic():
    return {
        'androidDeviceSocket': android_package + '_devtools_remote',
        'chromeOptions': {
            'androidPackage': android_package,
            'androidActivity': '.' + android_activity,
            'androidDeviceSocket': android_package + '_devtools_remote'
        }
    }

