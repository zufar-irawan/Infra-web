<?php

// app/Models/Extracurricular.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Extracurricular extends Model
{
    protected $fillable = [
        'name_id','name_en','img','ig','is_active','sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
