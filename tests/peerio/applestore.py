from common.helper import *

def signIn(user, secret):
    driver().switch_to_native()
    wait_find_by_xpath('//UIAAlert[@name="Sign In"]')
    click_by_xpath('//UIAButton[@name="Use Existing Apple ID"]')
    wait_find_by_xpath('//UIAAlert[@name="Sign In to iTunes Store"]')
    text_by_xpath('//UIATextField[@value="example@icloud.com"]', user)
    text_by_xpath('//UIASecureTextField[@value="Password"]', secret)
    click_by_xpath('//UIAButton[@name="OK"]')

def signInSandbox(user, secret):
    signIn(user, secret)
    try:
        # for sandbox apple prompts you twice
        signIn(user, secret)
    except:
        print "skipping sandbox sign in"

def cancelSignIn():
    driver().switch_to_native()
    try:
        wait_find_by_xpath('//UIAAlert[@name="Sign-In Required"]')
        click_by_xpath('//UIAButton[@name="Cancel"]')
    except:
        print "skipping sign in to check your downloads"

def acceptSubscription():
    driver().switch_to_native()
    wait_find_by_xpath('//UIAAlert[@name="Subscription Terms"]')
    click_by_xpath('//UIAButton[@name="Continue"]')
    wait_find_by_xpath('//UIAAlert[@name="Confirm Subscription"]')
    click_by_xpath('//UIAButton[@name="OK"]')
    try:
        wait_find_by_xpath('//UIAAlert[@name="Share Your Information?"]')
        click_by_xpath('//UIAButton[@name="Allow"]')
    except:
        print "skipping share your information"

def postreceipt(receipt64):
    url = "https://sandbox.itunes.apple.com/verifyReceipt"
    data = json.dumps({"receipt-data": receipt64, "password": "***REMOVED***"})
    print data
    buffer = StringIO.StringIO()
    c = pycurl.Curl()
    c.setopt(c.URL, url)
    c.setopt(c.WRITEDATA, buffer)
    c.setopt(pycurl.POST, 1)
    c.setopt(pycurl.POSTFIELDS, data)
    c.perform()
    c.close()
    return buffer.getvalue()

