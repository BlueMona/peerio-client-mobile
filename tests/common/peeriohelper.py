from common.helper import *
from settings.settings import test_logins
from time import strftime

def removePin():
    tap_by_css('.btn-danger')
    wait_tap_by_css('.modal .btn-safe')

def tapPin(number):
    if number == 0:
        number = 10
    tap_by_css('.pin-pad > div:nth-child(%d) > div:nth-child(%d)' % (3 + (number-1)/3, 1 + (number-1) % 3))

def enterPin(pinText):
    for i in map(int, pinText):
        tapPin(i)
        sleep(0.1)


