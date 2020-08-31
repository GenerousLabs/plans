#!/bin/bash

OS=$(uname -s)
TAG="generous-plans-server"

# Moved the building inside the docker container for now
# ./build.sh

if [ "$OS" = "Darwin" ]; then
  docker build -t "$TAG" .
else
  sudo docker build -t "$TAG"  .
fi