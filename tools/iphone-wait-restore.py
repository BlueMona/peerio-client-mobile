import subprocess
import sys

def watch_iphone_syslog():
    syslog = subprocess.Popen(['idevicesyslog'], stdout=subprocess.PIPE)
    while True:
        line = syslog.stdout.readline()
        if line != '':
            sys.stdout.write('.')
        if "Finishing restore" in line:
            print
            print line
            return True

if __name__ == "__main__":
    watch_iphone_syslog()


