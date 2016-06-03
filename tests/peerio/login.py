from common.helper import *
from settings.settings import test_logins

def getWebSocketServer():
    return driver().execute_script('return Peerio.Config.webSocketServer')

def login():
    if not changeuser():
        print 'skipping pin'
    if not tap_by_css('.saved-login'):
        print 'skipping saved login'
    pair = test_logins[getWebSocketServer()]
    text_by_id('username', pair['user'])
    text_by_id('password', pair['secret'])

    tap_by_css('.btn-safe')
    assert wait_find_by_id('tabbar') != None
    driver().accept_alert()

def changeuser():
    sleep(1)
    return tap_by_css('#footer .btn')

