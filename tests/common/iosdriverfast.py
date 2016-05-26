import time
import random
from settings.settings import *
from iosdriver import IosDriver

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
