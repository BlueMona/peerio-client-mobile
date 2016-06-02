import StringIO
import pycurl, json

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

class Purchase(common.testcase.TestCase, peerio.LoginBase):
    def test_01_order(self):
        # need to reset our ios device here
        self.login()
        peerio.navigateToPurchase()
        purchase = 'com.peerio.storage.50.monthly'
        wait_find_by_id(purchase)
        if driver().platform == 'browser':
            print 'browser mock'
            tap_by_id(purchase)
            wait_find_by_css('.modal')
            peerio.removeAlerts(True)

        if driver().platform == 'ios' and driver().device:
            print 'executing ios test tree'
            # removing the alert offering to login to apple
            time.sleep(2)
            driver().dismiss_alert()
            wait_find_by_id(purchase)
            tap_by_id(purchase)

        if driver().platform == 'android' and driver().device:
            print 'executing android test tree'
