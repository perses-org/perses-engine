#! /bin/bash


# $1: numero de dispositivos
# $2: nombre del apk
# $3: timewait
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

