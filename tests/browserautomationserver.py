import tornado.ioloop
import tornado.web
import tornado.websocket
import jsonpickle
import time
import sys
import threading

browserSocket = None
automationSocket = None

class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print 'Browser connected'
        global browserSocket
        browserSocket = self

    def on_message(self, message):
        # if data.origin == 'browser':
        #     print 'message from browser: %s' % message
        # self.write_message(message)
        print 'message received %s' % message
        if automationSocket is not None:
            automationSocket.write_message(message)

    def on_close(self):
      print 'Browser disconnected'
      global browserSocket
      browserSocket = None

class WSAutomationHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print 'Automation connected'
        global automationSocket
        automationSocket = self

    def on_message(self, message):
        print 'message received %s' % message
        if browserSocket is not None:
            browserSocket.write_message(message)

    def on_close(self):
        print 'Automation disconnected'
        global automationSocket
        automationSocket = None

def make_app():
    return tornado.web.Application([
        (r"/ws", WSHandler),
        (r"/automation", WSAutomationHandler),
    ])

def waitForBrowser():
    print "waiting for at least one browser to connect"
    while(True):
        if browserSocket != None:
            sys.stdout.write('.success')
            return True
        sys.stdout.write('.')
        time.sleep(1)

def run():
    print "starting tornado server on 8888"
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()

def runInThread():
    print "using background thread"
    t = threading.Thread(target=run)
    t.daemon = True
    t.start()

if __name__ == "__main__":
    run()
