#!/bin/sh

# read .env file
export $(cat .env | sed 's/#.*//g' | xargs)

# Set PROCESS_MODE to dev if it is not prod
if [ "$PROCESS_MODE" -ne "prod"]; then
  export PROCESS_MODE=dev
fi

# Run docker-compose
docker-compose -f docker-compose-$PROCESS_MODE.yml "$@"
