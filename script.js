// --- Security Signature (Do not remove) ---
console.log(
  "\x43\x72\x65\x61\x74\x65\x64\x20\x62\x79\x20\x46\x61\x72\x64\x61\x6E\x20\x41\x7A\x7A\x75\x68\x72\x69"
);

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

// --- 5. LOGIKA HALAMAN DONASI & GOOGLE SHEETS ---
// Variabel Global untuk menyimpan data
let globalDataDonasi = [];

const tabelDonasi = document.getElementById("tabelDonasiBody");
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkao52TUQ3llogGF6g9TV_N-ERGmwaI9GqqR5yq6D_R0pKUvIg7VQcFwTgsQ_7ic074sehSB1vg4AM/pub?output=csv";

// Fungsi Utama: Load Data
async function loadDonasiData() {
  if (!tabelDonasi) return;

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    const dataText = await response.text();

    // 1. Simpan data ke variabel global
    globalDataDonasi = parseCSV(dataText);

    // 2. Jika berhasil, render
    if (globalDataDonasi.length > 0) {
      console.log(
        "Data donasi berhasil dimuat:",
        globalDataDonasi.length,
        "baris"
      );
      applyFilterAndRender();
    }
  } catch (error) {
    console.error("Gagal ambil data Google Sheet.", error);
  }
}

// Fungsi Parsing CSV
function parseCSV(csvText) {
  const lines = csvText.split("\n");
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split koma
    const cols = line.split(",");

    if (cols.length >= 4) {
      result.push({
        tanggal: cols[0].trim(), // Format bisa DD/MM/YYYY atau DD-MM-YYYY
        keterangan: cols[1].trim(),
        jenis: cols[2].trim(),
        jumlah: parseInt(cols[3].trim()) || 0,
      });
    }
  }
  return result;
}

// FUNGSI UTAMA: Gabungan Filter & Render
function applyFilterAndRender() {
  const tbody = document.getElementById("tabelDonasiBody");
  const pesanKosong = document.getElementById("pesanKosong");

  // Ambil nilai Filter
  const filterBulan = document.getElementById("filterBulan").value; // "01", "02", ... "all"
  const filterTahun = document.getElementById("filterTahun").value; // "2025", ... "all"

  let totMasuk = 0;
  let totKeluar = 0;
  let dataDitampilkan = 0;

  tbody.innerHTML = ""; // Bersihkan tabel

  // Loop data global
  globalDataDonasi.forEach((item) => {
    // Deteksi Format Tanggal (Bisa "/" atau "-")
    let separator = item.tanggal.includes("/") ? "/" : "-";
    const parts = item.tanggal.split(separator); // [DD, MM, YYYY]

    if (parts.length < 3) return;

    const bulanData = parts[1]; // Index 1 = Bulan
    const tahunData = parts[2]; // Index 2 = Tahun

    // Logika Filter
    const cekBulan = filterBulan === "all" || filterBulan === bulanData;
    const cekTahun = filterTahun === "all" || filterTahun === tahunData;

    if (cekBulan && cekTahun) {
      dataDitampilkan++;

      // Hitung Total
      if (item.jenis.toLowerCase() === "masuk") {
        totMasuk += item.jumlah;
      } else {
        totKeluar += item.jumlah;
      }

      // Render Baris
      const warnaClass =
        item.jenis.toLowerCase() === "masuk" ? "val-green" : "val-red";
      const tanda = item.jenis.toLowerCase() === "masuk" ? "+" : "-";
      const jenisBadge =
        item.jenis.toLowerCase() === "masuk" ? "badge-in" : "badge-out";

      const row = `<tr>
          <td>${item.tanggal}</td>
          <td>${item.keterangan}</td>
          <td><span class="badge ${jenisBadge}">${item.jenis}</span></td>
          <td style="text-align: right;" class="${warnaClass}">
            ${tanda} Rp ${item.jumlah.toLocaleString("id-ID")}
          </td>
      </tr>`;

      tbody.innerHTML += row;
    }
  });

  // Tampilkan/Sembunyikan Pesan Kosong (PERBAIKAN UTAMA)
  if (pesanKosong) {
    pesanKosong.style.display = dataDitampilkan === 0 ? "block" : "none";
  }

  // Update Kartu Total
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

// --- SETUP EVENT LISTENER ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. UPDATE OPSI TAHUN SECARA OTOMATIS (Tanpa ubah HTML)
  const filterTahun = document.getElementById("filterTahun");
  if (filterTahun) {
    filterTahun.innerHTML = `
      <option value="all">Semua Tahun</option>
      <option value="2025">2025</option>
      <option value="2026">2026</option>
    `;
  }

  // 2. Load Data Google Sheet
  loadDonasiData();

  // 3. Pasang Listener Filter
  const filterBulanEl = document.getElementById("filterBulan");
  if (filterBulanEl)
    filterBulanEl.addEventListener("change", applyFilterAndRender);
  if (filterTahun) filterTahun.addEventListener("change", applyFilterAndRender);

  // 4. Init Jadwal Sholat
  initJadwalSholat();
});

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

// --- SISTEM JADWAL SHOLAT (ANTI-GAGAL) ---
function initJadwalSholat() {
  const lokasiStatus = document.getElementById("teks-kota");
  if (lokasiStatus) lokasiStatus.textContent = "Mencari Lokasi...";

  const timeoutGPS = setTimeout(() => {
    console.warn("GPS kelamaan, beralih ke Default (Jakarta)");
    getJadwalByCity("Jakarta", "Indonesia");
  }, 5000);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutGPS);
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        getJadwalByCoords(lat, long);
        getCityName(lat, long);
      },
      (error) => {
        clearTimeout(timeoutGPS);
        console.warn("Akses lokasi ditolak/error, load Default.");
        getJadwalByCity("Jakarta", "Indonesia");
      }
    );
  } else {
    clearTimeout(timeoutGPS);
    getJadwalByCity("Jakarta", "Indonesia");
  }
}

async function getJadwalByCoords(lat, long) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${long}&method=20`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.code === 200 && result.data) {
      updateUI(result.data.timings);
      updateLocationTitle("Sesuai Lokasi Anda");
    } else {
      throw new Error("Data API kosong");
    }
  } catch (error) {
    console.error("Error Fetch GPS:", error);
    getJadwalByCity("Jakarta", "Indonesia");
  }
}

async function getJadwalByCity(city, country) {
  try {
    updateLocationTitle(city);
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=20`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.code === 200 && result.data) {
      updateUI(result.data.timings);
    }
  } catch (error) {
    console.error("Error Fetch Kota:", error);
    updateUI({ Fajr: "-", Dhuhr: "-", Asr: "-", Maghrib: "-", Isha: "-" });
    const status = document.getElementById("teks-kota");
    if (status) status.textContent = "Gagal Memuat Data";
  }
}

function updateUI(timings) {
  const idMap = {
    shubuh: timings.Fajr,
    dzuhur: timings.Dhuhr,
    ashar: timings.Asr,
    maghrib: timings.Maghrib,
    isya: timings.Isha,
  };

  for (const [id, waktu] of Object.entries(idMap)) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = waktu;
    }
  }
}

function updateLocationTitle(text) {
  const el = document.getElementById("teks-kota");
  if (el) el.textContent = text;
}

async function getCityName(lat, long) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=id`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.city || data.locality) {
      updateLocationTitle(data.city || data.locality);
    }
  } catch (e) {
    console.log("Gagal ambil nama kota, biarkan default.");
  }
}
// --- LOGIKA FORMULIR PENDAFTARAN (BARU) ---
const formPendaftaran = document.getElementById("formPendaftaran");
if (formPendaftaran) {
  formPendaftaran.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("namaLengkap").value;
    const ttl = document.getElementById("tempatTanggalLahir").value;
    const wali = document.getElementById("namaWali").value;
    const alamat = document.getElementById("alamatLengkap").value;
    const program = document.getElementById("programPilihan").value;
    const wa = document.getElementById("noWhatsapp").value;

    const nomorAdmin = "6281234567890";

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

    const urlWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(
      pesan
    )}`;
    window.open(urlWA, "_blank");
  });
}
