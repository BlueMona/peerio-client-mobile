import pytest
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
                   "ios92, ios93: run tests in the simulator",
                   "android: run tests in the GenyMotion simulator (please launch it before start)",
                   ""]
        pytest.exit('\n'.join(message))
        return
    if platform == "browser":
        platform_options = platform_browser()
        set_platform(platform_options)
        restartBrowserAutomation()

    if platform == "ios":
        platform_options = platform_ios()
        set_platform(platform_options)
        restartAppium()

    if platform == "android":
        print "android"
        platform_options = platform_android()
        set_platform(platform_options)
        restartAppium()
        restartChromedriver()

@pytest.yield_fixture(autouse=True)
def run_around_tests():
    yield

def pytest_addoption(parser):
    parser.addoption("--platform", action="store", default=None,
        help="what platform to use")

