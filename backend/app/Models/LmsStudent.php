<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LmsUser;
use App\Models\LmsClass;
use App\Models\LmsClassStudent;

class LmsStudent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nis',
        'class_id',
        'guardian_name',
        'guardian_contact',
        'rfid_id',
        'enrollment_date',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(LmsUser::class, 'user_id');
    }

    public function class()
    {
        return $this->belongsTo(LmsClass::class, 'class_id');
    }

    public function classStudents()
    {
        return $this->hasMany(LmsClassStudent::class, 'student_id');
    }

    public function rfid()
    {
        return $this->belongsTo(LmsRfid::class, 'rfid_id');
    }
}
