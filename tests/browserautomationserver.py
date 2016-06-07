import tornado.ioloop
import tornado.web
import tornado.websocket
import jsonpickle
import time
import sys
import threading
from termcolor import colored

browserSocket = None
automationSocket = None

def print_c(message):
    print '[%s] %s' % (colored('AS', 'green'), message)

class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print_c('Browser connected')
        global browserSocket
        browserSocket = self

    def on_message(self, message):
        # if data.origin == 'browser':
        #     print 'message from browser: %s' % message
        # self.write_message(message)
        print_c('%s %s' % (colored('>>', 'green', 'on_grey', attrs=['bold']), message))
        if automationSocket is not None:
            automationSocket.write_message(message)

    def on_close(self):
      print_c('Browser disconnected')
      global browserSocket
      browserSocket = None

class WSAutomationHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print_c('Automation connected')
        global automationSocket
        automationSocket = self

    def on_message(self, message):
        print_c('%s %s' % (colored('<<', 'yellow', 'on_grey', attrs=['bold']), message))
        if browserSocket is not None:
            browserSocket.write_message(message)

    def on_close(self):
        print_c('Automation disconnected')
        global automationSocket
        automationSocket = None

def make_app():
    return tornado.web.Application([
        (r"/ws", WSHandler),
        (r"/automation", WSAutomationHandler),
    ])

def waitForBrowser():
    print_c("Waiting for at least one browser to connect")
    while(True):
        if browserSocket != None:
            sys.stdout.write('.success')
            return True
        sys.stdout.write('.')
        time.sleep(1)

def run():
    print_c("Starting tornado server on 8888")
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()

def runInThread():
    t = threading.Thread(target=run)
    t.daemon = True
    t.start()

if __name__ == "__main__":
    run()
