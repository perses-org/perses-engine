#! /bin/bash


wait 10

if [ $1 -gt 0 ] && [ $# -eq 2 ];
then
	for i in $(seq 1 $1); do
		var=$(($i+1))
		var2=$(($i-1))
		adb connect 172.17.0.$var
		adb -s 172.17.0.$var shell monkey -p $2 -c android.intent.category.LAUNCHER 1
		adb -s 172.17.0.$var logcat $2:D > ./logs/log-android$1.txt

	done

	for i in $(seq 1 $1); do
		var=$(($i+1))
		var2=$(($i-1))
		adb connect 172.17.0.$var
		adb -s 172.17.0.$var shell monkey -p $2 -c android.intent.category.LAUNCHER 1
		adb -s 172.17.0.$var logcat $2:D > ./logs/log-android$1.txt

	done
else
	echo "Enter the parameters, 1. Number of devices 2. applicationId"
fi

