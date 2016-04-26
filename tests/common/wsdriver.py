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

    def connect(self):
        self.ws = create_connection("ws://localhost:8888/automation")
    def text(self, selector):
        self.ws.send(jsonpickle.encode({"action": "text", "selector": selector}))
        return self.ws.recv()

    def find(self, selector):
        self.ws.send(jsonpickle.encode({"action": "find", "selector": selector}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def tap(self, selector):
        self.ws.send(jsonpickle.encode({"action": "tap", "selector": selector}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def send_keys(self, selector, text):
        self.ws.send(jsonpickle.encode({"action": "send_keys", "selector": selector, "value": text}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector

    def reload(self):
        self.ws.send(jsonpickle.encode({"action": "reload"}))
        val = self.ws.recv()
        print "received %s" % val
        if val != "loaded":
            raise selenium.common.exceptions.NoSuchElementException

    def clear(self, selector):
        self.ws.send(jsonpickle.encode({"action": "clear", "selector": selector}))
        if self.ws.recv() != "success":
            raise selenium.common.exceptions.NoSuchElementException
        return selector


