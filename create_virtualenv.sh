#!/bin/sh

run() {
  $*
  if [ $? -ne 0 ]
  then
    echo "$* failed with exit code $?"
    return 1
  else
    return 0
  fi
}

pew new pelican -p /usr/bin/python2 && pew workon pelican && pip install pelican 
