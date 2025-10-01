<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PresenceSetting extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'mulai_masuk_siswa',
        'jam_masuk_siswa',
        'jam_pulang_siswa',
        'batas_pulang_siswa',
    ];

    public static function quickRandom($length = 16)
    {
        $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return substr(str_shuffle(str_repeat($pool, 5)), 0, $length);
    }
}
