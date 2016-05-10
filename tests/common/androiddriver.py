import time
import random
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium
import appium
from selenium.common.exceptions import NoSuchElementException

class AndroidDriver(AbstractDriver):
    def __init__(self, executor, capabilities, chromium_executor, chromium_capabilities):
        self.executor = executor
        self.capabilities = capabilities
        self.chromium_executor = chromium_executor
        self.chromium_capabilities = chromium_capabilities
        self.appium = None
        self.chromium = None
        self.connect()

    def __exit__(self):
        self.disconnect()

    def disconnect(self):
        if self.appium:
            self.appium.quit()
        if self.chromium:
            self.chromium.quit()

    def connect(self):
        self.disconnect()
        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=self.capabilities)
        self.chromium = selenium.webdriver.Remote(command_executor=self.chromium_executor,
                            desired_capabilities=self.chromium_capabilities)
        self.wait_for_view_origin(self.appium, '//android.webkit.WebView')
        self.devicePixelRatio = self.chromium.execute_script('return window.devicePixelRatio')
        print "View origin: %s, device pixel ratio: %d" % (self.viewOrigin, self.devicePixelRatio)

    def text(self, selector):
        return selector.text

    def find(self, selector):
        try:
            return self.chromium.find_element_by_css_selector(selector)
        except NoSuchElementException:
            return None

    def tap(self, selector):
        el = self.find(selector)
        x = el.location['x'] + el.size['width']/2
        y = el.location['y'] + el.size['height']/2
        x *= self.devicePixelRatio
        y *= self.devicePixelRatio
        vo = self.viewOrigin
        x += vo['x']
        y += vo['y']
        self.appium.tap([(x, y)])
        return el

    def reload(self):
        return None



