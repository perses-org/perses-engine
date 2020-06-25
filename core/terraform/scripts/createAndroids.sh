#! /bin/bash

############################## CREATE ANDROID DEVICES WITH DOCKER ###############################

# This script creates '$1' Docker containers with CPU and RAM limitation specified by parameters '$3' and '$4'. 
# Docker uses an image from an Android device with the version specified in '$2' parameter.

# $1: Number of devices and IP reference.
# $2: Android version (6 to 10).
# $3: CPU for container.
# $4: RAM for container.




echo "Docker: Create containers..."

if [ $# -eq 4 ] 
then
	if [ $2 -le 10 ] && [ $2 -ge 6 ]
	then

		if [ $1 -gt 0 ]
		then
			for i in $(seq 1 $1); do
				var=$(($i+6000))
				echo "Create container in port" $var
				sudo docker create --privileged  --cpus="$3" --memory="$4"  -p  $var:6080 -e DEVICE="Samsung Galaxy S6" --name android-$i budtmo/docker-android-x86-$2.0
			done
		else
			echo "Enter a number greater than 0"
		fi
	else
		echo "Enter an Android version (6 to 10)"
	fi

else
	echo "Enter an two parameters 1: Number of devices, 2: Android version (6 to 10), 3: CPU for container, 4: RAM for container"
fi

echo "Docker: Finish create containers"