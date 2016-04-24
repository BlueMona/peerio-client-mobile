var unittest = require('unittest');
var os = require('os');
var sys = require('sys');
var pdb = require('pdb');
from selenium.common.} catch (ions var NoSuchElementException = require('NoSuchElementException');
from random var randint = require('randint');
from appium var webdriver = require('webdriver');
from time var sleep = require('sleep');
from time var strftime = require('strftime');
from settings.settings var * = require('*');
from common.helper var * = require('*');
from common.processes var * = require('*');

class Signup(unittest.TestCase)) {
    function test_00_init(self) {
        test_connect();
    }
    function test_01_signup(self) {
        // signup
        tap_by_css('.btn-primary');
    }
        // terms of use
        tap_by_css('.btn-safe');

        // basic information
        // TODO: handle existing usernames
        // TODO: different usernames (random, etc)
        // TODO: username should work correctly in both slow and fast mode. Now only slow works
        text_by_id('user_name', 't' + Stringftime('%Y%m%d%H%M%S'), true);
        text_by_id('user_first_name', 'tester');
        text_by_id('user_last_name', 'lastname');
        wait_find_by_css('.btn-safe');
        tap_by_css('.btn-safe');

        // get the passphrase
        phrase = wait_find_by_css('.txt-lrg').text;
        tap_by_css('.btn-safe');
        wait_find_by_css('textarea');
        text_by_css('textarea', phrase);
        tap_by_css('.btn-safe');

    function test_02_terms(self) {
        console.log 'done';
    }
if (__name__ == '__main__') {
    restartAppium();
    restartChromedriver();
    suite = unittest.TestLoader().loadTestsFromTestCase(Signup);
    unittest.TextTestRunner(verbosity=2).run(suite);

}
