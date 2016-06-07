import StringIO
import pycurl, json
import unittest
import common.testcase
import time
from common.helper import *
import peerio

class Purchase(common.testcase.TestCase):
    def test_01_order(self):
        peerio.signupSkip()
        peerio.navigateToPurchase()
        purchase = 'com.peerio.storage.50.monthly'
        wait_find_by_id(purchase)
        if driver().platform == 'browser':
            self.browser(purchase)
        if driver().platform == 'ios':
            self.ios(purchase)
        if driver().platform == 'android':
            self.ios(purchase)

    def browser(self, purchase):
        print 'browser mock'
        tap_by_id(purchase)
        wait_find_by_css('.modal')
        # accept alert
        peerio.removeAlerts(True, '._paymentConfirm')
        wait_find_by_css('._viewSubscriptions')
        # wait_find_by_css('._receipt')
        # text = get_text_by_css('._receipt p')
        # assert text == purchase
        # peerio.removeAlerts(True, '._receipt')

    def ios(self, purchase):
        print 'executing ios test tree'
        # remove the sign in to check your downloads thing
        peerio.applestore.cancelSignIn()
        tap_by_id(purchase)
        peerio.applestore.signInSandbox('peeriotest11@etcetera.ws', 'Lamar_10')
        peerio.applestore.acceptSubscription()
        driver().switch_to_webview()
        wait_find_by_css('._viewSubscriptions')
        # wait_find_by_css('._receipt')
        # receipt = get_text_by_css('._receipt p')
        # assert len(receipt) > 0
        # maybe we can do some additional validation here

    def android(self, purchase):
        print 'executing android test tree'
