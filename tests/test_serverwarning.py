import unittest
import common.testcase
import time
from common.helper import *
from common.peeriohelper import *
from selenium.common.exceptions import NoSuchElementException

class ServerWarning(common.testcase.TestCase, LoginBase):
    def test_01_serverwarning(self):
        self.login()
        execute_script("Peerio.Net.sendToSocket('testServerWarning')")
        time.sleep(3)
        self.restart()
        self.login()
        wait_find_by_css('._serverWarning')
        tap_by_css('._serverWarning .btn-safe')
        time.sleep(5)
        self.restart()
        self.login()
        assert wait_not_find_by_css('._serverWarning') == True
