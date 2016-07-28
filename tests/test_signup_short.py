import unittest
import os
import sys
import pdb
from random import randint
from time import sleep
from time import strftime
from settings.settings import *
from common.helper import *
from mailinator_curl import get_code_for
import common.testcase
import pycurl
import peerio

class SignupShort(common.testcase.TestCase):
    def test_001_signup(self):
        r = peerio.signup()

