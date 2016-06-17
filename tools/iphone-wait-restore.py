import subprocess
import sys
import atexit
import os

def watch_iphone_syslog():
    atexit.register(kill_syslog)
    syslog = subprocess.Popen(['idevicesyslog'], stdout=subprocess.PIPE)
    while True:
        line = syslog.stdout.readline()
        if line != '':
            sys.stdout.write('.')
        if "Finishing restore" in line:
            print
            print line
            syslog.kill()
            return True

def kill_syslog():
    os.system("ps -A | grep [i]devicesyslog | awk '{print $1}' | xargs kill -9")

if __name__ == "__main__":
    watch_iphone_syslog()


