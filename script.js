// --- Security Signature (Do not remove) ---
console.log(
  "\x43\x72\x65\x61\x74\x65\x64\x20\x62\x79\x20\x46\x61\x72\x64\x61\x6E\x20\x41\x7A\x7A\x75\x68\x72\x69"
);

// --- DATABASE PENCARIAN ---
const databaseMateri = [
  { judul: "Profil Pondok & Sejarah", link: "profil.html", kategori: "Profil" },
  { judul: "Visi dan Misi", link: "profil.html", kategori: "Profil" },
  { judul: "Alamat & Lokasi Maps", link: "alamat.html", kategori: "Kontak" },
  { judul: "Daftar Guru & Pengurus", link: "guru.html", kategori: "Guru" },
  {
    judul: "Biodata Dr. Mu'allim Yusuf Hidayat",
    link: "biodata-ketua.html",
    kategori: "Guru",
  },
  {
    judul: "Donasi Pembangunan & Rekening",
    link: "donasi.html",
    kategori: "Donasi",
  },
  {
    judul: "Kontak WhatsApp & Form Pesan",
    link: "kontak.html",
    kategori: "Kontak",
  },
  { judul: "Pendaftaran Santri Baru", link: "index.html", kategori: "Beranda" },
  {
    judul: "Program Unggulan Tahfidz",
    link: "index.html",
    kategori: "Beranda",
  },
];

// --- 1. DARK MODE ---
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) body.setAttribute("data-theme", savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    if (body.getAttribute("data-theme") === "dark") {
      body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

// --- 2. SCROLL PROGRESS & BACK TO TOP ---
const progressBar = document.querySelector(".progress-bar");
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const height = scrollHeight - clientHeight;

  let scrolled = (scrollTop / height) * 100;
  if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
    scrolled = 100;
  }
  if (progressBar) progressBar.style.width = scrolled + "%";

  if (backToTopBtn) {
    if (scrollTop > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// --- 3. MENU TOGGLE (MOBILE) ---
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    if (nav.style.display === "block") {
      nav.style.display = "none";
    } else {
      nav.style.display = "block";
    }
  });
}

// --- 4. LOGIKA PENCARIAN ---
const containerHasil = document.getElementById("halamanHasilPencarian");
if (containerHasil) {
  const params = new URLSearchParams(window.location.search);
  const keywordURL = params.get("q");

  if (keywordURL) {
    document.getElementById(
      "judulPencarian"
    ).innerText = `Hasil: "${keywordURL}"`;

    const hasil = databaseMateri.filter((item) =>
      item.judul.toLowerCase().includes(keywordURL.toLowerCase())
    );

    if (hasil.length > 0) {
      hasil.forEach((item) => {
        const div = document.createElement("div");
        div.style.marginBottom = "20px";
        div.style.padding = "20px";
        div.style.background = "var(--input-bg)";
        div.style.borderRadius = "12px";

        div.innerHTML = `
            <h3 style="margin:0 0 5px 0"><a href="${item.link}" style="text-decoration:none; color:var(--blue-apple);">${item.judul}</a></h3>
            <span style="font-size:12px; color:#666; text-transform:uppercase; letter-spacing:1px;">${item.kategori}</span>
          `;
        containerHasil.appendChild(div);
      });
    } else {
      containerHasil.innerHTML = `<p>Tidak ditemukan hasil untuk "${keywordURL}".</p>`;
    }
  } else {
    containerHasil.innerHTML =
      "<p>Silakan masukkan kata kunci di kotak pencarian.</p>";
  }
}

// --- 5. LOGIKA HALAMAN DONASI (Laporan Keuangan) ---
const tabelDonasi = document.getElementById("tabelDonasiBody");

if (tabelDonasi) {
  const dataTransaksi = [
    { tanggal: "01-01-2025", ket: "Saldo Awal", masuk: 5000000, keluar: 0 },
    { tanggal: "15-01-2025", ket: "Beli Semen", masuk: 0, keluar: 1000000 },
    {
      tanggal: "05-02-2025",
      ket: "Donasi Hamba Allah",
      masuk: 500000,
      keluar: 0,
    },
    { tanggal: "10-02-2025", ket: "Upah Tukang", masuk: 0, keluar: 1500000 },
    { tanggal: "01-03-2025", ket: "Infaq Jumat", masuk: 2000000, keluar: 0 },
  ];

  function renderKeuangan() {
    const tbody = document.getElementById("tabelDonasiBody");
    const pesanKosong = document.getElementById("pesanKosong");
    const filterBulan = document.getElementById("filterBulan").value;
    const filterTahun = document.getElementById("filterTahun").value;

    let totMasuk = 0;
    let totKeluar = 0;
    let dataDitampilkan = 0;

    tbody.innerHTML = "";
    const dataTerbalik = [...dataTransaksi].reverse();

    dataTerbalik.forEach((item) => {
      const parts = item.tanggal.split("-");
      const bulanData = parts[1];
      const tahunData = parts[2];

      const cekBulan = filterBulan === "all" || filterBulan === bulanData;
      const cekTahun = filterTahun === "all" || filterTahun === tahunData;

      if (cekBulan && cekTahun) {
        dataDitampilkan++;
        totMasuk += item.masuk;
        totKeluar += item.keluar;

        let jenisHTML =
          item.masuk > 0
            ? '<span class="badge badge-in">Masuk</span>'
            : '<span class="badge badge-out">Keluar</span>';

        let nominal = item.masuk > 0 ? item.masuk : item.keluar;

        let row = `<tr>
                    <td>${item.tanggal}</td>
                    <td>${item.ket}</td>
                    <td>${jenisHTML}</td>
                    <td style="text-align: right; font-family: monospace;">Rp ${nominal.toLocaleString(
                      "id-ID"
                    )}</td>
                </tr>`;
        tbody.innerHTML += row;
      }
    });

    if (pesanKosong) {
      pesanKosong.style.display = dataDitampilkan === 0 ? "block" : "none";
    }

    if (document.getElementById("totalMasuk"))
      document.getElementById("totalMasuk").innerText =
        "Rp " + totMasuk.toLocaleString("id-ID");
    if (document.getElementById("totalKeluar"))
      document.getElementById("totalKeluar").innerText =
        "Rp " + totKeluar.toLocaleString("id-ID");
    if (document.getElementById("totalSaldo"))
      document.getElementById("totalSaldo").innerText =
        "Rp " + (totMasuk - totKeluar).toLocaleString("id-ID");
  }

  document
    .getElementById("filterBulan")
    .addEventListener("change", renderKeuangan);
  document
    .getElementById("filterTahun")
    .addEventListener("change", renderKeuangan);

  renderKeuangan();
}

function salinRekening() {
  const norekEl = document.getElementById("norek");
  if (!norekEl) return;
  var norekText = norekEl.innerText;
  navigator.clipboard.writeText(norekText).then(
    function () {
      var alertBox = document.getElementById("copyAlert");
      if (alertBox) {
        alertBox.style.display = "block";
        setTimeout(function () {
          alertBox.style.display = "none";
        }, 2000);
      }
    },
    function (err) {
      console.error("Gagal menyalin: ", err);
    }
  );
}

// --- 6. LOGIKA HALAMAN KONTAK (Validasi & Modal) ---
const kirimPesanBtn = document.getElementById("kirimPesanBtn");

if (kirimPesanBtn) {
  function tampilkanModal(pesan) {
    var modal = document.getElementById("customModal");
    var msg = document.getElementById("modalMessage");
    if (modal && msg) {
      msg.innerText = pesan;
      modal.style.display = "flex";
    }
  }

  function tutupModal() {
    var modal = document.getElementById("customModal");
    if (modal) modal.style.display = "none";
  }
  window.tutupModal = tutupModal;

  kirimPesanBtn.addEventListener("click", function () {
    var nama = document.getElementById("inputNama").value.trim();
    var pesan = document.getElementById("inputPesan").value.trim();
    var subjek = document.getElementById("inputSubjek").value;

    if (nama === "" && pesan === "") {
      tampilkanModal("Mohon isi nama Anda dan pesannya.");
      return;
    } else if (nama === "") {
      tampilkanModal("Mohon isi nama Anda.");
      return;
    } else if (pesan === "") {
      tampilkanModal("Mohon isi pesannya.");
      return;
    }

    var nomorAdmin = "6288211924082";
    var textEncoded =
      "Assalamu'alaikum Admin At-Tibyan,%0A%0ASaya *" +
      nama +
      "*.%0A" +
      "*Perihal: " +
      subjek +
      "*%0A%0A" +
      encodeURIComponent(pesan);

    var urlWA = "https://wa.me/" + nomorAdmin + "?text=" + textEncoded;
    window.open(urlWA, "_blank");
  });
}

// --- 1. Fungsi Mendapatkan Lokasi (GPS) ---
function getLocation() {
  const lokasiStatus = document.getElementById("teks-kota");

  if (navigator.geolocation) {
    // Ubah teks jadi loading
    if (lokasiStatus) lokasiStatus.textContent = "Mencari Lokasi...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // SUKSES: Ambil koordinat
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        getJadwalSholat(lat, long);
        getCityName(lat, long);
      },
      (error) => {
        // GAGAL: User menolak atau GPS mati
        console.warn("GPS Error/Ditolak, menggunakan default Jakarta.");
        getJadwalByCity("Jakarta", "Indonesia");
      }
    );
  } else {
    // Browser tidak support GPS
    console.warn("Browser tidak support Geolocation.");
    getJadwalByCity("Jakarta", "Indonesia");
  }
}

// --- 2. Ambil Jadwal via Koordinat (GPS) ---
async function getJadwalSholat(latitude, longitude) {
  try {
    // LANGSUNG ke API Aladhan (Tanpa Proxy) agar lebih cepat & stabil
    // Menggunakan timestamp hari ini
    const today = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=20`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data API");

    const result = await response.json();

    if (result.data && result.data.timings) {
      updateUI(result.data.timings);
      // Simpan koordinat terakhir jika perlu
      updateLocationTitle("Sesuai Lokasi Anda");
    }
  } catch (error) {
    console.error("Error Fetch Koordinat:", error);
    // Jika gagal koordinat, coba fallback ke Jakarta
    getJadwalByCity("Jakarta", "Indonesia");
  }
}

// --- 3. Ambil Jadwal via Nama Kota (Default/Fallback) ---
async function getJadwalByCity(city, country) {
  try {
    updateLocationTitle(city);

    // LANGSUNG ke API Aladhan (Tanpa Proxy)
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=20`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data Kota");

    const result = await response.json();

    if (result.data && result.data.timings) {
      updateUI(result.data.timings);
    }
  } catch (error) {
    console.error("Error Fetch Kota:", error);
    // Jika masih error juga, tampilkan strip di UI
    updateUI({
      Fajr: "--:--",
      Dhuhr: "--:--",
      Asr: "--:--",
      Maghrib: "--:--",
      Isha: "--:--",
    });

    const lokasiStatus = document.getElementById("teks-kota");
    if (lokasiStatus) lokasiStatus.textContent = "Gagal Memuat Data";
  }
}
// --- LOGIKA FORMULIR PENDAFTARAN (BARU) ---
const formPendaftaran = document.getElementById("formPendaftaran");
if (formPendaftaran) {
  formPendaftaran.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil nilai input
    const nama = document.getElementById("namaLengkap").value;
    const ttl = document.getElementById("tempatTanggalLahir").value;
    const wali = document.getElementById("namaWali").value;
    const alamat = document.getElementById("alamatLengkap").value;
    const program = document.getElementById("programPilihan").value;
    const wa = document.getElementById("noWhatsapp").value;

    // Nomor Admin (GANTI DENGAN NOMOR ANDA, format 628...)
    const nomorAdmin = "6281234567890";

    // Format Pesan
    const pesan = `
*PENDAFTARAN SANTRI BARU AT-TIBYAN*
---------------------------
Nama: ${nama}
TTL: ${ttl}
Wali: ${wali}
Alamat: ${alamat}
Program: ${program}
No WA: ${wa}
---------------------------
Mohon info selanjutnya min.
    `.trim();

    // Buka WhatsApp
    const urlWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(
      pesan
    )}`;
    window.open(urlWA, "_blank");
  });
}
// --- INTEGRASI GOOGLE SHEETS UNTUK DONASI ---
// Ganti URL di bawah ini dengan Link CSV dari Langkah 1
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLa8ynmol4yQaWbP7b1VL48ZAZkA9wpHmEXEK2qb3tDqI0BEYSeCCOXDkGfH7qFwp4th9NcGThRSue/pub?output=csv";

// Fungsi Utama: Load Data
async function loadDonasiData() {
  const tabelBody = document.getElementById("tabelDonasiBody");
  // Cek apakah kita sedang di halaman donasi
  if (!tabelBody) return;

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    const dataText = await response.text();

    // Ubah CSV teks menjadi Array Objek
    const dataDonasiLive = parseCSV(dataText);

    // Jika data berhasil diambil, render ulang tabel & hitung saldo
    if (dataDonasiLive.length > 0) {
      console.log("Data donasi berhasil dimuat dari Google Sheets");
      renderTabelDonasi(dataDonasiLive);
      hitungTotalDonasi(dataDonasiLive);
    }
  } catch (error) {
    console.error(
      "Gagal ambil data Google Sheet, menggunakan data bawaan/manual.",
      error
    );
    // Jika gagal, biarkan data hardcoded yang muncul (tidak melakukan apa-apa)
  }
}

// Helper: Memecah Text CSV menjadi Array
function parseCSV(csvText) {
  const lines = csvText.split("\n");
  const result = [];
  // Mulai dari i=1 untuk melewati Header (Baris Judul)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split berdasarkan koma (Hati-hati: Jangan pakai koma di dalam isi cell excel!)
    const cols = line.split(",");

    if (cols.length >= 4) {
      result.push({
        tanggal: cols[0].trim(),
        keterangan: cols[1].trim(),
        jenis: cols[2].trim(), // 'Masuk' atau 'Keluar'
        jumlah: parseInt(cols[3].trim()) || 0,
      });
    }
  }
  return result;
}

// Fungsi Render Tabel (Menimpa tabel lama dengan data baru)
function renderTabelDonasi(data) {
  const tbody = document.getElementById("tabelDonasiBody");
  tbody.innerHTML = ""; // Bersihkan tabel lama

  data.forEach((item) => {
    const row = document.createElement("tr");

    // Tentukan warna nominal (Hijau=Masuk, Merah=Keluar)
    const warnaClass =
      item.jenis.toLowerCase() === "masuk" ? "val-green" : "val-red";
    const tanda = item.jenis.toLowerCase() === "masuk" ? "+" : "-";

    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.keterangan}</td>
      <td><span class="badge ${item.jenis.toLowerCase()}">${
      item.jenis
    }</span></td>
      <td style="text-align: right;" class="${warnaClass}">
        ${tanda} Rp ${item.jumlah.toLocaleString("id-ID")}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Fungsi Hitung Saldo & Total
function hitungTotalDonasi(data) {
  let masuk = 0;
  let keluar = 0;

  data.forEach((item) => {
    if (item.jenis.toLowerCase() === "masuk") {
      masuk += item.jumlah;
    } else if (item.jenis.toLowerCase() === "keluar") {
      keluar += item.jumlah;
    }
  });

  // Update Angka di Card Atas
  const elMasuk = document.getElementById("totalMasuk");
  const elKeluar = document.getElementById("totalKeluar");
  const elSaldo = document.getElementById("totalSaldo");

  if (elMasuk) elMasuk.innerText = `Rp ${masuk.toLocaleString("id-ID")}`;
  if (elKeluar) elKeluar.innerText = `Rp ${keluar.toLocaleString("id-ID")}`;
  if (elSaldo)
    elSaldo.innerText = `Rp ${(masuk - keluar).toLocaleString("id-ID")}`;
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Jalankan fungsi asli dulu (jika ada)
  // Lalu coba timpa dengan data Google Sheet
  loadDonasiData();
});
