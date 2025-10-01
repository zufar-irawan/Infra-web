<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class PresenceStudent extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'id',
        'nis',
        'nama',
        'gender',
        'rfid_id',
        'kelas_id',
        'telepon_wali',
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function rfid()
    {
        return $this->belongsTo(Rfid::class);
    }

    public function absensi()
    {
        return $this->hasMany(AbsenSiswa::class, 'siswa_id', 'id');
    }

    public function absenSiswa()
    {
        return $this->hasMany(AbsenSiswa::class, 'siswa_id', 'id');
    }
}
