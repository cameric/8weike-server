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

# Create app directory under /srv
RUN rm -rf /srv/nSERVER
RUN mkdir -p /srv/nSERVER

# Set up workdir so no OS navigation
WORKDIR /srv/nSERVER

# Install app dependencies
COPY package.json /srv/nSERVER/
RUN npm install

# Bundle app source
COPY ./server /srv/nSERVER

CMD [ "node", "index.js" ]
EXPOSE 8080
