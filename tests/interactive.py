import unittest
import os
from time import sleep
from settings.settings import *
from common.helper import *
from common.peeriohelper import *
from common.processes import *
import common.platforms

platform = 'browser'
if not common.platforms.launchPlatform(platform):
    print "cannot find the platform %s" % platform
    exit()

connect()
# t = AppleAdvertisement()
# t = LocaleTest()
# t.test_01_locale_start()
# t = SignupBase()
# t.signup()
# t = LoginBase()
# t.login()
