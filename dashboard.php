<?php
session_start();
if (!isset($_SESSION['admin'])) { header("Location: login.php"); exit; }
include 'config.php';

// Fungsi Helper
function convertToEmbed($url) {
    $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
    if (preg_match($pattern, $url, $matches)) return "https://www.youtube.com/embed/" . $matches[1];
    return $url; 
}

$msg = ""; $msg_type = "";

// Logic Arsip
if (isset($_GET['arsipkan'])) {
    $id = intval($_GET['arsipkan']);
    $conn->query("UPDATE kegiatan SET status = 'arsip' WHERE id = $id");
    $msg = "Data berhasil diarsipkan."; $msg_type = "success";
}

// Logic Upload
if (isset($_POST['upload'])) {
    $judul = htmlspecialchars(trim($_POST['judul']));
    $deskripsi = htmlspecialchars(trim($_POST['deskripsi']));
    $tipe = $_POST['tipe'];
    $simpanData = ""; $error = false;

    if ($tipe == 'foto') {
        $ext = strtolower(pathinfo($_FILES['file_gambar']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg','jpeg','png','gif'])) { $msg = "Format file salah!"; $error = true; }
        else {
            $newFile = uniqid('img_') . '.' . $ext;
            move_uploaded_file($_FILES['file_gambar']['tmp_name'], "uploads/" . $newFile);
            $simpanData = $newFile;
        }
    } else {
        $simpanData = convertToEmbed($_POST['link_video']);
    }

    if (!$error) {
        $stmt = $conn->prepare("INSERT INTO kegiatan (judul, deskripsi, tipe, file_path) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $judul, $deskripsi, $tipe, $simpanData);
        if($stmt->execute()) { $msg = "Berhasil disimpan!"; $msg_type = "success"; }
        else { $msg = "Error DB"; $msg_type = "error"; }
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin</title>
    <link rel="stylesheet" href="style.css">
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    
    <style>
        /* Layout Admin */
        body { padding-bottom: 50px; }
        .container { max-width: 800px; padding-top: 30px; }
        
        .summary-card { 
            background: var(--card-bg); 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px var(--shadow-color);
            color: var(--text-color);
        }
        
        input, select, textarea {
            width: 100%; padding: 12px; border: 1px solid var(--border-color);
            background: var(--input-bg); color: var(--text-color); 
            border-radius: 8px; box-sizing: border-box; margin-bottom: 15px;
        }
        label { font-weight: 600; color: var(--text-color); display: block; margin-bottom: 5px; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; color: var(--text-color); }
        th, td { padding: 12px; border-bottom: 1px solid var(--border-color); text-align: left; }
        
        .btn-logout { color: #ff3b30; font-weight: 600; text-decoration: none; border: 1px solid #ff3b30; padding: 6px 12px; border-radius: 6px; }
        .btn-logout:hover { background: #ff3b30; color: white; }
        
        #themeToggle { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
        #themeToggle svg { stroke: var(--text-color); }

        .hidden { display: none; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 8px; background: rgba(52, 199, 89, 0.1); color: #34c759; border: 1px solid #34c759; }
        .alert.error { background: rgba(255, 59, 48, 0.1); color: #ff3b30; border: 1px solid #ff3b30; }
    </style>
</head>
<body>
    <header>
        <div class="header-content" style="display: flex; justify-content: space-between; align-items: center;">
            
            <div class="logo">Admin Panel</div>
            
            <div style="display: flex; align-items: center; gap: 20px;">
                <button id="themeToggle" title="Ganti Mode">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                
                <a href="logout.php" class="btn-logout">Keluar</a>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="summary-card">
            <?php
// Ambil jam sekarang (format 0-23)
$jam = date('H'); 
$sapaan = "";

// Logika IF-ELSE BERTINGKAT
if ($jam < 10) {
    $sapaan = "Selamat Pagi";
} elseif ($jam < 15) {
    $sapaan = "Selamat Siang";
} elseif ($jam < 18) {
    $sapaan = "Selamat Sore";
} else {
    $sapaan = "Selamat Malam";
}
?>

<h3>Halo Admin, <?= $sapaan ?>! Semangat mengelola website.</h3>
            <h2 style="margin-bottom: 20px;">Upload Kegiatan</h2>
            <?php if ($msg) echo "<div class='alert $msg_type'>$msg</div>"; ?>
                
                <label>Tipe</label>
                <select name="tipe" id="pilihTipe" onchange="cekTipe()">
                    <option value="foto">Foto</option>
                    <option value="video">Video</option>
                </select>
                
                <div id="inputFoto">
                    <label>File Gambar</label>
                    <input type="file" name="file_gambar">
                </div>
                
                <div id="inputVideo" class="hidden">
                    <label>Link YouTube</label>
                    <input type="url" name="link_video" placeholder="https://...">
                </div>
                
                <button type="submit" name="upload" class="submit-btn" style="width:100%; margin-top:10px;">Posting</button>
            </form>

            <h3 style="margin-top: 40px; margin-bottom: 15px;">Daftar Kegiatan Aktif</h3>
            <table>
                <tr><th>No</th><th>Judul</th><th>Aksi</th></tr>
                <?php
                $q = $conn->query("SELECT * FROM kegiatan WHERE status='aktif' ORDER BY id DESC");
                $no=1;
                while($r=$q->fetch_assoc()): ?>
                <tr>
                    <td><?=$no++?></td>
                    <td><?=htmlspecialchars($r['judul'])?></td>
                    <td>
                        <a href="?arsipkan=<?=$r['id']?>" onclick="return confirm('Sembunyikan konten ini?')" style="color: #ff9500; font-weight: 600; text-decoration: none;">Arsipkan</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            </table>
        </div>
    </div>

    <script src="script.js"></script>
    
    <script>
        function cekTipe() {
            let val = document.getElementById('pilihTipe').value;
            if(val === 'video'){
                document.getElementById('inputVideo').classList.remove('hidden');
                document.getElementById('inputFoto').classList.add('hidden');
            } else {
                document.getElementById('inputVideo').classList.add('hidden');
                document.getElementById('inputFoto').classList.remove('hidden');
            }
        }
    </script>
</body>
</html>