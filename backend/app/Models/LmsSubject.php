<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'description',
        'weekly_hours',
        'status'
    ];

    public function classTeachers()
    {
        return $this->hasMany(LmsClassTeacher::class, 'subject_id');
    }
}
