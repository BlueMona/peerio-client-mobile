import common.testcase
from common.helper import *

class TouchID(common.testcase.TestCase):
    def test_01_push(self):
        if driver().wipe:
            driver().wipe()
        hasFeature = execute_script("return Peerio.UI.TouchId.test()")
        if hasFeature == 'unsupported':
            return
        idfa = get_text_by_css('._touchID p')
        assert len(idfa) > 0
