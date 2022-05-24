#!/bin/bash

DIR=/var/www/alphin/src
cd $DIR
echo "Getting Config ENV"
DBUSER=$(cat config.json | jq -r ".db.username")
DBPWD=$(cat config.json | jq -r ".db.password")
DBNAME=$(cat config.json | jq -r ".db.dbname")

## Assuming that mongodb is already installed

# create db and user
mongo --eval "db.getSiblingDB('$DBNAME');"
mongo --eval "db.createUser({ user : '$DBUSER', pwd : '$DBPWD', roles : [ { role : 'dbAdmin', db : '$DBNAME'},{ 'role' : 'readWrite', 'db' : '$DBNAME' } ], 'mechanisms' : [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ] });"
