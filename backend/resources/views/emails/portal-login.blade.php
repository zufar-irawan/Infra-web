<!DOCTYPE html>
<html lang="id">
  <body style="font-family: Arial, sans-serif; background: #f7f9fc; padding: 30px;">
    <div style="background: white; max-width: 480px; margin:auto; border-radius:10px; padding: 30px; border: 1px solid #eee;">
      <h2 style="color:#243771; margin-top:0;">Kode Verifikasi Login</h2>
      <p>Halo,</p>
      <p>Gunakan kode berikut untuk login ke portal <b>Administrator SMK Prestasi Prima</b>:</p>

      <div style="font-size:28px; font-weight:bold; color:#FE4D01; letter-spacing:6px; text-align:center; margin:25px 0;">
        {{ $kode }}
      </div>

      <p>Kode ini berlaku selama <b>5 menit</b> dan hanya bisa digunakan satu kali.</p>

      <p style="margin-top:20px; font-size:12px; color:#888;">
        Email ini dikirim otomatis oleh sistem. Jika Anda tidak meminta kode login, abaikan email ini.
      </p>
    </div>
  </body>
</html>
