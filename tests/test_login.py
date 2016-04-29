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
from common.peeriohelper import *
from common.processes import *
import common.testcase

class Login(common.testcase.TestCase):
    def test_01_login(self):
        try:
            self.changeuser()
        except NoSuchElementException:
            print 'skipping pin'
        self.login()

    # default test pin for our accounts
    pin = '123123'

    def test_02_setpin(self):
        navigateToSetPin()
        try:
            removePin()
        except NoSuchElementException:
            print 'skipping removing pin'
        assert wait_find_by_id('passcode') != None
        text_by_id('passcode', self.pin)
        wait_find_by_css('.btn-safe')
        tap_by_css('.btn-safe')
        assert wait_find_by_css('.btn-danger') != None

    def test_03_loginPin(self):
        self.restart()
        enterPin(self.pin)
        assert wait_find_by_id('tabbar') != None

    def test_04_loginPinNoPad(self):
        self.restart()
        self.changeuser()
        self.login()
        assert wait_find_by_id('tabbar') != None

    def test_05_removepin(self):
        navigateToStart()
        navigateToSetPin()
        removePin()
        assert find_by_id('passcode') != None

    def test_99_logout(self):
        navigateToLogout()

    def login(self):
        try:
            tap_by_css('.saved-login')
        except NoSuchElementException:
            print 'skipping saved login'
        text_by_id('username', 't20160426200617')
        text_by_id('password', 'require opinions ants heather missile')
        tap_by_css('.btn-safe')
        assert wait_find_by_id('tabbar') != None

    def changeuser(self):
        sleep(1)
        tap_by_css('#footer .btn')
        sleep(1)

