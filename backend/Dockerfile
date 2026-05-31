# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Generate Prisma client
RUN npx prisma generate

# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy what we need
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package.json ./package.json

# Expose the port your Express app runs on
EXPOSE 5000

# Run Prisma migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
