import StringIO
import pycurl, json
import unittest
import common.testcase
import time
from common.helper import *
import peerio

def postreceipt(receipt64):
    url = "https://sandbox.itunes.apple.com/verifyReceipt"
    data = json.dumps({"receipt-data": receipt64, "password": "***REMOVED***"})
    print data
    buffer = StringIO.StringIO()
    c = pycurl.Curl()
    c.setopt(c.URL, url)
    c.setopt(c.WRITEDATA, buffer)
    c.setopt(pycurl.POST, 1)
    c.setopt(pycurl.POSTFIELDS, data)
    c.perform()
    c.close()
    return buffer.getvalue()

def receipt():
    receipt = ""
    url = "https://sandbox.itunes.apple.com/verifyReceipt"
    print postreceipt(url, receipt)

class Purchase(common.testcase.TestCase):
    def test_01_order(self):
        peerio.login()
        peerio.navigateToPurchase()
        purchase = 'com.peerio.storage.50.monthly'
        wait_find_by_id(purchase)
        tap_by_id(purchase)
        if driver().platform == 'browser':
            print 'browser mock'
            wait_find_by_css('.modal')
            # accept alert
            peerio.removeAlerts(True, '._paymentConfirm')
            wait_find_by_css('._receipt')
            text = get_text_by_css('._receipt p')
            assert text == purchase
            peerio.removeAlerts(True, '._receipt')

        if driver().platform == 'ios':
            print 'executing ios test tree'
