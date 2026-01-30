FROM node:20-alpine

WORKDIR /app

# Copy package saja untuk install dependencies
COPY package*.json ./
RUN npm install

# Copy folder prisma secara eksplisit sebelum generate
COPY prisma ./prisma/
RUN npx prisma generate

# Baru copy seluruh source code lainnya
COPY . .

EXPOSE 5000

CMD ["npx", "nodemon", "index.js"]