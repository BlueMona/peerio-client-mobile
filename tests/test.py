import time
import appium
import selenium
from common.helper import *
from common.processes import *

capabilities = {
    "androidDeviceSocket": "com.peerio_devtools_remote",
    "chromeOptions": {
        'androidPackage': 'com.peerio',
        'androidActivity': '.MainActivity',
        "androidDeviceSocket": "com.peerio_devtools_remote"
    }
}

restartAppium()
restartChromedriver()
test_connect_android()

