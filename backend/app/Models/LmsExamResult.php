<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsExamResult extends Model
{
    use HasFactory;

    protected $table = 'lms_exam_results';

    protected $fillable = [
        'exam_id',
        'student_id',
        'score',
        'grade',
        'feedback'
    ];

    public function exam()
    {
        return $this->belongsTo(LmsExam::class, 'exam_id');
    }

    public function student()
    {
        return $this->belongsTo(LmsStudent::class, 'student_id');
    }
}
