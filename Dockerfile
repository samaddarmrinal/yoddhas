# ---- Build Stage ----
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source
COPY . .

# Build production assets
RUN npm run build

# ---- Run Stage ----
FROM nginx:alpine

# Copy build output to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Replace default nginx config with one that listens on 8080
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
