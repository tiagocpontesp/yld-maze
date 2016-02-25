#! /bin/bash

SEED=7
EVENTS=30
CONCURRENCY=3

# SEED=725125
# EVENTS=2500
# CONCURRENCY=25


time java -server -XX:-UseConcMarkSweepGC -Xmx2G -jar ./FollowerMaze-assembly-1.0.jar $SEED $EVENTS $CONCURRENCY
