# syntax=docker/dockerfile:1
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies (cache)
COPY package*.json ./
RUN npm ci --production=false

# Copy source & build
COPY . .
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

# Jika butuh env tertentu, set NODE_ENV
ENV NODE_ENV=production
# Copy only necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
