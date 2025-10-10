<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsAttendance extends Model
{
    use HasFactory;

    protected $table = 'lms_attendance';

    protected $fillable = [
        'class_id',
        'student_id',
        'date',
        'attendance_status',
        'time_in',
        'time_out',
        'status',
        'description'
    ];

    public function class()
    {
        return $this->belongsTo(LmsClass::class, 'class_id');
    }

    public function student()
    {
        return $this->belongsTo(LmsStudent::class, 'student_id');
    }
}
