#! /bin/bash

############################## INSTALL APK WITH ADB ###############################

# This script installs the .apk file on the virtualized android devices.

# $1: Number of devices and IP reference.
# $2: Waiting time before installing the application.

sleep $2

	if [ $1 -gt 0 ]
	then

		for i in $(seq 1 $1); do
			var=$(($i+1))
			adb connect 172.17.0.$var
			
		done

		for i in $(seq 1 $1); do
			var=$(($i+1))
			adb connect 172.17.0.$var
			adb -s 172.17.0.$var install ./apk/app.apk
			echo "Install apk on android-"$i
		done
	else
		echo "Introduce un numero mayor que 0"
	fi

