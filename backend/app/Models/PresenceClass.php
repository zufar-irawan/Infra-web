<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class PresenceClass extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    // protected $table = 'kelas';

    protected $fillable = [
        'id',
        'nama',
        'guru_id',
    ];

    public function siswa()
    {
        return $this->hasMany(PresenceStudent::class);
    }

    public function guru()
    {
        return $this->belongsTo(PresenceTeacher::class);
    }
}
