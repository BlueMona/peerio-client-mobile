import tornado.ioloop
import tornado.web
import tornado.websocket
import jsonpickle

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'New connection with websocket automation proxy server established'

    def on_message(self, message):
        data = jsonpickle.decode(message)

        # if data.origin == 'browser':
        #     print 'message from browser: %s' % message
        # self.write_message(message)
        print 'message received %s' % message

    def on_close(self):
      print 'Connection to websocket automation proxy server closed'

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ws", WSHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
