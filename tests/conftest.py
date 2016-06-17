import pytest
import common
from common.helper import *
from common.processes import *

test_units_passed = -1

@pytest.fixture(scope="session", autouse=True)
def execute_before_any_test(extra = {}):
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

    if not common.platforms.launchPlatform(platform):
        pytest.exit('platform not found: ' + platform)
        return
    connect(extra)
    driver().restartPlatform = restart_platform

def restart_platform(extra):
    print "Restarting platform"
    execute_before_any_test(extra)

# def run_around_tests():
#     yield

def pytest_addoption(parser):
    parser.addoption("--platform", action="store", default=None,
        help="what platform to use")

