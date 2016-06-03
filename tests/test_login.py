from time import sleep
from common.helper import *
import common.testcase
import peerio

class Login(common.testcase.TestCase):
    def test_01_login(self):
        peerio.login()

    # default test pin for our accounts
    pin = '123123'

    def test_02_setpin(self):
        peerio.navigateToSetPin()
        peerio.removePin()
        assert wait_find_by_id('passcode') != None
        text_by_id('passcode', self.pin)
        wait_find_by_css('.btn-safe')
        tap_by_css('.btn-safe')
        assert wait_find_by_css('.btn-danger') != None

    def test_03_loginPin(self):
        self.restart()
        peerio.enterPin(self.pin)
        assert wait_find_by_id('tabbar') != None

    def test_04_loginPinNoPad(self):
        self.restart()
        peerio.login()
        assert wait_find_by_id('tabbar') != None

    def test_05_removepin(self):
        peerio.navigateToStart()
        peerio.navigateToSetPin()
        peerio.removePin()
        assert find_by_id('passcode') != None

    def test_99_logout(self):
        peerio.navigateToLogout()

