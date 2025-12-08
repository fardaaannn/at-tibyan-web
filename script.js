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

// --- 7. FITUR JADWAL SHOLAT (Fixed by Gemini) ---
const DEFAULT_CITY = "Depok";
const DEFAULT_COUNTRY = "Indonesia";

document.addEventListener("DOMContentLoaded", () => {
  checkLocationAndFetch();
});

function checkLocationAndFetch() {
  // Menggunakan elemen 'teks-kota' yang benar
  const statusLokasi = document.getElementById("teks-kota");

  if (navigator.geolocation) {
    if (statusLokasi) statusLokasi.textContent = "Mendeteksi Lokasi...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log(`Lokasi ditemukan: ${lat}, ${long}`);

        getJadwalByCoordinates(lat, long);
        getCityName(lat, long);
      },
      (error) => {
        console.warn("Izin lokasi ditolak/error, kembali ke default.", error);
        getJadwalByCity(DEFAULT_CITY, DEFAULT_COUNTRY);
      }
    );
  } else {
    getJadwalByCity(DEFAULT_CITY, DEFAULT_COUNTRY);
  }
}

async function getJadwalByCoordinates(lat, long) {
  try {
    const originalUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${long}&method=20`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      originalUrl
    )}`;

    const response = await fetch(proxyUrl);
    const result = await response.json();

    if (result.data && result.data.timings) {
      updateUI(result.data.timings);
    }
  } catch (error) {
    console.error("Gagal ambil jadwal GPS:", error);
  }
}

async function getCityName(lat, long) {
  try {
    const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=id`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    const locationName = data.locality || data.city || "Lokasi Anda";
    updateLocationTitle(locationName);
  } catch (error) {
    console.error("Gagal cari nama kota:", error);
    updateLocationTitle("Sesuai GPS");
  }
}

// Fungsi yang sebelumnya hilang, kini dikembalikan
async function getJadwalByCity(city, country) {
  try {
    updateLocationTitle(city);
    const originalUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=20`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      originalUrl
    )}`;

    const response = await fetch(proxyUrl);
    const result = await response.json();

    if (result.data && result.data.timings) {
      updateUI(result.data.timings);
    }
  } catch (error) {
    console.error("Gagal ambil jadwal default:", error);
  }
}

// Fungsi Update Judul Lokasi (Hanya SATU versi yang benar)
function updateLocationTitle(namaKota) {
  const elemenJudul = document.getElementById("teks-kota");
  if (elemenJudul) {
    elemenJudul.textContent = `Jadwal Sholat - ${namaKota}`;
  } else {
    // Fallback darurat jika ID teks-kota tidak ketemu
    const cardHeader = document.querySelector(".prayer-header h3");
    if (cardHeader) cardHeader.textContent = `Jadwal Sholat - ${namaKota}`;
  }
}

function updateUI(jadwal) {
  const setTime = (id, time) => {
    const el = document.getElementById(id);
    if (el) el.textContent = time;
  };
  setTime("subuh", jadwal.Fajr);
  setTime("dzuhur", jadwal.Dhuhr);
  setTime("ashar", jadwal.Asr);
  setTime("maghrib", jadwal.Maghrib);
  setTime("isya", jadwal.Isha);
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
