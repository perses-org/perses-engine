#! /bin/bash


# $1: numero de dispositivos
# $2: version Android (6 al 10)


if [ $# -eq 4 ] 
then
	if [ $2 -le 10 ] && [ $2 -ge 6 ]
	then

		if [ $1 -gt 0 ]
		then
			for i in $(seq 1 $1); do
				var=$(($i+6000))
				echo "create containeer" $var
				sudo docker create --privileged  --cpus="$3" --memory="$4"  -p  $var:6080 -e DEVICE="Samsung Galaxy S6" --name android-$i budtmo/docker-android-x86-$2.0
			done
		else
			echo "Enter a number greater than 0"
		fi
	else
		echo "Enter an Android version (6 to 10)"
	fi

else
	echo "Enter an two parameters 1: number of devices, 2: Android version (6 to 10), 3: CPU for container, 4: RAM for container"
fi
