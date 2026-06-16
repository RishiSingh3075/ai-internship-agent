FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate --schema=prisma/schema.prisma
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]