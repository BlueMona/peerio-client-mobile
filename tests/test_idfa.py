import unittest
import common.testcase
import time
from common.helper import *
from common.peeriohelper import *
from selenium.common.exceptions import NoSuchElementException

class AppleAdvertisement(common.testcase.TestCase, LoginBase):
    def test_01_push(self):
        execute_script("Peerio.GoogleConversion.testIDFA()")
        idfa = get_text_by_css('._googleConversion p')
        assert len(idfa) > 0

