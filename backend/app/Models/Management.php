<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Management extends Model
{
    use HasFactory;

    protected $table = 'managements'; // ✅ tambahkan baris ini

    protected $fillable = ['img_id', 'img_en'];
}
