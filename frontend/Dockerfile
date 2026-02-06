# Gunakan image node sebagai base
FROM node:22-alpine

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin seluruh kode sumber frontend
COPY . .

# Expose port yang digunakan Vite (default 5173)
EXPOSE 5173

# Jalankan perintah dev dengan flag --host agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]