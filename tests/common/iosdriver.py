import time
import random
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium
import appium
from selenium.common.exceptions import NoSuchElementException

class IosDriver(AbstractDriver):
    def __init__(self, executor, capabilities):
        self.appium = None
        self.executor = executor
        self.capabilities = capabilities
        self.connect()

    def __exit__(self):
        self.disconnect()

    def disconnect(self):
        if self.appium:
            self.appium.quit()

    def connect(self):
        self.disconnect()
        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=self.capabilities)
        self.wait_for_view_origin(self.appium, '//UIAWebView')
        self.switch_to_webview()
        self.devicePixelRatio = self.appium.execute_script('return window.devicePixelRatio')
        print "View origin: %s, device pixel ratio: %d" % (self.viewOrigin, self.devicePixelRatio)


    def text(self, selector):
        return selector.text

    def find(self, selector):
        self.switch_to_webview()
        try:
            return self.appium.find_element_by_css_selector(selector)
        except NoSuchElementException:
            return None

    def tap(self, selector):
        self.switch_to_webview()
        selector = selector.replace('"', '\\"')
        script = 'el = document.querySelector("%s").getBoundingClientRect(); '
        script += 'return { y: Math.round(el.top + el.height/2 + window.pageYOffset),'
        script += 'x: Math.round(el.left + el.width/2 + window.pageXOffset) }'
        loc = self.js(script % selector)
        x = loc[u'x']
        y = loc[u'y']
        self.switch_to_native()
        vo = self.viewOrigin
        x += vo['x']
        y += vo['y']
        self.appium.tap([(x, y)])
        return selector

    def switch_to_webview(self):
        self.appium.switch_to.context(next(x for x in self.appium.contexts if x.startswith("WEBVIEW_")))

    def switch_to_native(self):
        self.appium.switch_to.context("NATIVE_APP")

    def js(self, script):
        self.switch_to_webview()
        return self.appium.execute_script(script)

class IosDriverFast(IosDriver):
    def tap(self, selector):
        self.switch_to_webview()
        selector = selector.replace('"', '\\"')
        script = 'el = document.querySelector("%s"); '
        script += 'el.dispatchEvent(new CustomEvent("simulatetap"));'
        script += 'return el;'
        el = self.js(script % selector)
        return el

    def send_keys(self, selector, text):
        self.switch_to_webview()
        selector = selector.replace('"', '\\"')
        text = text.replace('"', '\\"')
        script = 'el = document.querySelector("%s"); '
        script += 'el.value += "%s"; '
        script += 'el.dispatchEvent(new Event("input", { bubbles: true }));'
        script += 'return el;'
        el = self.js(script % (selector, text))
        return el

    # slowly entering things makes no sense in browser, so we override it
    def text_by_css(self, selector, text, slow=False):
        self.clear(selector)
        self.send_keys(selector, text)
