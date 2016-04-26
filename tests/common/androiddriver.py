import time
import random
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium
import appium

class AndroidDriver(AbstractDriver):
    def __init__(self, executor, capabilities, chromium_executor, chromium_capabilities):
        self.appium = appium.webdriver.Remote(command_executor=executor,
                            desired_capabilities=capabilities)
        self.chromium = selenium.webdriver.Remote(command_executor=chromium_executor,
                            desired_capabilities=chromium_capabilities)
        self.wait_for_view_origin(self.appium, '//android.webkit.WebView')
        self.devicePixelRatio = self.chromium.execute_script('return window.devicePixelRatio')
        print "View origin: %s, device pixel ratio: %d" % (self.viewOrigin, self.devicePixelRatio)

    def __exit__(self):
        self.appium.quit()
        self.chromium.quit()

    def text(self, selector):
        return selector.text

    def find(self, selector):
        return self.chromium.find_element_by_css_selector(selector)

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



