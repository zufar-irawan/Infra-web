<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_id',
        'title_en',
        'desc_id',
        'desc_en',
        'date',
        'time',
        'place',
    ];

    public $timestamps = false; // tidak pakai created_at & updated_at
}
