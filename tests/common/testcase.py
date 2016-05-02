import unittest
from common.helper import *

class TestCase(unittest.TestCase):
    # connecting to our device (or browser) before each testcase
    def test_00_init(self):
        connect()

    def restart(self):
        driver().reload()

