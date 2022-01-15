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
			#adb connect 172.17.0.$var
			kathara exec -d ./lab device$i -- adb connect localhost
			
			OUTPUT=$(kathara exec -d ./lab device$i -- adb -s localhost shell pm list instrumentation 2>&1)
			
			
			if [[ $OUTPUT == *"androidx"* ]]; then
				nohup kathara exec -d ./lab device$i -- adb -s localhost shell am instrument -w -r -e debug false $2.test/androidx.test.runner.AndroidJUnitRunner > ./devices-logs/espresso/android$i-UI-tests_result.txt &
			else
				nohup kathara exec -d ./lab device$i -- adb -s localhost shell am instrument -w -r -e debug false $2.test/android.support.test.AndroidJUnitRunner > ./devices-logs/espresso/android$i-UI-tests_result.txt &
			fi

			# if [[ $OUTPUT == *"androidx"* ]]; then
			# 	nohup adb -s 172.17.0.$var shell am instrument -w -r -e debug false $2.test/androidx.test.runner.AndroidJUnitRunner > ./devices-logs/espresso/android$i-UI-tests_result.txt &
			# else
			# 	nohup adb -s 172.17.0.$var shell am instrument -w -r -e debug false $2.test/android.support.test.AndroidJUnitRunner > ./devices-logs/espresso/android$i-UI-tests_result.txt &
			# fi


		done

		#Check the test files
		sleep 3
		node ./scripts/checkUIResults.js $1


		echo "Finish UI tests."

		
	
	fi
			
else
	echo "Enter the parameters, 1. Number of devices 2. applicationId"
fi

bash ./scripts/executeApk.sh $1 $2
sleep 1m



