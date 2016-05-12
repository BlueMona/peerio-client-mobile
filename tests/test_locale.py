import unittest
import common.testcase
import time
from common.helper import *
from common.peeriohelper import *
from selenium.common.exceptions import NoSuchElementException

class LocaleTest(common.testcase.TestCase, LoginBase, SignupBase):
    locales = {
        "en": {
            "login": "Login"
        },
        "fr": {
            "login": "Connexion"
        }
    }

    def locale_test(self, l):
        option_by_css("#language-select", l)
        time.sleep(0.5)
        assert get_text_by_css('.btn-safe') == self.locales[l]["login"]

    def test_01_locale_start(self):
        for l in self.locales:
            self.locale_test(l)

