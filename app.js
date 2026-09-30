const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = "Jakarta"; // Ganti dengan kota yang diinginkan

    const apiKey = "TmW3n2IbOKaZxkghOoYB"; // Ganti dengan API key Anda

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log(response.data); // Menampilkan data hasil geocoding di console

        const data = response.data;

        const lokasi = data.features[0].matching_text; // Mengambil nama lokasi dari hasil geocoding
        const koordinat = data.features[0].geometry.coordinates; // Mengambil koordinat dari hasil geocoding

        res.json({
            kota: lokasi,
            koordinat: koordinat
        });

    } catch (error) {

        console.error(error.message); // Menampilkan pesan error di console

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});