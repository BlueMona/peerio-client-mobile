import appium
import selenium
import time
import random
from settings.settings import *
from websocket import create_connection
from wsdriver import BrowserDriver
from androiddriver import AndroidDriver
from iosdriver import IosDriver
from iosdriver import IosDriverFast

global driver
global __platform

__defaultTimeout = 30
__defaultAnimationTimeout = 5
__animationClasses = ['.animate-enter', '.animate-leave']

def driver():
    return driver

def connect():
    global driver
    if not __platform:
        set_platform(platform_browser())
    driver = __platform['driver']()

def set_platform(platform):
    global __platform
    __platform = platform

def platform_browser():
    return {
        'driver': lambda: BrowserDriver(True)
    }

def platform_ios():
    return {
        'appium': True,
        'chromedriver': False,
        'driver': lambda: IosDriverFast(executor, ios_93(ios_basic()))
    }

def platform_android():
    return {
        'appium': True,
        'chromedriver': True,
        'driver': lambda: AndroidDriver(executor, android_600(android_basic()), chromium_executor, chromium_basic())
    }

def check_animation():
    active = False
    for css in __animationClasses:
        try:
            driver.find(css)
            active = True
            break
        except selenium.common.exceptions.NoSuchElementException:
            continue
        except:
            print "unexpected error"
            raise
    if active:
        raise Exception('animation still performing')

def wait_for(timeout, func, msg = None):
    for i in xrange(timeout):
        try:
            return func()
        except:
            print '.'
            time.sleep(1)
    raise Exception('timeout waiting for: %s, %s' % (func, msg))

def wait_for_animation():
    wait_for(__defaultAnimationTimeout, check_animation)

def find_by_css(selector):
    # make sure animation is finished
    # time.sleep(0.01)
    wait_for_animation()
    # time.sleep(0.01)
    # wait_for_animation()
    return driver.find(selector)

def find_by_id(id):
    return find_by_css("[id=%s]" % id)

def wait_find_by_id(id):
    return wait_for(wait_timeout, lambda: find_by_id(id), "find by id %s" % id)

def wait_find_by_css(selector):
    return wait_for(wait_timeout, lambda: find_by_css(selector), "find by selector %s" % selector)

def tap_by_css(selector):
    el = find_by_css(selector)
    driver.tap(selector)

def wait_tap_by_css(selector):
    el = wait_find_by_css(selector)
    driver.tap(selector)

def tap_by_id(id):
    el = find_by_id(id)
    tap_by_css("[id=%s]" % id)

def text_by_css(selector, text, slow=False):
    driver.text_by_css(selector, text, slow)

def text_by_id(id, text, slow=False):
    el = find_by_id(id)
    text_by_css("[id=%s]" % id, text, slow)

def get_text_by_css(selector):
    return driver.text(find_by_css(selector))
