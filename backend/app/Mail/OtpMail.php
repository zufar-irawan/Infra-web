<!--

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $verificationCode;

    public function __construct(string $code)
    {
        $this->verificationCode = $code;
    }

    public function build()
    {
        return $this->subject('Kode Verifikasi Login Administrator')
            ->view('emails.admin-login-code')
            ->with([
                'code' => $this->verificationCode,
            ]);
    }
} -->
