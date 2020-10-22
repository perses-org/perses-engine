#! /bin/bash

############################## EXECUTE ANDROID APPLICATION WITH ADB ###############################

# This script starts the application on virtualized Android devices.

# $1: Number of devices 
# $2: applicationId of the application that you want to run

APK_TEST=./apk/app_test.apk



if [ $1 -gt 0 ] && [ $# -eq 2 ];
then


	if [ -f "$APK_TEST" ]; then
		echo "Execute UI Tests..."
	
		for i in $(seq 1 $1); do
			echo "Starting UI test on android-"$i
			var=$(($i+1))
			adb connect 172.17.0.$var
			nohup adb -s 172.17.0.$var shell am instrument -w -r   -e debug false $2.test/androidx.test.runner.AndroidJUnitRunner > ./devices-logs/espresso/android$i-UI-tests_result.txt &
			pids[${i}]=$!
		done

		for pid in ${pids[*]}; do
			wait $pid
		done

		#Check the test files
		# sleep 10
		# node ./scripts/checkUIResults.js $1
	
	fi
	
	
	
	
else
	echo "Enter the parameters, 1. Number of devices 2. applicationId"
fi

echo "Finish execute devices."

