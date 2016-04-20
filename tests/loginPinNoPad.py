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
    def test_loginPinNoPad(self):
        tap_by_css('.pin-pad > div:nth-child(7) > div:nth-child(1)')
        text_by_id('username', 'testlogin')
        text_by_id('password', '122333')
        tap_by_css('.btn-safe')
        assert wait_find_by_id('vscroll').is_displayed()

if __name__ == '__main__':
    restartAppium()
    restartChromedriver()
    test_connect_ios()
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleLogin)
    unittest.TextTestRunner(verbosity=2).run(suite)
    quit_driver()
