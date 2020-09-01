#!/bin/bash

echo export REACT_APP_VERSION_GIT=`git rev-parse --short HEAD`
export REACT_APP_VERSION_GIT=`git rev-parse --short HEAD`

echo export REACT_APP_BUILD_TIME=`date -u +%s`
export REACT_APP_BUILD_TIME=`date -u +%s`

echo react-scripts build
react-scripts build

echo writing version file
echo $REACT_APP_VERSION_GIT > build/version.txt
echo $REACT_APP_BUILD_TIME >> build/version.txt
echo >> build/version.txt
git status --short >> build/version.txt
