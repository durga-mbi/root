FROM node:22-alpine
RUN apk add --no-cache openssl libc6-compat wget
ENV TZ=Asia/Kolkata

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Shared prisma volume will be mounted at /app/prisma in compose
EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate --schema /app/prisma/schema.prisma && until npx prisma migrate deploy --schema /app/prisma/schema.prisma; do echo 'Waiting for database...'; sleep 5; done && npm run dev"]