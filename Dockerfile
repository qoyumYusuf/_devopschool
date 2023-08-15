# Use node LTS alpine image as the base
FROM node:lts-alpine3.18

# Set working directory
WORKDIR /usr/src/app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose port
EXPOSE 8088

# Start the application using dumb-init
CMD ["dumb-init", "node", "server.js"]
