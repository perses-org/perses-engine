#! /bin/bash

############################## INSTALL APK WITH ADB ###############################

# This script installs the .apk file on the virtualized android devices.

# $1: Number of devices and IP reference.
# $2: Waiting time before installing the application.


APK=/shared/app.apk
APK_TEST=/shared/app_test.apk

sleep $2

	if [ $1 -gt 0 ]
	then

		for i in $(seq 1 $1); do

			echo "Install apk on android-"$i

			kathara exec -d ./lab device$i -- adb connect localhost
			kathara exec -d ./lab device$i -- adb -s localhost install -t -g $APK

			if [ -f "$APK_TEST" ]; then
				echo "Install apk test on android-"$i
				
				kathara exec -d ./lab device$i -- adb -s localhost install -t -g $APK_TEST
				
			fi

		done
	
	else
		echo "$ 1.-Number of devices. 2.- Waiting time before installing the application"
	fi

