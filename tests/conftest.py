import pytest
import common
from common.helper import *
from common.processes import *

@pytest.fixture(scope="session", autouse=True)
def execute_before_any_test():
    print "Initializing tests"
    platform = pytest.config.getoption("--platform")
    if not platform:
        message = ["\n",
                   "Error running tests. Please specify a platform with a --platform flag, for example py.test tests --platform=browser",
                   "List of available platforms:",
                   "browser: run tests in the browser (with Peerio.AutomationSocket === true)",
                   "ios: run tests in the simulator",
                   "android: run tests in the GenyMotion simulator (please launch it before start)",
                   ""]
        pytest.exit('\n'.join(message))
        return

    method = getattr(common.helper, 'platform_' + platform)
    if not method:
        pytest.exit('platform not found: ' + platform)
        return

    platform_options = method()
    set_platform(platform_options)

    if 'appium' in platform_options and platform_options['appium']:
        restartAppium()

    if 'browserautomation' in platform_options and platform_options['browserautomation']:
        restartBrowserAutomation()

    if 'chromeriver' in platform_options and platform_options['chromedriver']:
        restartChromedriver()

@pytest.yield_fixture(autouse=True)
def run_around_tests():
    yield

def pytest_addoption(parser):
    parser.addoption("--platform", action="store", default=None,
        help="what platform to use")

