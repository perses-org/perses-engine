#! /bin/bash

############################## EXECUTE ANDROID APPLICATION WITH ADB ###############################

# This script starts the application on virtualized Android devices.

# $1: Number of devices 
# $2: applicationId of the application that you want to run

APK_TEST=./apk/app_test.apk




sleep 10

echo "Execute apk in devices..."


if [ $1 -gt 0 ] && [ $# -eq 2 ];
then
		
	for i in $(seq 1 2); do
		for i in $(seq 1 $1); do
			echo "Start... apk on android-"$i
	

			kathara exec -d ./lab device$i -- adb connect localhost
			kathara exec -d ./lab device$i -- adb -s localhost shell monkey -p $2 -c android.intent.category.LAUNCHER 1
			#kathara exec -d ./lab device$i -- adb -s localhost shell am start -n $2/.MainActivity


			echo "Execute apk on android-"$i
		done
	done
	

	echo "Finish!"
else
	echo "Enter the parameters, 1. Number of devices 2. applicationId"
fi

echo "Finish execute devices."

sleep 1m