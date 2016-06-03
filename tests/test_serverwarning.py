import unittest
import common.testcase
import time
from common.helper import *
import peerio

class ServerWarning(common.testcase.TestCase):
    def test_01_serverwarning(self):
        peerio.login()
        execute_script("Peerio.Net.sendToSocket('testServerWarning')")
        time.sleep(3)
        self.restart()
        peerio.login()
        wait_find_by_css('._serverWarning')
        tap_by_css('._serverWarning .btn-safe')
        time.sleep(5)
        self.restart()
        peerio.login()
        assert wait_not_find_by_css('._serverWarning') == True
