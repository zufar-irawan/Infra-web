<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsClassTeacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'teacher_id',
        'subject_id'
    ];

    public function class()
    {
        return $this->belongsTo(LmsClass::class);
    }

    public function teacher()
    {
        return $this->belongsTo(LmsTeacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(LmsSubject::class);
    }
}
