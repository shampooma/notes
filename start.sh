#!/bin/sh

export $(cat .env | sed 's/#.*//g' | xargs)

if [ "$PROCESS_MODE" != "prod"]; then
  export PROCESS_MODE=dev
fi

docker-compose -f docker-compose-$PROCESS_MODE.yml "$@"
