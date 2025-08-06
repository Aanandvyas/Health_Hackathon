# Dockerfile for React Frontend
# Place this file in your project's root directory.

# --- STAGE 1: Build the React App ---
# Use a Node.js image to build the project
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install all frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Generate the production build
RUN npm run build

# --- STAGE 2: Serve the App with Nginx ---
# Use a lightweight Nginx image for the final container
FROM nginx:stable-alpine

# Copy the optimized build output from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80, which is the default port for Nginx
EXPOSE 80

# The command to start the Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]
