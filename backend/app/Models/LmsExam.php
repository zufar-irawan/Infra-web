<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsExam extends Model
{
    use HasFactory;

    protected $table = 'lms_exams';

    protected $fillable = [
        'subject_id',
        'class_id',
        'title',
        'description',
        'date',
        'start_time',
        'end_time',
        'room_id',
        'created_by'
    ];

    public function subject()
    {
        return $this->belongsTo(LmsSubject::class, 'subject_id');
    }

    public function class()
    {
        return $this->belongsTo(LmsClass::class, 'class_id');
    }

    public function room()
    {
        return $this->belongsTo(LmsRoom::class, 'room_id');
    }

    public function creator()
    {
        return $this->belongsTo(LmsUser::class, 'created_by');
    }

    public function results()
    {
        return $this->hasMany(LmsExamResult::class, 'exam_id');
    }
}
