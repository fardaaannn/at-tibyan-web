// --- Security Signature (Do not remove) ---
console.log(
  "\x43\x72\x65\x61\x74\x65\x64\x20\x62\x79\x20\x46\x61\x72\x64\x61\x6E\x20\x41\x7A\x7A\x75\x68\x72\x69"
);
// --- DATABASE PENCARIAN (Wajib ada agar pencarian jalan) ---
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

// --- 4. LOGIKA PENCARIAN (Hanya jalan di halaman pencarian) ---
const containerHasil = document.getElementById("halamanHasilPencarian");
if (containerHasil) {
  const params = new URLSearchParams(window.location.search);
  const keywordURL = params.get("q");

  if (keywordURL) {
    document.getElementById(
      "judulPencarian"
    ).innerText = `Hasil: "${keywordURL}"`;

    // Filter data berdasarkan keyword
    const hasil = databaseMateri.filter((item) =>
      item.judul.toLowerCase().includes(keywordURL.toLowerCase())
    );

    if (hasil.length > 0) {
      hasil.forEach((item) => {
        const div = document.createElement("div");
        // Style kartu hasil pencarian
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

// --- 5. FUNGSI PENCARIAN GLOBAL (Redirect ke halaman pencarian) ---
function lakukanPencarian() {
  // Anda bisa menambahkan input search di header jika mau nanti
  // Contoh sederhana: let keyword = prompt("Cari apa?");
  // if(keyword) window.location.href = `pencarian.html?q=${keyword}`;
}
