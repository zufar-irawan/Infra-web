<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsClass extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'status'];

    public function students()
    {
        return $this->belongsToMany(LmsStudent::class, 'lms_class_students', 'class_id', 'student_id')->withTimestamps();
    }

    public function classStudents()
    {
        return $this->hasMany(LmsClassStudent::class, 'class_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(LmsTeacher::class, 'lms_class_teachers', 'class_id', 'teacher_id')->withPivot('subject_id')->withTimestamps();
    }
}
