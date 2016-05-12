import unittest
import common.testcase
import time
from common.helper import *
from common.peeriohelper import *
from selenium.common.exceptions import NoSuchElementException

class LocaleTest(common.testcase.TestCase, LoginBase, SignupBase):
    locales = {
        "en": {
            "login": "Login",
            "signup": ""
        },
        "fr": {
            "login": "Connexion",
            "signup": "Commencer"
        }
    }

    def locale_test(self, l):
        option_by_css("#language-select", l)
        time.sleep(0.5)
        assert get_text_by_css('.btn-safe') == self.locales[l]["login"]

    def test_01_locale_start(self):
        for l in self.locales:
            self.locale_test(l)
        self.locale_test("en")

    def test_02_locale_after_signup(self):
        self.restart()
        self.locale_test("fr")
        self.signup()
        wait_find_by_css('._setupWizard')
        assert get_text_by_css('.btn-safe') == self.locales["fr"]["signup"]

