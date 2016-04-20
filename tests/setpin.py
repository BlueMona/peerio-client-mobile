import unittest
import os
import sys
import pdb
from selenium.common.exceptions import NoSuchElementException
from random import randint
from appium import webdriver
from time import sleep
from settings.settings import *
from common.helper import *
from common.processes import *

class SimpleLogin(unittest.TestCase):
    def test_loginPhrase(self):
        try:
            tap_by_css('.pin-pad > div:nth-child(7) > div:nth-child(1)')
        except NoSuchElementException:
            print 'skipping saved pin'
        try:
            tap_by_css('.saved-login')
        except NoSuchElementException:
            print 'skipping saved login'
        text_by_id('username', 'testlogin')
        text_by_id('password', 'winding skater rio arrives juicy')
        tap_by_css('.btn-safe')
        assert wait_find_by_id('vscroll').is_displayed()
    def test_setPin(self):
        tap_by_id('sidemenu-toggle')
        tap_by_css('.sidebar-menu > :nth-child(1) > li:nth-child(1)') #taps first button in menu
        try:
            tap_by_css('.btn-danger')
            tap_by_css('.btn-safe')
        except NoSuchElementException:
            print 'pin already set?'
        text_by_id('passcode', '122333')
        tap_by_css('.btn-safe')
        assert wait_find_by_css('.btn-danger').is_displayed()

if __name__ == '__main__':
    restartAppium()
    restartChromedriver()
    test_connect_ios()
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleLogin)
    unittest.TextTestRunner(verbosity=2).run(suite)
    quit_driver()
