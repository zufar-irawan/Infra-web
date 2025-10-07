<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'type',
        'question_text',
        'points',
    ];

    // === RELATIONS ===
    public function exam()
    {
        return $this->belongsTo(LmsExam::class, 'exam_id');
    }

    public function options()
    {
        return $this->hasMany(LmsExamQuestionOption::class, 'question_id');
    }
}
