from websocket import create_connection
import jsonpickle

if __name__ == "__main__":
    ws = create_connection("ws://localhost:8888/automation")
    # result =  ws.recv()
    # print "Received '%s'" % result
    # ws.close()
