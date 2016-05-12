import unittest
import common.testcase
import time
from common.helper import *
from common.peeriohelper import *
from selenium.common.exceptions import NoSuchElementException

class PushNotification(common.testcase.TestCase, LoginBase):
    def test_01_push(self):
        self.login()
        execute_script("Peerio.NativeAPI.notifications = []")
        res = execute_script("return Peerio.NativeAPI.notifications")
        assert len(res) == 0
        execute_script("Peerio.Net.sendToSocket('testPushNotifications')")
        time.sleep(5)
        res = execute_script("return Peerio.NativeAPI.notifications")
        print res
        assert len(res) == 1
        time.sleep(10)
