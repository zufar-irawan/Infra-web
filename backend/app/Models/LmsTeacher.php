<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsTeacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nip',
        'specialization',
        'join_date',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(LmsUser::class, 'user_id');
    }

    public function classTeachers()
    {
        return $this->hasMany(LmsClassTeacher::class, 'teacher_id');
    }
}
