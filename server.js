const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = req.query.kota || "Jakarta"; // Default Jakarta

    const apiKey = "TmW3n2IbOKaZxkghOoYB"; // Ganti dengan API key Anda

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        const feature = data.features[0];

        const lokasi = feature.matching_text || feature.text;
        const placeName = feature.place_name;
        const tipe = feature.place_type[0];
        const koordinat = feature.geometry.coordinates; // [lon, lat]
        const [lon, lat] = koordinat;

        // Ambil suhu & cuaca dari Open-Meteo (gratis, tanpa API key)
        const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
        const weatherRes = await axios.get(urlWeather);
        const current = weatherRes.data.current;

        const suhu = current.temperature_2m;
        const cuaca = kodeCuaca(current.weather_code);

        res.json({
            kota: lokasi,
            place_name: placeName,
            suhu: suhu,
            cuaca: cuaca,
            koordinat: koordinat,
            tipe: tipe
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

// Konversi kode cuaca WMO -> deskripsi
function kodeCuaca(code) {
    const map = {
        0: "Cerah", 1: "Cerah Berawan", 2: "Berawan", 3: "Mendung",
        45: "Berkabut", 48: "Kabut Beku",
        51: "Gerimis Ringan", 53: "Gerimis Sedang", 55: "Gerimis Lebat",
        61: "Hujan Ringan", 63: "Hujan Sedang", 65: "Hujan Lebat",
        71: "Salju Ringan", 73: "Salju Sedang", 75: "Salju Lebat",
        80: "Hujan Lokal Ringan", 81: "Hujan Lokal Sedang", 82: "Hujan Lokal Lebat",
        95: "Badai Petir", 96: "Badai Petir + Hujan Es", 99: "Badai Petir Hebat"
    };
    return map[code] || "Tidak diketahui";
}

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});