#! /bin/bash


# 1: number of devices

if [ $1 -gt 0 ]
then
	for i in $(seq 1 $1); do
		sudo docker start android-$i 
	done
else
	echo "Introduce the parameter, 1: number of devices"
fi
