from common.helper import *
from settings.settings import test_logins
from time import strftime

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

class SignupBase:
    username = None
    phrase = None
    def signup(self):
        # signup
        tap_by_css('.btn-primary')

        # terms of use
        tap_by_css('.btn-safe')

        # basic information
        # TODO: handle existing usernames
        # TODO: different usernames (random, etc)
        # TODO: username should work correctly in both slow and fast mode. Now only slow works
        self.username = 't' + strftime("%Y%m%d%H%M%S")
        text_by_id('user_name', self.username, True)
        text_by_id('user_first_name', 'tester')
        text_by_id('user_last_name', 'lastname')
        wait_find_by_css('.btn-safe')
        tap_by_css('.btn-safe')

        # get the passphrase
        # waiting for passphrase to be generated
        sleep(1)
        self.phrase = get_text_by_css('.txt-lrg')
        tap_by_css('.btn-safe')
        wait_find_by_css('textarea')
        text_by_css('textarea', self.phrase)
        tap_by_css('.btn-safe')

