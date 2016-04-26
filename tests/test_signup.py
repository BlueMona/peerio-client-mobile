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
    def test_00_init(self):
        connect()

    def test_01_signup(self):
        # signup
        tap_by_css('.btn-primary')

        # terms of use
        tap_by_css('.btn-safe')

        # basic information
        # TODO: handle existing usernames
        # TODO: different usernames (random, etc)
        # TODO: username should work correctly in both slow and fast mode. Now only slow works
        text_by_id('user_name', 't' + strftime("%Y%m%d%H%M%S"), True)
        text_by_id('user_first_name', 'tester')
        text_by_id('user_last_name', 'lastname')
        wait_find_by_css('.btn-safe')
        tap_by_css('.btn-safe')

        # get the passphrase
        # waiting for passphrase to be generated
        sleep(1)
        phrase = get_text_by_css('.txt-lrg')
        tap_by_css('.btn-safe')
        wait_find_by_css('textarea')
        text_by_css('textarea', phrase)
        tap_by_css('.btn-safe')

    def test_02_terms(self):
        print "done"

# if __name__ == '__main__':
    # restartBrowserAutomation()
    # restartAppium()
    # restartChromedriver()
    # suite = unittest.TestLoader().loadTestsFromTestCase(Signup)
    # unittest.TextTestRunner(verbosity=2).run(suite)
