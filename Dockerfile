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

# No environment variable necessary for now
# ENV foo=bar

# Create app directory under /srv
RUN rm -rf /srv/nSERVER
RUN mkdir -p /srv/nSERVER

# Set up workdir so no OS navigation
WORKDIR /srv/nSERVER

# Bundle app source
COPY ./server /srv/nSERVER

# Install app dependencies
RUN npm install

CMD [ "npm", "start" ]
EXPOSE 8080 8888
