import appium
import selenium
import time
import random
from settings.settings import *
from websocket import create_connection
from wsdriver import BrowserDriver
from androiddriver import AndroidDriver
from iosdriver import IosDriver

global driver

__defaultTimeout = 30
__defaultAnimationTimeout = 5
__animationClasses = ['.animate-enter', '.animate-leave']

def driver():
    return driver

def test_connect_ios():
    global driver
    driver = IosDriver(executor, ios_93(ios_basic()))

def test_connect_android():
    global driver
    driver = AndroidDriver(executor, android_600(android_basic()), chromium_executor, chromium_basic())

def test_connect_browser():
    global driver
    driver = BrowserDriver()
    driver.reload()

def test_connect():
    test_connect_ios()
    # test_connect_android()
    # test_connect_browser()

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

def tap_by_element(el):
    driver.tap(el)

def tap_by_css(selector):
    el = find_by_css(selector)
    tap_by_element(el)

def tap_by_id(id):
    el = find_by_id(id)
    tap_by_element(el)

def text_by_element(el, text, slow=False):
    driver.clear(el)
    if(slow):
        for c in text:
            driver.send_keys(el, c)
            time.sleep(random.randrange(1, 10) / 20.0)
    else:
        driver.send_keys(el, text)

def text_by_css(selector, text, slow=False):
    el = find_by_css(selector)
    text_by_element(el, text, slow)

def text_by_id(id, text, slow=False):
    el = find_by_id(id)
    text_by_element(el, text, slow)

def get_text_by_css(selector):
    return driver.text(find_by_css(selector))
