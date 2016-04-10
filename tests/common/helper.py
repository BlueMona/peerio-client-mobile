from appium import webdriver
from settings.settings import *

global __driver

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
    tapLocation = (el.location['x'] + el.size['width']/2, el.location['y'] + el.size['height']/2)
    switch_to_native()
    driver().tap([tapLocation])

def tap_by_css(selector):
    el = find_by_css(selector)
    tap_by_element(el)

def tap_by_id(id):
    el = find_by_id(id)
    tap_by_element(el)

def text_by_element(el):
    el.clear()
    el.send_keys(text)

def text_by_css(selector, text):
    el = find_by_css(selector)
    text_by_element(el)

def text_by_id(id, text):
    el = find_by_id(id)
    text_by_element(el)
