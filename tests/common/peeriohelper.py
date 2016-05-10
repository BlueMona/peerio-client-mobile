from common.helper import *
from settings.settings import test_logins

def removePin():
    tap_by_css('.btn-danger')
    wait_tap_by_css('.modal .btn-safe')

def navigateToSetPin():
    tap_by_id('sidemenu-toggle')
    sleep(2)
    # navigate to set passcode
    tap_by_css('.sidebar-menu li:nth-child(1)')

def navigateToStart():
    try:
        for i in xrange(10):
            tap_by_id('global-back')
            sleep(1)
    except:
        print 'already at start'

def navigateToLogout():
    # make sure we're at the start page
    navigateToStart()
    tap_by_css('.sidebar-menu > :nth-child(3) > li:nth-child(1)')
    assert wait_find_by_id('username')

def tapPin(number):
    if number == 0:
        number = 10
    tap_by_css('.pin-pad > div:nth-child(%d) > div:nth-child(%d)' % (3 + (number-1)/3, 1 + (number-1) % 3))

def enterPin(pinText):
    for i in map(int, pinText):
        tapPin(i)
        sleep(0.1)

def getWebSocketServer():
    return driver().execute_script('return Peerio.Config.webSocketServer')

class LoginBase:
    def login(self):
        if not tap_by_css('.saved-login'):
            print 'skipping saved login'
        pair = test_logins[getWebSocketServer()]
        text_by_id('username', pair['user'])
        text_by_id('password', pair['secret'])

        tap_by_css('.btn-safe')
        assert wait_find_by_id('tabbar') != None

    def changeuser(self):
        sleep(1)
        return tap_by_css('#footer .btn')
        sleep(1)

