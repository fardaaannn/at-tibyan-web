<!DOCTYPE html>
<html lang="id">
<head>
    <title>Login Admin - At-Tibyan</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        /* Pastikan body memenuhi layar agar posisi absolute berfungsi dengan baik */
        body { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            position: relative; /* Penting untuk posisi tombol dark mode */
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        .login-box { 
            width: 100%; 
            max-width: 400px; 
            padding: 40px; 
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Styling Tombol Dark Mode */
        .theme-toggle-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-color);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
        .theme-toggle-btn:hover {
            transform: scale(1.1);
        }
        .theme-toggle-btn svg {
            width: 22px;
            height: 22px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
    </style>
    
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        })();
    </script>
</head>
<body>

    <button class="theme-toggle-btn" id="themeToggle" title="Ganti Tema">
        <svg id="iconSun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="display: none;">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg id="iconMoon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>

    <div class="summary-card login-box">
        <h2 style="text-align:center; margin-bottom:20px;">Admin Login</h2>
        <form method="POST">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" name="login" class="submit-btn" style="width:100%">Masuk</button>
        </form>
    </div>

    <?php
    session_start();
    include 'config.php';

    if (isset($_POST['login'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Pastikan koneksi DB ($conn) valid di config.php
        // Menggunakan prepared statement (opsional tapi disarankan) atau query biasa
        $cek = mysqli_query($conn, "SELECT * FROM admin WHERE username = '$username'");
        
        if($cek){
            $data = mysqli_fetch_assoc($cek);

            // Cek Password (plain text sesuai request)
            if ($data && $password == $data['password']) { 
                $_SESSION['admin'] = true;
                echo "<script>
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Selamat datang Admin.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => { window.location='dashboard.php'; });
                </script>";
            } else {
                echo "<script>
                    Swal.fire({
                        icon: 'error',
                        title: 'wkwkwk',
                        text: 'isi username dan password yang benar lee'
                    });
                </script>";
            }
        } else {
            // Error handling jika query gagal
             echo "<script>Swal.fire('Error', 'Database error', 'error');</script>";
        }
    }
    ?>

    <script>
        const toggleBtn = document.getElementById('themeToggle');
        const iconSun = document.getElementById('iconSun');
        const iconMoon = document.getElementById('iconMoon');
        const root = document.documentElement;

        // Fungsi Update Icon
        function updateIcon(theme) {
            if (theme === 'dark') {
                iconMoon.style.display = 'none';
                iconSun.style.display = 'block';
            } else {
                iconMoon.style.display = 'block';
                iconSun.style.display = 'none';
            }
        }

        // Cek status saat loading halaman
        const currentTheme = localStorage.getItem('theme') || 'light';
        updateIcon(currentTheme);

        // Event Listener Tombol
        toggleBtn.addEventListener('click', () => {
            let theme = root.getAttribute('data-theme');
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                updateIcon('light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateIcon('dark');
            }
        });
    </script>
</body>
</html>