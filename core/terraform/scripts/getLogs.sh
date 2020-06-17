#! /bin/bash


wait 10

echo "Get Logs..."

if [ $1 -gt 0 ] && [ $# -eq 2 ];
then

	for i in $(seq 1 $1); do
		echo "Get Logs on android-"$i
		var=$(($i+1))
		adb connect 172.17.0.$var
		adb -s 172.17.0.$var logcat $2:D -d > ./logs-devices/log-android$i.txt 
		echo "Get Logs from android-"$i" correctly!"

	done

	echo "Finish Get Logs!"
else
	echo "Enter the parameters, 1. Number of devices 2. applicationId"
fi

