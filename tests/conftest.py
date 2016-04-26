import pytest
from common.helper import *
from common.processes import *

@pytest.fixture(scope="session", autouse=True)
def execute_before_any_test():
    print "Initializing tests"
    restartBrowserAutomation()
    # connect_browser()
    # restartAppium()
    # restartChromedriver()

@pytest.yield_fixture(autouse=True)
def run_around_tests():
    yield
