import appium
import selenium
import time
import random
import common.platforms
import sys
from settings.settings import *
from websocket import create_connection
from browserdriver import BrowserDriver

global driver

__defaultTimeout = 30
__defaultAnimationTimeout = 5
__animationClasses = ['.animate-enter']

def driver():
    return driver

def connect(extra = {}):
    global driver
    driver = common.platforms.get_platform()['driver'](extra)
    driver.device = common.platforms.get_platform()['device']
    driver.platform = common.platforms.get_platform()['type']
    driver.connect()

def create_driver(extra = {}):
    global driver
    driver = common.platforms.get_platform()['driver'](extra)

def check_animation():
    for css in __animationClasses:
        if driver.find(css) != None:
            return False
        time.sleep(0.1)
        print '-'
    print '*'
    return True

def wait_for(timeout, func, msg = None):
    for i in xrange(timeout):
        try:
            time.sleep(0.1)
            r = func()
            if r:
                # print 'returning %s' % r
                return r
            else:
                print '.'
                time.sleep(1)
        except Exception as e:
            print e
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
    return find_by_css("[id='%s']" % id)

def wait_find_by_id(id):
    return wait_for(wait_timeout, lambda: find_by_id(id), "find by id %s" % id)

def wait_find_by_css(selector):
    return wait_for(wait_timeout, lambda: find_by_css(selector), "find by selector %s" % selector)

def wait_not_find_by_css(selector):
    return wait_for(wait_timeout, lambda: not find_by_css(selector), "find by selector %s" % selector)

def tap_by_css(selector):
    el = find_by_css(selector)
    if not el:
        return False
    driver.tap(selector)
    return True

def wait_tap_by_css(selector):
    el = wait_find_by_css(selector)
    driver.tap(selector)
    return el != None

def tap_by_id(id):
    el = find_by_id(id)
    return tap_by_css('[id="%s"]' % id)

def text_by_css(selector, text, slow=False):
    driver.text_by_css(selector, text, slow)

def text_by_id(id, text, slow=False):
    el = find_by_id(id)
    text_by_css("[id=%s]" % id, text, slow)

def get_text_by_css(selector):
    return driver.text(find_by_css(selector))

def execute_script(script):
    return driver.execute_script(script)

def option_by_css(selector, value):
    return driver.option_by_css(selector, value)

def value_by_css(selector):
    return driver.value_by_css(selector)

def find_by_xpath(selector):
    return driver.find_by_xpath(selector)

def swipe_find_by_xpath(selector):
    for i in xrange(10):
        if(find_by_xpath(selector)):
            return True
        driver.appium.swipe(0, 0, 0, 500, 1000)
    return False

def wait_find_by_xpath(selector):
    return wait_for(wait_timeout, lambda: find_by_xpath(selector), "find by xpath %s" % selector)

def click_by_xpath(selector):
    return driver.click_by_xpath(selector)
def wait_click_by_xpath(selector):
    wait_find_by_xpath(selector)
    return driver.click_by_xpath(selector)

def text_by_xpath(selector, value):
    return driver.text_by_xpath(selector, value)
