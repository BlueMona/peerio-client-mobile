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

class Signup(common.testcase.TestCase, SignupBase):
    def test_01_signup(self):
        self.signup()
        logging.info(self.username)
        logging.info(self.phrase)

    def test_02_usability_research(self):
        wait_find_by_css('.headline')
        tap_by_css('.btn-safe')

    def test_03_setup_wizard_getting_started(self):
        tap_by_css('.btn-safe')

    def test_04_setup_wizard_passcode(self):
        text_by_id('passcode', '123123', True)
        tap_by_css('.btn-safe')
        time.sleep(2)

    def test_05_add_address(self):
        addr = 't' + strftime("%Y%m%d%H%M%S") + '@gmail.com'
        text_by_id('address', addr)
        tap_by_css('.btn-primary')
        code = None
        for i in xrange(60):
            print "trying to get code from email"
            code = get_code_for(addr)
            print code
            if code:
                break
        assert code is not None
        text_by_css('[type=numeric]', code)
        time.sleep(3)
        wait_find_by_css('.modal .btn-safe')
        tap_by_css('.modal .btn-safe')
        time.sleep(3)
        # closing 'address authorized'
        tap_by_css('.modal .btn-safe')
        # TODO: add email check with mailinator
        # tap_by_css('.btn')

    def test_06_redeem_coupon(self):
        # TODO: add coupon check
        # finish
        tap_by_css('.btn')

