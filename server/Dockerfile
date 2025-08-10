# This Dockerfile should be located in your ./server directory.

# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Python, pip, and necessary build tools
RUN apk add --no-cache python3 py3-pip

# Copy the dependency manifest files first for better caching
COPY package.json package-lock.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Install Python dependencies, adding the --break-system-packages flag
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

# Copy the rest of your server's source code
COPY . .

# Note: The CMD here is just a default.
# The docker-compose.yml file will override it for each service.
CMD [ "node", "index.js" ]
