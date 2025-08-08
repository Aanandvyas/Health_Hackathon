# This Dockerfile is for your React Frontend.
# Place this file in your project's ROOT directory.

# --- STAGE 1: Build the React App ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: Serve the App with Nginx ---
FROM nginx:stable-alpine

# Copy the optimized build output from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx.conf to the container
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
