FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate --schema=prisma/schema.prisma
EXPOSE 5000
CMD ["sh", "-c", "node server.js 2>&1 | tee /tmp/server.log; cat /tmp/server.log; sleep 3600"]