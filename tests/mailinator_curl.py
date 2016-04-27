import pycurl
import jsonpickle
import StringIO
import time
import re

token = 'f72c93a9b5e04f73af8197f42192cec8'
to = 'florencia.hv'
inbox = 'https://api.mailinator.com/api/inbox?to=%s&token=%s'
message = 'https://api.mailinator.com/api/email?msgid=%s&token=%s'

def getstring(url):
	buffer = StringIO.StringIO()
	c = pycurl.Curl()
	c.setopt(c.URL, url)
	c.setopt(c.WRITEDATA, buffer)
	c.perform()
	c.close()
	return buffer.getvalue()

def get_messages():
    time.sleep(1)
    try:
        return jsonpickle.decode(getstring(inbox % (to, token)))
    except:
        return None

def get_message(id):
    time.sleep(1)
    try:
        return jsonpickle.decode(getstring(message % (id, token)))
    except:
        return None

def get_message_for(email):
    messages = get_messages()[u'messages']
    if not messages:
        return None
    for m in messages:
        if email in m[u'subject']:
            id = m[u'id']
            am = get_message(id)
            return am

def get_code_for(email):
    m = get_message_for(email)
    if not m:
        return None
    m = m[u'data'][u'parts'][0]['body']
    m = re.search('request:\s+(\d+)', m)
    m = int(m.group(1))
    return m


