from appium import webdriver
from settings.settings import *

global __driver
global __viewOrigin

def set_driver(driver):
    global __driver
    __driver = driver

def quit_driver():
    global __driver
    __driver.quit()

def driver():
    global __driver
    return __driver

def create_webdriver(executor, capabilities):
    set_driver(webdriver.Remote(command_executor=executor,
                            desired_capabilities=capabilities))
def test_connect():
    return create_webdriver(executor, ios_92(ios_basic()))

def view_origin():
    global __viewOrigin
    try:
        __viewOrigin
    except:
        __viewOrigin = driver().find_element_by_xpath("//UIAWebView").location
    return __viewOrigin

def switch_to_webview():
    context_name = "WEBVIEW_1"
    driver().switch_to.context(context_name)

def switch_to_native():
    global driver
    context_name = "NATIVE_APP"
    driver().switch_to.context(context_name)

def find_by_css(selector):
    switch_to_webview()
    return driver().find_element_by_css_selector(selector)

def find_by_id(id):
    return find_by_css("[id=%s]" % id)

def tap_by_element(el):
    x = el.location['x'] + el.size['width']/2
    y = el.location['y'] + el.size['height']/2
    switch_to_native()
    vo = view_origin()
    x += vo['x']
    y += vo['y']
    driver().tap([(x, y)])

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
