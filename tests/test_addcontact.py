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
import common.testcase
import logging
logging.basicConfig(filename='testrun.log',level=logging.INFO)

class Signup(common.testcase.TestCase):
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
        tap_by_css('.btn-primary')
        logging.info(username)
        logging.info(phrase)

    def test_02_terms(self):
        print "account created"
        
    def test_03_sendrequest(self):
        tap_by_css('.tab:nth-of-type(3)')
        tap_by_css('.btn-global-action')
        text_by_id('search', 'testadd2')
        tap_by_css('.btn-safe')
        tap_by_css('.checkbox-input')
        tap_by_css('.btn-global-action')
        
        
