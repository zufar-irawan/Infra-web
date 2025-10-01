<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PresenceRfid extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id', 
        'code',
        'status',
    ];

    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }
}