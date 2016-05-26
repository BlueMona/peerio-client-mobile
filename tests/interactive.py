import unittest
import os
from time import sleep
from settings.settings import *
from common.helper import *
from common.peeriohelper import *
from common.processes import *
import common.platforms

def start_platform(platform, extra):
    if not common.platforms.launchPlatform(platform):
        print "cannot find the platform %s" % platform
        exit()
    connect(extra)

starter = lambda extra: start_platform('iosdevice', extra)
starter({})
# t = AppleAdvertisement()
# t = LocaleTest()
# t.test_01_locale_start()
# t = SignupBase()
# t.signup()
# t = LoginBase()
# t.login()
