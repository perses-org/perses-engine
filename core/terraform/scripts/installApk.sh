#! /bin/bash

############################## INSTALL APK WITH ADB ###############################

# This script installs the .apk file on the virtualized android devices.

# $1: Number of devices and IP reference.
# $2: Waiting time before installing the application.

APK=./apk/app.apk
APK_TEST=./apk/app_test.apk

sleep $2

	if [ $1 -gt 0 ]
	then
		for i in $(seq 1 2); do
			for i in $(seq 1 $1); do
				var=$(($i+1))
				adb connect 172.17.0.$var
				
			done

			for i in $(seq 1 $1); do
				var=$(($i+1))
				adb connect 172.17.0.$var
				echo "Install apk on android-"$i
				adb -s 172.17.0.$var install -t -g $APK
				

				if [ -f "$APK_TEST" ]; then
					echo "Install apk test on android-"$i
					adb -s 172.17.0.$var install -t -g $APK_TEST
					
				fi
			done
		done
	else
		echo "Introduce un numero mayor que 0"
	fi

