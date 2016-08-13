#! /bin/bash

# This is the general configuration script that runs
# to configure the dev environment.
#

# Symlink app and webapp to node_modules to avoid complex relative
# require statements like require('../../../config/test'). With this, you
# can write the above like require('app/config/test') instead.
#
# This is recommended by Browserify, see below:
#   https://github.com/substack/browserify-handbook#avoiding-
printf "Linking ./server/app to ./server/node_modules/app...\n\n"
(
    cd server/node_modules && ln -nsf ../app
)
printf "Linking ./server/webapp to ./server/node_modules/webapp...\n\n"
(
    cd server/node_modules && ln -nsf ../webapp
)

# A helper function to check if some command
# passed or failed. The first parameter should be a
# message to describe the command.
command_status_check() {
  if [ $? -eq 0 ]; then
    printf "Command succeeded: $1 \n"
  else
    printf "Command failed: $1 \n"; exit 1;
  fi
}


# Docker configurations

# Sanity check for docker
hash docker 2>/dev/null || {
  printf >&2 "docker command does not exist. Aborting."; exit 1;
}

# OPTIONAL sanity checks. ONLY comment these checks when you actually
# need to use the commands
# hash docker-compose 2>/dev/null || {
#   printf >&2 "docker command does not exist. Aborting."; exit 1;
# }
# hash docker-machine 2>/dev/null || {
#   printf >&2 "docker command does not exist. Aborting."; exit 1;
# }

# Build Dev MySQL Docker container
printf "Bootstrapping dev MySQL container with official MySQL image...\n"
mkdir mysql-data
docker run -d --name 8weike-db-dev \
           -e MYSQL_ROOT_PASSWORD=8weike-db-dev-MySQL-SECRET \
           -e MYSQL_DATABASE=8weike-db-dev \
           -e MYSQL_USER=dbdevmaster \
           -e MYSQL_PASSWORD=dbdevmaster \
           -p 3306:3306 \
           -v $(pwd)/mysql-data:/var/lib/mysql \
           mysql:latest
command_status_check "bootstrap MySQL container"
printf "Dev MySQL server running at port 3306\n\n"

# Build 8Weike web Docker container

# ALERT(tony): the below configuration section is in sync with the CircleCI
# configuration file that is used to set up the
# test environment in CircleCI as well as the prod
# environment on AWS. Any change to server container config needs
# to run on all three environments.

if [[ "$(docker images -q cameric/8weike-server:v1 2> /dev/null)" == "" ]]; then
  printf "Start building the Node.js image...\n"
  docker build -t cameric/8weike-server:v1 .
  command_status_check "build docker image\n"
else
  printf "nSERVER image already exists. Proceed to next step\n\n"
fi

printf "Check current docker images\n"
docker images
printf "If you don't see image cameric/8weike-server, check the Docker build settings\n\n"

printf "Initiating server image into Docker container...\n"
docker run -d --name nSERVER \
           -p 3000:8080 \
           -p 8888:8888 \
           --link 8weike-db-dev:mysql \
           -v $(pwd)/server:/srv/nSERVER \
           cameric/8weike-server:v1
command_status_check "initiate docker container\n"

printf "Check running docker container\n"
docker ps -l
printf "If you don't see container with name nSERVER, run docker manually"
printf "* Please remember the container name: nSERVER!\n\n"

printf "##################\n"
printf "# BUILD SUCCESS! #\n"
printf "##################\n\n"

# Print helpful information about docker commands
printf "Possible next steps:\n"
echo "- Access container:   $ docker exec -it nSERVER /bin/bash"
echo "- Read container log: $ docker logs -f nSERVER"
echo "- Stop container:     $ docker stop nSERVER"
