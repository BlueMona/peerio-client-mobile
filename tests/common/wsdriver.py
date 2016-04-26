import time
import random
import jsonpickle
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium

class BrowserDriver(AbstractDriver):
    def __init__(self):
        print "opening connection to automation server"
        self.wait_for(5, self.connect, "automation server")

    def sendsocket(self, message):
        if not self.ws.connected:
            self.connect_socket()
        self.ws.send(message)

    def connect_socket(self):
        self.ws = create_connection("ws://localhost:8888/automation")
        time.sleep(2)

    def connect(self):
        self.connect_socket()

    def text(self, selector):
        self.sendsocket(jsonpickle.encode({"action": "text", "selector": selector}))
        return self.ws.recv()

    def find(self, selector):
        self.sendsocket(jsonpickle.encode({"action": "find", "selector": selector}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def tap(self, selector):
        self.sendsocket(jsonpickle.encode({"action": "tap", "selector": selector}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def send_keys(self, selector, text):
        self.sendsocket(jsonpickle.encode({"action": "send_keys", "selector": selector, "value": text}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def reload(self):
        self.sendsocket(jsonpickle.encode({"action": "reload"}))
        val = self.ws.recv()
        print "received %s" % val
        if val != "loaded":
            raise selenium.common.exceptions.NoSuchElementException
        time.sleep(2)

    def clear(self, selector):
        self.sendsocket(jsonpickle.encode({"action": "clear", "selector": selector}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    # slowly entering things makes no sense in browser, so we override it
    def text_by_css(self, selector, text, slow=False):
        self.clear(selector)
        self.send_keys(selector, text)


