import appium
import selenium
import time
from settings.settings import *

global __appium_driver
global __chromium_driver
global __viewOrigin
global __devicePixelRatio
global __findOperator
global __tapOperator

def set_appium_driver(driver):
    global __appium_driver
    __appium_driver = driver
    return driver

def quit_appium_driver():
    global __appium_driver
    __appium_driver.quit()

def appium_driver():
    global __appium_driver
    return __appium_driver

def set_chromium_driver(driver):
    global __chromium_driver
    __chromium_driver = driver
    return driver

def quit_chromium_driver():
    global __chromium_driver
    __chromium_driver.quit()

def chromium_driver():
    global __chromium_driver
    return __chromium_driver

def quit_driver():
    try:
        quit_appium_driver()
    except:
        print
    try:
        quit_chromium_driver()
    except:
        print


def create_appium_driver(executor, capabilities):
    return set_appium_driver(appium.webdriver.Remote(command_executor=executor,
                            desired_capabilities=capabilities))

def create_chromium_driver(executor, capabilities):
    return set_chromium_driver(selenium.webdriver.Remote(command_executor=executor,
                            desired_capabilities=capabilities))

def test_connect_ios():
    create_appium_driver(executor, ios_92(ios_basic()))
    wait_for_view_origin(appium_driver, '//UIAWebView')
    global __devicePixelRatio
    __devicePixelRatio = 1
    print "View origin: %s, device pixel ratio: %d" % (view_origin(), device_pixel_ratio())
    global __findOperator
    __findOperator = find_by_css_ios
    global __tapOperator
    __tapOperator = tap_by_element_ios

def test_connect_android():
    create_appium_driver(executor, android_600(android_basic()))
    create_chromium_driver(chromium_executor, chromium_basic())
    wait_for_view_origin(appium_driver, '//android.webkit.WebView')
    global __devicePixelRatio
    __devicePixelRatio = chromium_driver().execute_script('return window.devicePixelRatio')
    print "View origin: %s, device pixel ratio: %d" % (view_origin(), device_pixel_ratio())
    global __findOperator
    __findOperator = find_by_css_android
    global __tapOperator
    __tapOperator = tap_by_element_android

def wait_for(timeout, func):
    for i in xrange(timeout):
        try:
            return func()
        except:
            print '.'
            time.sleep(1)
    raise Exception('timeout waiting for: %s' % func)

def wait_for_view_origin(driver, xpath):
    global __viewOrigin
    print 'Waiting for webview'
    viewElement = wait_for(30, lambda: driver().find_element_by_xpath(xpath))
    __viewOrigin = viewElement.location
    print '...success'

def device_pixel_ratio():
    global __devicePixelRatio
    return __devicePixelRatio

def view_origin():
    global __viewOrigin
    return __viewOrigin

def switch_to_webview():
    appium_driver().switch_to.context("WEBVIEW_1")

def switch_to_native():
    appium_driver().switch_to.context("NATIVE_APP")

def find_by_css_android(selector):
    return chromium_driver().find_element_by_css_selector(selector)

def find_by_css_ios(selector):
    switch_to_webview()
    return appium_driver().find_element_by_css_selector(selector)

def find_by_css(selector):
    global __findOperator
    return __findOperator(selector)

def find_by_id(id):
    return find_by_css("[id=%s]" % id)

def wait_find_by_id(id):
    return wait_for(wait_timeout, lambda: find_by_id(id))

def wait_find_by_css(selector):
    return wait_for(wait_timeout, lambda: find_by_css(selector))

def tap_by_element_android(el):
    x = el.location['x'] + el.size['width']/2
    y = el.location['y'] + el.size['height']/2
    x *= device_pixel_ratio()
    y *= device_pixel_ratio()
    vo = view_origin()
    x += vo['x']
    y += vo['y']
    appium_driver().tap([(x, y)])

def tap_by_element_ios(el):
    x = el.location['x'] + el.size['width']/2
    y = el.location['y'] + el.size['height']/2
    switch_to_native()
    vo = view_origin()
    x += vo['x']
    y += vo['y']
    appium_driver().tap([(x, y)])

def tap_by_element(el):
    global __tapOperator
    __tapOperator(el)

def tap_by_css(selector):
    el = find_by_css(selector)
    tap_by_element(el)

def tap_by_id(id):
    el = find_by_id(id)
    tap_by_element(el)

def text_by_element(el, text):
    el.clear()
    el.send_keys(text)

def text_by_css(selector, text):
    el = find_by_css(selector)
    text_by_element(el, text)

def text_by_id(id, text):
    el = find_by_id(id)
    text_by_element(el, text)
