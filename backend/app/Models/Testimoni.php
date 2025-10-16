<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimoni extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'major_id',
        'major_en',
        'message_id',
        'message_en',
        'photo_id',
        'photo_en'
    ];
}
