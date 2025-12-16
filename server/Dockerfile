# Build stage
FROM node:24-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# Copy database package
COPY database ./database

# Copy server package
COPY server ./server

# Install dependencies - use default pnpm behavior
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @seed/database db:generate

# Build database package
RUN pnpm --filter @seed/database build

# Build server
RUN pnpm --filter @seed/server build

# Production stage
FROM node:24-alpine AS runner

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy database package.json and built files
COPY --from=builder /app/database/package.json ./database/
COPY --from=builder /app/database/dist ./database/dist
COPY --from=builder /app/database/generated ./database/generated
COPY --from=builder /app/database/prisma ./database/prisma

# Copy server package.json and built files
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/dist ./server/dist

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=8080

# Expose server port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://0.0.0.0:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1


# Set working directory to server
WORKDIR /app/server

# Start the server
CMD ["node", "dist/index.js"]
