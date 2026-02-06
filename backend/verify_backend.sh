#!/bin/bash
BASE_URL="http://localhost:5000/api"
EMAIL="admin@dp3a.kendari.go.id"
PASS="admin123"

echo "1. Login Admin..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASS\"}")

TOKEN=$(echo $LOGIN_RES | grep -oP '"token":"\K[^"]+')
if [ -z "$TOKEN" ]; then
  echo "Login Failed: $LOGIN_RES"
  exit 1
else
  echo "Login Success, Token obtained."
fi

echo -e "\n2. Check Stats..."
curl -s -X GET "$BASE_URL/laporan/stats" \
  -H "Authorization: Bearer $TOKEN" | grep "total" && echo "Stats OK" || echo "Stats Failed"

echo -e "\n3. Submit Report..."
# Using hardcoded minimal json for pelapor, korban, laporan
SUBMIT_RES=$(curl -s -X POST "$BASE_URL/laporan/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "pelapor": {
      "namaPelapor": "Test User",
      "nikPelapor": "1234567890123456",
      "noTelpPelapor": "08123456789",
      "alamatPelapor": "Jl. Test No. 1"
    },
    "laporan": {
      "idKecamatan": 1,
      "idJenisKasus": 1,
      "idBentukKekerasan": 1,
      "lokasiLengkapKejadian": "Test Location",
      "tanggalKejadian": "2023-01-01",
      "kronologiKejadian": "Kronologi tes"
    },
    "korban": {
      "namaKorban": "Test Korban",
      "nikKorban": "1231231231231231",
      "usiaKorban": 20,
      "alamatKorban": "Jl. Korban 1"
    }
  }')

TIKET=$(echo $SUBMIT_RES | grep -oP '"nomor_tiket":"\K[^"]+')
if [ -z "$TIKET" ]; then
  echo "Submit Failed: $SUBMIT_RES"
else
  echo "Submit Success, Ticket: $TIKET"
  
  echo -e "\n4. Check Tracking (Public)..."
  curl -s -X GET "$BASE_URL/laporan/status/$TIKET" | grep "$TIKET" && echo "Tracking OK" || echo "Tracking Failed"
fi

echo -e "\n5. Check GIS..."
curl -s -X GET "$BASE_URL/laporan/gis" \
  -H "Authorization: Bearer $TOKEN" | grep -F "[" && echo "GIS OK" || echo "GIS Failed"

echo -e "\n6. Check Export..."
curl -s -I -X GET "$BASE_URL/laporan/export" \
  -H "Authorization: Bearer $TOKEN" | grep "text/csv" && echo "Export Content-Type OK" || echo "Export Failed"

echo -e "\nDone."
