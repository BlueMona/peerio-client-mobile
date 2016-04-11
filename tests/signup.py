import unittest
import os
import sys
import pdb
from selenium.common.exceptions import NoSuchElementException
from random import randint
from appium import webdriver
from time import sleep
from time import strftime
from settings.settings import *
from common.helper import *
from common.processes import *

class Signup(unittest.TestCase):
    def test_signup(self):
        # signup
        tap_by_css('.btn-primary')

        # terms of use
        sleep(2)
        tap_by_css('.btn-safe')
        sleep(2)

        # basic information
        text_by_id('user_name', 'test' + strftime("%Y%m%d%H%M%S"))
        text_by_id('user_first_name', 'tester')
        text_by_id('user_last_name', 'lastname')
        wait_find_by_css('.btn-safe')
        sleep(2)
        tap_by_css('.btn-safe')

        # get the passphrase
        sleep(2)
        phrase = wait_find_by_css('.txt-lrg').text
        sleep(2)
        tap_by_css('.btn-safe')
        sleep(2)
        wait_find_by_css('textarea')
        text_by_css('textarea', phrase)
        sleep(2)
        tap_by_css('.btn-safe')
        sleep(10)

if __name__ == '__main__':
    restartAppium()
    restartChromedriver()
    test_connect_android()
    suite = unittest.TestLoader().loadTestsFromTestCase(Signup)
    unittest.TextTestRunner(verbosity=2).run(suite)
    quit_driver()
