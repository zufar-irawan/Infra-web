<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Halaman Tidak Ditemukan</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { color-scheme: light dark; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #fff;
            color: #111827;
        }
        .card {
            width: 100%;
            max-width: 640px;
            text-align: center;
        }
        h1 { font-size: 48px; margin: 0 0 8px; font-weight: 800; }
        p  { font-size: 16px; margin: 0 0 24px; color: #6B7280; }
        .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        a.button {
            display: inline-block;
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
            transition: all .15s ease;
            font-weight: 600;
        }
        a.primary { background: #111827; color: #fff; }
        a.primary:hover { opacity: .9; }
        a.secondary { border: 1px solid #D1D5DB; color: #111827; }
        a.secondary:hover { background: #F9FAFB; }
    </style>
    @vite(["resources/css/app.css", "resources/js/app.js"])
    @stack('head')
    @yield('head')
    @yield('css')
    @yield('styles')
    @yield('style')
</head>
<body>
    <main class="card">
        <h1>404</h1>
        <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <div class="actions">
            <a href="/" class="button primary">Kembali ke Beranda</a>
            <a href="javascript:history.back()" class="button secondary">Kembali</a>
        </div>
    </main>
    @stack('scripts')
    @yield('scripts')
    @yield('script')
</body>
</html>


