import time
import random
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium
import appium

class IosDriver(AbstractDriver):
    def __init__(self, executor, capabilities):
        self.appium = appium.webdriver.Remote(command_executor=executor,
                            desired_capabilities=capabilities)
        self.wait_for_view_origin(self.appium, '//UIAWebView')
        self.switch_to_webview()
        self.devicePixelRatio = self.appium.execute_script('return window.devicePixelRatio')
        print "View origin: %s, device pixel ratio: %d" % (self.viewOrigin, self.devicePixelRatio)

    def __exit__(self):
        self.appium.quit()

    def text(self, selector):
        return selector.text

    def find(self, selector):
        self.switch_to_webview()
        return self.appium.find_element_by_css_selector(selector)

    def tap(self, el):
        x = el.location['x'] + el.size['width']/2
        y = el.location['y'] + el.size['height']/2
        x *= self.devicePixelRatio
        y *= self.devicePixelRatio
        self.switch_to_native()
        vo = self.viewOrigin
        x += vo['x']
        y += vo['y']
        self.appium.tap([(x, y)])
        return el

    def reload(self):
        return None

    def switch_to_webview(self):
        self.appium.switch_to.context("WEBVIEW_1")

    def switch_to_native(self):
        self.appium.switch_to.context("NATIVE_APP")




