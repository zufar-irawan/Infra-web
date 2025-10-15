<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_id',
        'title_en',
        'desc_id',
        'desc_en',
        'image',
        'date',
    ];
}
