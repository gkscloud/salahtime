#!/bin/bash

xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk https://ahlehadithcanada.org/prayer-times-digital-screen/    https://ahlehadithcanada.org/important-announcements/

while true; do
     xdotool keydown ctrl+Tab; xdotool keyup ctrl+Tab;
     sleep 15
done



