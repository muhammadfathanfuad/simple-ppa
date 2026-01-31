FROM node:20-alpine

WORKDIR /app

# Install openssl untuk Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate client di dalam environment Linux Docker
RUN npx prisma generate

EXPOSE 5000

# Gunakan script dev yang sudah kita buat di package.json
CMD ["npm", "run", "dev"]