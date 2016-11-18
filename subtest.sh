#!/bin/bash 
mosquitto_sub -t /sensors/pic/0 -N -C 2 > image`date +%Y%m%d-%H%M%S`.jpg
