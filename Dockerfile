######################################
# Node server (nSERVER) Docker build #
######################################

# Use latest Node current build
# Note(tonyzhang): We use Node 6.3.1 image
# instead of LTS build (argon) because we need to
# enable ES6 support from Node (95%).
FROM node:wheezy

# Authors
MAINTAINER Tony Zhang <zhzhangtony@gmail.com>

# First install global packages. Include all
# global dependencies in this line to reduce layers
RUN npm install --global mocha

# Set up environment variables inside container
# ONLY write one ENV to keep the layers clean
#
# NOTE(tonyzhang): Any change to this list will be
# applied to ALL three environments (dev, test, prod).
# If you want the environment variable to be applied
# to only one environment (like NODE_ENV), please refer
# to the paper doc "Docker Setup Guide".

# Create and move to app directory
RUN mkdir -p /srv/nSERVER
WORKDIR /srv/nSERVER

# Install dependencies
COPY ./server/package.json /srv/nSERVER
RUN npm install

# Bundle app source inside the image
COPY ./server /srv/nSERVER

CMD [ "npm", "start" ]
EXPOSE 8080 8888
