import time
import random
import jsonpickle
from settings.settings import *
from websocket import create_connection
import selenium

class AbstractDriver:
    def __init__(self):
        return

    def send_keys(self, selector, text):
        selector.send_keys(text)
        return selector

    def clear(self, selector):
        selector.clear()
        return selector

    def wait_for(self, timeout, func, msg = None):
        for i in xrange(timeout):
            try:
                return func()
            except:
                print '.'
            time.sleep(1)
        raise Exception('timeout waiting for: %s, %s' % (func, msg))

    def wait_for_view_origin(self, driver, xpath):
        print 'Waiting for webview'
        viewElement = self.wait_for(30, lambda: driver.find_element_by_xpath(xpath))
        self.viewOrigin = viewElement.location
        print '...success'




