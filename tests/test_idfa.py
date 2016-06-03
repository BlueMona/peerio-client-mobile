import common.testcase
from common.helper import *

class AppleAdvertisement(common.testcase.TestCase):
    def test_01_push(self):
        execute_script("Peerio.GoogleConversion.testIDFA()")
        idfa = get_text_by_css('._googleConversion p')
        assert len(idfa) > 0

