<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsClassStudent extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'student_id'
    ];

    public function class()
    {
        return $this->belongsTo(LmsClass::class);
    }

    public function student()
    {
        return $this->belongsTo(LmsStudent::class);
    }
}
