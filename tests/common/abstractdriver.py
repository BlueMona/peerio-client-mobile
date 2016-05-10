import time
import random
import jsonpickle
from settings.settings import *
from websocket import create_connection
import selenium
import random

class AbstractDriver:
    def __init__(self):
        return

    def send_keys(self, selector, text):
        self.find(selector).send_keys(text)
        return selector

    def clear(self, selector):
        el = self.find(selector)
        if not el:
            raise Exception('no such element: %s' % selector)
        el.clear()
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

    def connect(self):
        print "stub"

    def reload(self):
        self.connect();

    def text_by_css(self, selector, text, slow=False):
        el = self.find(selector)
        if not el:
            raise Exception('no such element: %s' % selector)
        self.clear(selector)
        if(slow):
            for c in text:
                self.send_keys(selector, c)
                time.sleep(random.randrange(1, 10) / 20.0)
        else:
            self.send_keys(selector, text)

