<?php

namespace App\Http\Controllers\Device;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LmsDevice;
use App\Models\LmsSetting;
use App\Models\LmsStudent;
use App\Models\LmsRfid;
use App\Models\LmsAttendance;
use Carbon\Carbon;

class PresenceController extends Controller
{
    // === Ubah mode device antara reader <-> add_card ===
    public function changeMode(Request $request)
    {
        $setting = LmsSetting::first();
        if (!$setting) return "SECRET_KEY_NOT_FOUND";

        $device = LmsDevice::firstOrCreate(
            ['id' => $request->device_id],
            [
                'name' => 'Device_' . (LmsDevice::count() + 1),
                'mode' => 'reader',
                'is_active' => 1
            ]
        );

        $device->update([
            'mode' => $device->mode == "add_card" ? "reader" : "add_card"
        ]);

        return $device->mode == "add_card" ? "CARD_ADD_MODE" : "READER_MODE";
    }

    // === Tentukan mode berdasarkan jam sekarang ===
    private function getModeByTime()
    {
        $setting = LmsSetting::first();
        $now = Carbon::now()->format('H:i');

        if ($now >= $setting->mulai_masuk_siswa && $now <= $setting->jam_masuk_siswa) {
            return 'jam_masuk';
        } elseif ($now >= $setting->jam_pulang_siswa && $now <= $setting->batas_pulang_siswa) {
            return 'jam_pulang';
        }
        return null;
    }

    // === Endpoint utama presensi ===
    public function presence(Request $request)
    {
        $setting = LmsSetting::first();
        $device = LmsDevice::firstOrCreate(
            ['id' => $request->device_id],
            [
                'name' => 'Device_' . (LmsDevice::count() + 1),
                'mode' => 'reader',
                'is_active' => 1
            ]
        );

        // === Jika device mode add_card, tambahkan kartu baru ===
        if ($device->mode == 'add_card') {
            $rfid = LmsRfid::where('code', $request->rfid)->first();
            if ($rfid) return "RFID_REGISTERED";

            LmsRfid::create(['code' => $request->rfid]);
            return "RFID_ADDED";
        }

        // === MODE READER ===
        $rfid = LmsRfid::where('code', $request->rfid)->first();
        if (!$rfid) return "RFID_NOT_FOUND";

        $student = LmsStudent::where('rfid_id', $rfid->id)->first();
        if (!$student) return "STUDENT_NOT_FOUND";

        $today = Carbon::now()->format('Y-m-d');
        $now = Carbon::now()->format('H:i:s');
        $mode = $this->getModeByTime();

        // Tentukan mode dan status waktu
        if ($mode == 'jam_masuk') {
            $type = 'clock_in';
            $statusWaktu = (Carbon::now()->format('H:i') > $setting->jam_masuk_siswa) ? 'telat' : 'tepat_waktu';
        } elseif ($mode == 'jam_pulang') {
            $type = 'clock_out';
            $statusWaktu = 'tepat_waktu';
        } else {
            $type = 'clock_in';
            $statusWaktu = 'telat';
        }

        // Cek presensi hari ini
        $attendance = LmsAttendance::where('student_id', $student->id)
            ->where('date', $today)
            ->first();

        // === PROSES CLOCK IN ===
        if ($type == 'clock_in') {
            if ($attendance) return "ALREADY_CLOCKED_IN";

            LmsAttendance::create([
                'class_id' => $student->class_id,
                'student_id' => $student->id,
                'date' => $today,
                'attendance_status' => 'absen_masuk', // sesuai enum migrasi
                'time_in' => $now,
                'status' => $statusWaktu, // telat / tepat_waktu
            ]);

            $this->sendWA($student->guardian_contact, "{$student->user->name} masuk pada $now.");
            return "PRESENCE_CLOCK_IN_SAVED";
        }

        // === PROSES CLOCK OUT ===
        if (!$attendance) {
            // belum clock in → buat baru
            LmsAttendance::create([
                'class_id' => $student->class_id,
                'student_id' => $student->id,
                'date' => $today,
                'attendance_status' => 'absen_pulang',
                'time_out' => $now,
                'status' => 'tepat_waktu',
            ]);
        } else {
            $attendance->update([
                'attendance_status' => 'absen_pulang',
                'time_out' => $now,
            ]);
        }

        $this->sendWA($student->guardian_contact, "{$student->user->name} pulang pada $now.");
        return "PRESENCE_CLOCK_OUT_SAVED";
    }

    // === Kirim WhatsApp sederhana via Wablas ===
    private function sendWA($phone, $message)
    {
        // \Log::info('ENV TEST', [
        //     'api' => env('WABLAS_API_KEY'),
        //     'secret' => env('WABLAS_SECRET_KEY'),
        // ]);

        try {
            if (!$phone) return;
            $apiKey = env('WABLAS_API_KEY');
            $secret = env('WABLAS_SECRET_KEY');

            $phone = preg_replace('/[^0-9]/', '', $phone);
            if (substr($phone, 0, 2) == '08') $phone = '62' . substr($phone, 1);
            elseif (substr($phone, 0, 1) == '8') $phone = '62' . $phone;

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://tegal.wablas.com/api/send-message",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query([
                    'phone' => $phone,
                    'message' => $message,
                ]),
                CURLOPT_HTTPHEADER => ["Authorization: {$apiKey}.{$secret}"],
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
            ]);
            curl_exec($curl);
            curl_close($curl);
        } catch (\Throwable $e) {
            // abaikan error kirim
        }
    }
}
