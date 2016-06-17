import time
import random
import jsonpickle
from settings.settings import *
from websocket import create_connection
import websocket
from abstractdriver import AbstractDriver
import selenium
import os
import sys

class BrowserDriver(AbstractDriver):
    def __init__(self, reload=False):
        print "opening connection to automation server"
        self.wait_for(5, self.connect, "automation server")
        if reload:
            self.reload()

    def sendsocket(self, message):
        if not self.ws.connected:
            self.connect_socket()
        self.ws.send(message)

    def connect_socket(self):
        self.ws = create_connection("ws://localhost:8888/automation", timeout=1)

    def connect(self):
        self.connect_socket()

    def communicate(self, data):
        self.ping()
        self.sendsocket(data)
        return self.ws.recv()

    def ping(self):
        while True:
            try:
                self.sendsocket(jsonpickle.encode({"action": "ping"}))
                return self.ws.recv()
            except websocket._exceptions.WebSocketTimeoutException:
                self.connect_socket()
            except:
                print "error reconnecting"
                return None

    def text(self, selector):
        self.sendsocket(jsonpickle.encode({"action": "text", "selector": selector}))
        return self.ws.recv()

    def find(self, selector):
        r = self.communicate(jsonpickle.encode({"action": "find", "selector": selector}))
        if r != "success":
            return None
            # raise selenium.common.exceptions.NoSuchElementException
        return selector

    def tap(self, selector):
        r = self.communicate(jsonpickle.encode({"action": "tap", "selector": selector}))
        if r != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def send_keys(self, selector, text):
        r = self.communicate(jsonpickle.encode({"action": "send_keys", "selector": selector, "value": text}))
        if r != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def reload(self):
        self.ping()
        self.ws.settimeout(60)
        self.sendsocket(jsonpickle.encode({"action": "reload"}))
        val = self.ws.recv()
        print "received %s" % val
        if val != "loaded":
            raise selenium.common.exceptions.NoSuchElementException
        self.ws.settimeout(1)

    def clear(self, selector):
        r = self.communicate(jsonpickle.encode({"action": "clear", "selector": selector}))
        if r != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    # slowly entering things makes no sense in browser, so we override it
    def text_by_css(self, selector, text, slow=False):
        self.clear(selector)
        self.send_keys(selector, text)

    def option_by_css(self, selector, value):
        r = self.communicate(jsonpickle.encode({"action": "option", "value": value, "selector": selector}))
        if r != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def value_by_css(self, selector):
        return self.communicate(jsonpickle.encode({"action": "value", "selector": selector}))

    def execute_script(self, script):
        return self.communicate(jsonpickle.encode({"action": "execute_script", "script": script}))

    def wipe(self):
        clearChromeDBPath = os.path.join(os.path.dirname(__file__), '../../tools/clean_chrome_db.sh')
        os.system("sh " + clearChromeDBPath + "&")
        self.reload()

    def accept_alert(self):
        print "no system alerts in browser"

