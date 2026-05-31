

# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app


COPY . .
RUN npm install --omit=dev
RUN npx prisma generate --schema=prisma/schema.prisma

# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
