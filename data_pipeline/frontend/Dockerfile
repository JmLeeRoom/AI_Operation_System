# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including esbuild for rolldown-vite)
RUN npm install --production=false && npm install esbuild --save-dev

# Copy source code
COPY . .

# Create production .env file
# Use empty string to use relative path /api (nginx will proxy /api/ to backend-service)
RUN echo "VITE_API_URL=" > .env.production && \
    echo "VITE_API_TIMEOUT=30000" >> .env.production && \
    echo "VITE_USE_MOCK_API=false" >> .env.production && \
    echo "VITE_ENABLE_MOCK_AUTH=false" >> .env.production && \
    echo "VITE_ENABLE_DEBUG=false" >> .env.production && \
    echo "VITE_APP_NAME=Data Pipeline" >> .env.production && \
    echo "VITE_APP_VERSION=1.0.0" >> .env.production && \
    echo "VITE_LOG_LEVEL=info" >> .env.production

# Build the application for production
RUN npm run clean && npx vite build --mode production

# Runtime stage - use nginx to serve static files
FROM nginx:alpine

# Copy custom nginx config
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/xml application/x-javascript;

    # Static assets with proper MIME types
    location ~* \.(js|mjs)$ {
        add_header Content-Type application/javascript;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location ~* \.(css)$ {
        add_header Content-Type text/css;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location ~* \.(json)$ {
        add_header Content-Type application/json;
        try_files $uri =404;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://backend-service:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # SSE support
        proxy_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # HTML 파일은 캐시하지 않음 (항상 최신 버전)
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri =404;
    }

    # SPA routing - serve index.html for all routes (must be last)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
