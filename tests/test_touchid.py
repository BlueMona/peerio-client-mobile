import common.testcase
import time
from common.helper import *

class TouchID(common.testcase.TestCase):
    def test_01_push(self):
        if driver().wipe:
            driver().wipe()
        if driver().enable_touchid:
            driver().enable_touchid()
            time.sleep(5)
        hasFeature = execute_script("return Peerio.UI.TouchId.test()")
        if hasFeature == 'unsupported':
            return
        res = get_text_by_css('._touchID p')
        assert len(res) > 0
        if driver().enable_touchid:
            assert res.find('true') != -1
