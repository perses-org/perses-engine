#! /bin/bash


############################## EXTRACT LOGS FROM ANDROID DEVICES WITH ADB ###############################

# This script extracts the logs from the virtualized Android devices.

# $1: Number of devices and IP reference.
# $2: 'applicationId' of the application that you want to extract logs.


echo "Get Logs..."

if [ $1 -gt 0 ] && [ $# -eq 2 ];
then

	for i in $(seq 1 $1); do
		echo "Obtaining Logs from android-"$i

		kathara exec -d ./lab device$i -- adb connect localhost
		kathara exec -d ./lab device$i -- adb -s localhost logcat $2:D -d > ./devices-logs/log-android$i.txt 
		
		
		#adb connect 172.17.0.$var
		#adb -s 172.17.0.$var logcat $2:D -d > ./devices-logs/log-android$i.txt 
		echo "Logs obtained correctly from android-"$i

	done

	echo "Logs extracted correctly!"
else
	echo "Enter the parameters, 1. Number of devices 2. applicationId"
fi

