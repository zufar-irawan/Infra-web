<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PresenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'siswa_id' => 'required|exists:siswas,id',
            'tanggal' => 'required|date',
            'status' => 'required|in:absen_masuk,absen_pulang,izin,sakit,alfa',
            'keterangan' => 'nullable|string|max:255',
        ];

        if (in_array($this->status, ['absen_masuk', 'absen_pulang'])) {
            $rules['jam_masuk'] = 'nullable|date_format:H:i';
            $rules['jam_pulang'] = 'nullable|date_format:H:i';
            $rules['status_masuk'] = 'nullable|in:telat,tepat_waktu';
        }

        return $rules;
    }
}