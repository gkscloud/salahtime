#!/bin/bash

# offline version
xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

# start node http server
http-server ~/salattime/dist/ &

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:8080

# while true; do
#      xdotool keydown F5; xdotool keyup F5;
#      sleep 10
# done


