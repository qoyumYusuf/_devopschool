# Stage 1: Build the image
FROM node:lts-alpine3.18 as builder

# Create app directory
WORKDIR /usr/src/app

# Set environment variable for local development
ENV NODE_ENV="production"

# Install dumb-init in the builder stage
RUN apk add --no-cache dumb-init

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

#Create a node user
USER node

# Bundle app source
COPY --chown=node:node . /usr/src/app

# Stage 2: Create the production image
FROM node:lts-alpine3.18 as production

# Create app directory
WORKDIR /usr/src/app

# Set environment variable for production
ENV NODE_ENV="production"

# Install dumb-init in the production stage
RUN apk add --no-cache dumb-init

 # Copy the built application from the builder stage
COPY --from=builder /usr/src/app .

EXPOSE 8080

CMD [ "dumb-init", "node", "server.js" ]
