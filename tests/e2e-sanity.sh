#!/usr/bin/env bash

# Whenever a file changes, make a request and dump the response

# Usage:
#	- start the express server on $PORT
#	- run this script on another terminal
#	- any file changes, in node_modules or source code, will trigger another request

test_dir="$(dirname "$0")"

#TODO time report IDs are unique - have to change that value later
resource_file="$test_dir/resources/time-report-42.csv" 

if [ -z "$PORT" ]; then
	echo "PORT env variable not set" >&2
	exit 1
fi

# Run the test when any .js files change
#find $test_dir/.. -name "*.js" | entr -c sh -c "sleep 0.1 && curl -F 'file=@$resource_file' 'localhost:$PORT/reports' | jq"
find $test_dir/.. -name "*.js" | entr -c sh -c "sleep 0.1 && curl 'localhost:$PORT/reports' | jq"

