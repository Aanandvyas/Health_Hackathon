# This Dockerfile is for your React Frontend.
# Place this file in your project's ROOT directory.

# --- STAGE 1: Build the React App ---
# Use a specific, stable version of Node.js for consistency
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy ONLY the package files to leverage Docker caching
COPY package.json package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the source code
# This will respect the .dockerignore file you created
COPY . .

# Generate the production build
RUN npm run build

# --- STAGE 2: Serve the App with Nginx ---
# Use a lightweight Nginx image for the final container
FROM nginx:stable-alpine

# Copy the optimized build output from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx.conf to the container
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80 for the Nginx server
EXPOSE 80

# The command to start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
