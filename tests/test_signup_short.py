import unittest
import os
import sys
import pdb
from selenium.common.exceptions import NoSuchElementException
from random import randint
from time import sleep
from time import strftime
from settings.settings import *
from common.helper import *
from mailinator_curl import get_code_for
import common.testcase
import logging
import pycurl
logging.basicConfig(filename='testrun.log',level=logging.INFO)

class SignupShort(common.testcase.TestCase):
    def test_01_signup(self):
        # signup
        tap_by_css('.btn-primary')

        # terms of use
        tap_by_css('.btn-safe')

        # basic information
        # TODO: handle existing usernames
        # TODO: different usernames (random, etc)
        # TODO: username should work correctly in both slow and fast mode. Now only slow works
        username = 't' + strftime("%Y%m%d%H%M%S")
        text_by_id('user_name', username, True)
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

        logging.info(username)
        logging.info(phrase)
        sleep(1000)

