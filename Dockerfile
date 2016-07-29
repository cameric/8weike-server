######################################
# Node server (nSERVER) Docker build #
######################################

# Use latest Node LTS build
FROM node:argon

# Create app directory
RUN rm -rf /urc/src/nSERVER
RUN mkdir -p /usr/src/nSERVER
WORKDIR /usr/src/SERVER-node

# Install app dependencies
COPY package.json /usr/src/nSERVER/
RUN npm install

# Bundle app source
COPY . /usr/src/nSERVER

EXPOSE 8080
CMD [ "npm", "start" ]