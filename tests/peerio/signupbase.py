from common.helper import *
from settings.settings import test_logins
from time import strftime

class SignupBase:
    username = None
    phrase = None
    def signup(self, passCb = None):
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
        assert wait_find_by_css('.txt-lrg')
        self.phrase = get_text_by_css('.txt-lrg')
        if passCb:
            return passCb()
        tap_by_css('.btn-safe')
        wait_find_by_css('textarea')
        text_by_css('textarea', self.phrase)
        tap_by_css('.btn-safe')

