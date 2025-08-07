# This Dockerfile is for your React Frontend.
# Place this file in your project's ROOT directory.

# --- STAGE 1: Build the React App ---
FROM node:18-alpine AS build

WORKDIR /app

# 1. Copy ONLY dependency files first (better layer caching)
COPY package.json package-lock.json ./

# 2. Clean install with frozen lockfile
RUN npm ci --omit=dev && \
    npm cache clean --force

# 3. Copy remaining files (exclude node_modules via .dockerignore)
COPY . .

# 4. Build with production settings
ENV NODE_ENV=production
RUN npm run build

# --- STAGE 2: Serve the App with Nginx ---
FROM nginx:stable-alpine

# 5. Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# 6. Security hardening
RUN rm /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 7. Optimized Nginx config
COPY nginx.conf /etc/nginx/conf.d

# 8. Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q -O /dev/null http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]