#!/bin/bash

xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk https://playful-cendol-04166c.netlify.app

# while true; do
#      xdotool keydown ctrl+Tab; xdotool keyup ctrl+Tab;
#      sleep 15
# done

while true; do
     xdotool keydown F5; xdotool keyup F5;
     sleep 5
done


