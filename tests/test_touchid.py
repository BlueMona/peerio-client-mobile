import unittest
import common.testcase
import time
from common.helper import *
from common.peeriohelper import *
from selenium.common.exceptions import NoSuchElementException

class TouchID(common.testcase.TestCase, LoginBase):
    def test_01_push(self):
        hasFeature = execute_script("return Peerio.UI.TouchId.test()")
        if not hasFeature:
            return
        idfa = get_text_by_css('._touchID p')
        assert len(idfa) > 0
