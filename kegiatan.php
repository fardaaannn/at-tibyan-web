<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kegiatan & Galeri - At-Tibyan</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* CSS Tambahan Galeri */
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 30px; }
        .gallery-card { background: var(--card-bg); border-radius: 18px; overflow: hidden; box-shadow: 0 4px 12px var(--shadow-color); transition: transform 0.3s ease; position: relative; }
        .gallery-card:hover { transform: translateY(-5px); }
        .media-wrapper { width: 100%; height: 200px; background: #eee; position: relative; }
        .media-wrapper img, .media-wrapper iframe { width: 100%; height: 100%; object-fit: cover; border: none; }
        .card-content { padding: 20px; }
        .card-date { font-size: 12px; color: #888; margin-bottom: 5px; display: block; }
        .card-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: var(--text-color); }
        .card-desc { font-size: 14px; color: var(--text-color); opacity: 0.8; line-height: 1.5; }
        .badge-tipe { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; backdrop-filter: blur(4px); }
        
        /* Reset tombol dark mode */
        #themeToggle { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
        #themeToggle svg { stroke: var(--text-color); }
    </style>
</head>
<body>
    <header>
      <div class="header-content">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 100%;">
            
            <div class="header-left-group" style="display: flex; align-items: center; height: 100%;">
                <a href="index.html" class="logo" style="display: flex; align-items: center; height: 100%; margin: 0; padding: 0; line-height: normal;">At-Tibyan</a>
                
                <nav>
                    <ul>
                        <li><a href="index.html">Beranda</a></li>
                        <li><a href="profil.html">Profil</a></li>
                        <li><a href="kegiatan.php" class="active">Kegiatan</a></li>
                        <li><a href="alamat.html">Alamat</a></li>
                        <li><a href="guru.html">Guru</a></li>
                        <li><a href="donasi.html">Donasi</a></li>
                        <li><a href="kontak.html">Kontak</a></li>
                        <li><a href="pendaftaran.html">Pendaftaran</a></li>
                    </ul>
                </nav>
            </div>

            <div style="display: flex; align-items: center; gap: 15px;">
                <button id="themeToggle" title="Ganti Mode">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                <div class="menu-toggle"><span></span><span></span><span></span></div>
            </div>

        </div>
      </div>
    </header>

    <div class="container">
        <article class="content-wrapper">
            <div class="breadcrumb"></div>
            <h1>Dokumentasi Kegiatan</h1>
            <p>Berbagai aktivitas santri, kajian, dan kegiatan sosial di Pondok Pesantren At-Tibyan.</p>

            <div class="gallery-grid">
                <?php
                $query = mysqli_query($conn, "SELECT * FROM kegiatan WHERE status = 'aktif' ORDER BY id DESC");
                if (mysqli_num_rows($query) > 0) {
                    while ($row = mysqli_fetch_assoc($query)) {
                        $media = "";
                        $tanggal = !empty($row['tanggal']) ? date('d M Y', strtotime($row['tanggal'])) : '-';
                        if ($row['tipe'] == 'foto') {
                            $media = "<img src='uploads/{$row['file_path']}' alt='Foto Kegiatan' loading='lazy'>";
                        } else {
                            $media = "<iframe src='{$row['file_path']}' allowfullscreen></iframe>";
                        }
                        echo "
                        <div class='gallery-card'>
                            <div class='media-wrapper'>
                                <span class='badge-tipe'>".ucfirst($row['tipe'])."</span>
                                $media
                            </div>
                            <div class='card-content'>
                                <span class='card-date'>$tanggal</span>
                                <div class='card-title'>".htmlspecialchars($row['judul'])."</div>
                                <div class='card-desc'>".nl2br(htmlspecialchars($row['deskripsi']))."</div>
                            </div>
                        </div>";
                    }
                } else {
                    echo "<p style='grid-column: 1/-1; text-align: center; opacity: 0.6;'>Belum ada kegiatan.</p>";
                }
                ?>
            </div>
        </article>
    </div>
    <script src="script.js"></script>
</body>
</html>