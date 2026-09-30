async function cariLokasi() {

    const input = document.getElementById("kota");

    const kota = input.value.trim();

    const result = document.getElementById("result");
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    if (!kota) {
        error.textContent = "Silakan masukkan nama lokasi.";
        error.classList.remove("hidden");
        result.classList.add("hidden");

        return;
    }

    loading.classList.remove("hidden");
    error.classList.add("hidden");
    result.classList.add("hidden");

    try {

        const response = await fetch(
            `/api/lokasi?kota=${encodeURIComponent(kota)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Terjadi kesalahan."
            );
        }

        document.getElementById("lokasi").textContent =
            data.lokasi;

        document.getElementById("negara").textContent =
            data.negara;

        document.getElementById("provinsi").textContent =
            data.provinsi;

        document.getElementById("kecamatan").textContent =
            data.kecamatan;

        document.getElementById("longitude").textContent =
            data.longitude;

        document.getElementById("latitude").textContent =
            data.latitude;

        document.getElementById("coordinateText").textContent =
            `${data.latitude}, ${data.longitude}`;

        result.classList.remove("hidden");

    } catch (err) {

        error.textContent = err.message;

        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

    }
}


// Bisa tekan Enter untuk mencari
document
    .getElementById("kota")
    .addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            cariLokasi();
        }

    });
