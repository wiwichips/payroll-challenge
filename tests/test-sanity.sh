#!/usr/bin/env bash

# Whenever a file changes, make a request and dump the response

# Usage:
#	- any file changes, in node_modules or source code, will trigger another test run 

test_dir="$(dirname "$0")"
find $test_dir/.. -name "*.js" | entr -c sh -c "npm run test"

