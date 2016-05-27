from common.helper import *
import common.peeriohelper
from settings.settings import test_logins
from time import strftime

class LoginBase:
    def login(self):
        if not tap_by_css('.saved-login'):
            print 'skipping saved login'
        pair = test_logins[common.peeriohelper.getWebSocketServer()]
        text_by_id('username', pair['user'])
        text_by_id('password', pair['secret'])

        tap_by_css('.btn-safe')
        assert wait_find_by_id('tabbar') != None

    def changeuser(self):
        sleep(1)
        return tap_by_css('#footer .btn')
        sleep(1)

