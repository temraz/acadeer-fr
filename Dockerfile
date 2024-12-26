# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Add environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app with environment variables
RUN REACT_APP_API_URL=${REACT_APP_API_URL} npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 