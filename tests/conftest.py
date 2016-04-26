import pytest
from common.processes import *

@pytest.fixture(scope="session", autouse=True)
def execute_before_any_test():
    print "Initializing tests"
    restartBrowserAutomation()
    # restartAppium()
    # restartChromedriver()
