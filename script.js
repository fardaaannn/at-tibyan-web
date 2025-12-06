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
    if (scrollTop > 300) backToTopBtn.classList.add("show");
    else backToTopBtn.classList.remove("show");
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- 3. DATABASE MATERI (UPDATE STRUKTUR BARU) ---
const databaseMateri = [
  {
    judul: "Beranda At-Tibyan",
    kategori: "Halaman Utama",
    link: "index.html",
    isi: "Selamat datang, pengumuman, dan berita terbaru.",
  },
  {
    judul: "Profil At-Tibyan",
    kategori: "Profil Lembaga",
    link: "profil.html",
    isi: "Sejarah, Visi Misi, dan latar belakang berdirinya At-Tibyan.",
  },
  {
    judul: "Alamat & Lokasi",
    kategori: "Peta & Wilayah",
    link: "alamat.html",
    isi: "Lokasi lengkap, peta Google Maps Depok.",
  },
  {
    judul: "Kontak Kami",
    kategori: "Hubungi Admin",
    link: "kontak.html",
    isi: "Nomor WhatsApp, Email, dan Formulir Pertanyaan.",
  },
  {
    judul: "Daftar Guru & Yayasan",
    kategori: "Struktur Organisasi",
    link: "guru.html",
    isi: "Daftar pemimpin yayasan, wakil, sekertaris dan tenaga pengajar.",
  },
  {
    judul: "Donasi Pembangunan",
    kategori: "Infaq & Shodaqoh",
    link: "donasi.html",
    isi: "Informasi rekening donasi untuk pembangunan gedung dan fasilitas.",
  },
];

// --- 4. LOGIKA PENCARIAN ---
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

if (searchInput) {
  searchInput.addEventListener("keyup", function (e) {
    const keyword = e.target.value.toLowerCase();
    if (e.key === "Enter" && keyword.length > 0) {
      window.location.href = `pencarian.html?q=${keyword}`;
      return;
    }
    searchResults.innerHTML = "";
    if (keyword.length === 0) {
      searchResults.classList.remove("active");
      return;
    }
    const hasilFilter = databaseMateri.filter((item) => {
      return (
        item.judul.toLowerCase().includes(keyword) ||
        item.isi.toLowerCase().includes(keyword)
      );
    });

    if (hasilFilter.length > 0) {
      searchResults.classList.add("active");
      hasilFilter.forEach((item) => {
        const linkItem = document.createElement("a");
        linkItem.classList.add("search-item");
        linkItem.href = item.link;
        linkItem.innerHTML = `<h4>${item.judul}</h4><p>${item.kategori}</p>`;
        searchResults.appendChild(linkItem);
      });
    } else {
      searchResults.classList.add("active");
      searchResults.innerHTML = `<div class="no-result">Tidak ditemukan...</div>`;
    }
  });
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove("active");
    }
  });
}

// --- 5. MENU HP ---
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.style.display = nav.style.display === "block" ? "none" : "block";
  });
}

// --- 6. HASIL PENCARIAN PAGE ---
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
    hasil.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("result-card");
      div.style.marginBottom = "20px";
      div.style.padding = "20px";
      div.style.background = "var(--card-bg)";
      div.style.borderRadius = "10px";
      div.style.border = "1px solid var(--border-color)";
      div.innerHTML = `<h3><a href="${item.link}" style="text-decoration:none; color:var(--blue-apple);">${item.judul}</a></h3><p style="color:var(--text-color);">${item.isi}</p>`;
      containerHasil.appendChild(div);
    });
    if (hasil.length === 0)
      containerHasil.innerHTML =
        "<p class='empty-state'>Tidak ditemukan materi.</p>";
  }
}
